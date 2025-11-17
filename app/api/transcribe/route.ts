import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserInfoFromRequest } from "@/lib/api-helpers";
import { syncUserToDatabase } from "@/lib/user-sync";

// Configure route for longer processing times (Railway timeout handling)
export const maxDuration = 60; // 60 seconds max duration
export const runtime = "nodejs"; // Use Node.js runtime (not Edge)

// In-memory storage for partial transcripts (in production, use Redis or similar)
const partialTranscripts = new Map<string, string>();

/**
 * Apply dictionary corrections to transcribed text
 */
function applyDictionaryCorrections(
  text: string,
  dictionaryWords: Array<{ phrase: string; correction: string }>
): string {
  let correctedText = text;
  
  // Sort by phrase length (longest first) to handle multi-word phrases correctly
  const sortedWords = [...dictionaryWords].sort((a, b) => b.phrase.length - a.phrase.length);
  
  for (const { phrase, correction } of sortedWords) {
    // Case-insensitive replacement
    const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    correctedText = correctedText.replace(regex, correction);
  }
  
  return correctedText;
}

/**
 * Transcribe audio using OpenAI Whisper API
 */
async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  // Validate audio blob
  if (!audioBlob || audioBlob.size === 0) {
    throw new Error("Audio blob is empty or invalid");
  }

  // OpenAI Whisper API has a 25MB file size limit
  const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB in bytes
  if (audioBlob.size > MAX_FILE_SIZE) {
    throw new Error(`Audio file is too large (${(audioBlob.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 25MB.`);
  }

  // Convert blob to File-like object for FormData
  // OpenAI Whisper API requires the file to have a proper extension
  // Determine file extension based on MIME type
  let fileExtension = "webm";
  let cleanMimeType = "audio/webm";
  
  // Extract base MIME type (remove codec info)
  if (audioBlob.type) {
    const baseType = audioBlob.type.split(";")[0].trim();
    if (baseType === "audio/webm" || baseType.includes("webm")) {
      fileExtension = "webm";
      cleanMimeType = "audio/webm";
    } else if (baseType === "audio/ogg" || baseType.includes("ogg")) {
      fileExtension = "ogg";
      cleanMimeType = "audio/ogg";
    } else if (baseType === "audio/wav" || baseType.includes("wav")) {
      fileExtension = "wav";
      cleanMimeType = "audio/wav";
    }
  }
  
  const formData = new FormData();
  
  // Create a File object with proper extension and clean MIME type
  // OpenAI uses the filename extension to determine file format
  const audioFile = new File([audioBlob], `audio.${fileExtension}`, { 
    type: cleanMimeType,
    lastModified: Date.now(),
  });
  
  // Append with explicit filename - OpenAI checks the filename extension
  formData.append("file", audioFile, `audio.${fileExtension}`);
  formData.append("model", "whisper-1");
  formData.append("language", "en"); // Optional: specify language for better accuracy

  try {
    // Add timeout for the fetch request (60 seconds should be enough for most audio)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }));
      const errorMessage = error.error?.message || `OpenAI API error: ${response.status}`;
      
      // Log full error for debugging
      console.error("OpenAI API error:", {
        status: response.status,
        error: error,
        errorMessage: errorMessage,
        fileSize: audioBlob.size,
        fileType: audioBlob.type,
      });
      
      // Provide user-friendly error messages
      if (errorMessage.includes("quota") || errorMessage.includes("billing")) {
        throw new Error("OpenAI API quota exceeded. Please check your billing and plan details at https://platform.openai.com/account/billing");
      } else if (errorMessage.includes("rate limit")) {
        throw new Error("OpenAI API rate limit exceeded. Please try again in a moment.");
      } else if (errorMessage.includes("invalid_api_key")) {
        throw new Error("Invalid OpenAI API key. Please check your OPENAI_API_KEY environment variable.");
      } else if (errorMessage.includes("file_size_exceeded") || errorMessage.includes("too large")) {
        throw new Error("Audio file is too large. Please try recording shorter segments.");
      } else if (errorMessage.includes("Invalid file format") || errorMessage.includes("file format")) {
        // This is the specific error we're getting
        throw new Error(`OpenAI API rejected the audio file format. The file might be corrupted or use an unsupported codec. File size: ${(audioBlob.size / 1024).toFixed(2)} KB, Type: ${audioBlob.type}`);
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.text || "";
  } catch (error) {
    // Handle timeout errors
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Transcription request timed out. The audio file may be too long or the API is slow. Please try again.");
    }
    
    // Re-throw with context for better error handling
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to transcribe audio");
  }
}

/**
 * POST /api/transcribe
 * 
 * Accepts audio blob slice and returns transcribed text
 * 
 * Body (FormData):
 * - audio: Blob (audio/webm)
 * - final: boolean (true if this is the final chunk)
 * 
 * Returns:
 * - text: string (transcribed text, partial or final)
 * - isFinal: boolean
 */
export async function POST(request: NextRequest) {
  let audioFileInfo: { size: string; type: string } | null = null;
  
  try {
    // Verify authentication
    const userInfo = await getUserInfoFromRequest(request);
    if (!userInfo) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Sync user to database
    try {
      await syncUserToDatabase(userInfo.userId, userInfo.email, userInfo.name);
    } catch (dbError) {
      console.error("Database sync error:", dbError instanceof Error ? dbError.message : "Unknown error");
      // Continue - user sync is not critical for transcription
    }

    // Parse FormData
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;
    const finalParam = formData.get("final");
    const isFinal = finalParam === "true" || finalParam === "1";

    if (!audioFile) {
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      );
    }

    // Store file info for error logging
    audioFileInfo = {
      size: `${(audioFile.size / 1024).toFixed(2)} KB`,
      type: audioFile.type || "unknown",
    };

    // Validate audio file size and type
    if (audioFile.size === 0) {
      return NextResponse.json(
        { error: "Audio file is empty" },
        { status: 400 }
      );
    }

    // Log file info for debugging (size in KB) - only in production
    if (process.env.NODE_ENV === "production") {
      console.error("Transcribing audio:", {
        size: audioFileInfo.size,
        type: audioFileInfo.type,
        name: audioFile.name,
      });
    }

    // Convert File to Blob to strip MIME type codec info
    // OpenAI API rejects "audio/webm;codecs=opus" but accepts "audio/webm"
    const audioBlob = await audioFile.arrayBuffer();
    const cleanBlob = new Blob([audioBlob], { type: "audio/webm" });

    // Transcribe audio using OpenAI Whisper
    const rawText = await transcribeAudio(cleanBlob);

    // Get user's dictionary words for corrections (cache could be added here in production)
    let dictionaryWords: Array<{ phrase: string; correction: string }> = [];
    try {
      dictionaryWords = await prisma.dictionaryWord.findMany({
        where: { userId: userInfo.userId },
        select: {
          phrase: true,
          correction: true,
        },
        take: 1000, // Limit to prevent excessive memory usage
      });
    } catch (dbError) {
      console.error("Database query error (dictionary):", dbError instanceof Error ? dbError.message : "Unknown error");
      // Continue without dictionary corrections if DB fails
    }

    // Apply dictionary corrections
    const correctedText = applyDictionaryCorrections(rawText, dictionaryWords);

    // Get or create partial transcript storage for this user
    const storageKey = userInfo.userId;
    const existingPartial = partialTranscripts.get(storageKey) || "";
    
    // Merge with existing partial transcript
    const mergedText = existingPartial 
      ? `${existingPartial} ${correctedText}`.trim()
      : correctedText;

    if (isFinal) {
      // Final chunk - save to database and clear partial storage
      let transcriptId: string | undefined;
      try {
        const transcript = await prisma.transcription.create({
          data: {
            text: mergedText,
            userId: userInfo.userId,
          },
          select: {
            id: true,
            text: true,
            createdAt: true,
            updatedAt: true,
          },
        });
        transcriptId = transcript.id;
      } catch (dbError) {
        console.error("Database save error (transcript):", dbError instanceof Error ? dbError.message : "Unknown error");
        // Continue - return transcript even if DB save fails
      }

      // Clear partial transcript
      partialTranscripts.delete(storageKey);

      return NextResponse.json({
        text: mergedText,
        isFinal: true,
        transcriptId: transcriptId,
      });
    } else {
      // Partial chunk - store for merging with next chunk
      partialTranscripts.set(storageKey, mergedText);

      return NextResponse.json({
        text: correctedText,
        isFinal: false,
      });
    }
  } catch (error) {
    // Enhanced error logging for production debugging
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error("Error in /api/transcribe:", {
      message: errorMessage,
      stack: errorStack,
      audioFile: audioFileInfo,
      env: {
        hasOpenAIKey: !!process.env.OPENAI_API_KEY,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasFirebaseAdmin: !!process.env.FIREBASE_ADMIN_SDK,
      },
    });
    
    return NextResponse.json(
      {
        error: "Failed to transcribe audio",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

