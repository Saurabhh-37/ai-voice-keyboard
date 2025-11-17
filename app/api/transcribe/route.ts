import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserInfoFromRequest } from "@/lib/api-helpers";
import { syncUserToDatabase } from "@/lib/user-sync";

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

  // Convert blob to File-like object for FormData
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.webm");
  formData.append("model", "whisper-1");
  formData.append("language", "en"); // Optional: specify language for better accuracy

  try {
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }));
      const errorMessage = error.error?.message || `OpenAI API error: ${response.status}`;
      
      // Provide user-friendly error messages
      if (errorMessage.includes("quota") || errorMessage.includes("billing")) {
        throw new Error("OpenAI API quota exceeded. Please check your billing and plan details at https://platform.openai.com/account/billing");
      } else if (errorMessage.includes("rate limit")) {
        throw new Error("OpenAI API rate limit exceeded. Please try again in a moment.");
      } else if (errorMessage.includes("invalid_api_key")) {
        throw new Error("Invalid OpenAI API key. Please check your OPENAI_API_KEY environment variable.");
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.text || "";
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw error;
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
  try {
    console.log("📥 POST /api/transcribe - Request received");
    
    // Verify authentication
    const userInfo = await getUserInfoFromRequest(request);
    if (!userInfo) {
      console.error("❌ POST /api/transcribe - Unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("✅ POST /api/transcribe - User authenticated:", userInfo.userId);

    // Sync user to database
    await syncUserToDatabase(userInfo.userId, userInfo.email, userInfo.name);

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

    console.log(`🎙️ Transcribing audio slice: ${audioFile.size} bytes, final: ${isFinal}`);

    // Transcribe audio using OpenAI Whisper
    const rawText = await transcribeAudio(audioFile);
    console.log(`📝 Raw transcription: "${rawText}"`);

    // Get user's dictionary words for corrections
    const dictionaryWords = await prisma.dictionaryWord.findMany({
      where: { userId: userInfo.userId },
      select: {
        phrase: true,
        correction: true,
      },
    });

    // Apply dictionary corrections
    let correctedText = applyDictionaryCorrections(rawText, dictionaryWords);
    
    if (dictionaryWords.length > 0 && correctedText !== rawText) {
      console.log(`🔧 Applied ${dictionaryWords.length} dictionary corrections`);
    }

    // Get or create partial transcript storage for this user
    const storageKey = userInfo.userId;
    const existingPartial = partialTranscripts.get(storageKey) || "";
    
    // Merge with existing partial transcript
    const mergedText = existingPartial 
      ? `${existingPartial} ${correctedText}`.trim()
      : correctedText;

    if (isFinal) {
      // Final chunk - save to database and clear partial storage
      console.log("💾 Saving final transcript to database");
      
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

      // Clear partial transcript
      partialTranscripts.delete(storageKey);

      return NextResponse.json({
        text: mergedText,
        isFinal: true,
        transcriptId: transcript.id,
      });
    } else {
      // Partial chunk - store for merging with next chunk
      partialTranscripts.set(storageKey, mergedText);
      
      console.log(`📊 Partial transcript updated (length: ${mergedText.length})`);

      return NextResponse.json({
        text: correctedText, // Return only the new chunk text for UI
        partial: mergedText, // Include full merged text for debugging
        isFinal: false,
      });
    }
  } catch (error) {
    console.error("❌ Error in /api/transcribe:", error);
    return NextResponse.json(
      {
        error: "Failed to transcribe audio",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

