"use client";

import { useState, useEffect, useRef } from "react";
import { RecordButton } from "@/components/dictation/RecordButton";
import { Waveform } from "@/components/dictation/Waveform";
import { LiveTranscript } from "@/components/dictation/LiveTranscript";
import { RecentTranscripts } from "@/components/transcripts/RecentTranscripts";
import { api } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { useRecorder } from "@/hooks/useRecorder";

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  
  // Use the recording hook
  const {
    isRecording,
    isProcessing,
    audioChunks,
    startRecording,
    stopRecording,
    error: recorderError,
  } = useRecorder();
  
  // State management
  const [liveText, setLiveText] = useState("");
  const [recentTranscripts, setRecentTranscripts] = useState<Array<{ id: string; text: string }>>([]);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const processedChunksRef = useRef<Set<number>>(new Set()); // Track which chunks we've processed

  // Fetch recent transcripts (last 3) - only when user is authenticated
  useEffect(() => {
    // Wait for auth to finish loading and ensure user is logged in
    if (authLoading || !user) {
      return;
    }

    async function fetchRecentTranscripts() {
      if (!user) return;
      
      try {
        const transcripts = await api.getTranscripts();
        const recent = transcripts.slice(0, 3).map((t) => ({
          id: t.id,
          text: t.text,
        }));
        setRecentTranscripts(recent);
      } catch (err) {
        // Silently fail - don't show error on home page
        // Recent transcripts are optional
      }
    }

    fetchRecentTranscripts();
  }, [user, authLoading]);

  // Process audio chunks as they arrive (every 5 seconds during recording)
  // IMPORTANT: MediaRecorder timeslice chunks are NOT standalone valid WebM files
  // We need to accumulate all chunks and send the merged audio for each transcription
  useEffect(() => {
    if (!isRecording || audioChunks.length === 0) {
      return;
    }

    // Get the latest chunk that hasn't been processed
    const latestChunkIndex = audioChunks.length - 1;
    if (processedChunksRef.current.has(latestChunkIndex)) {
      return; // Already processed this chunk
    }

    processedChunksRef.current.add(latestChunkIndex);

    // Accumulate all chunks up to this point to create a valid WebM file
    // MediaRecorder chunks after the first are continuation chunks without headers
    // We need to merge all chunks to create a valid standalone WebM file
    const accumulatedChunks = audioChunks.slice(0, latestChunkIndex + 1);
    const mergedBlob = new Blob(accumulatedChunks, { type: "audio/webm" });

    // Send accumulated audio to transcription API (partial, not final)
    async function transcribeChunk() {
      try {
        setTranscriptionError(null);
        const result = await api.transcribeAudio(mergedBlob, false);
        
        // Append the new text to live transcript
        setLiveText((prev) => {
          const newText = prev ? `${prev} ${result.text}` : result.text;
          return newText.trim();
        });
      } catch (err) {
        setTranscriptionError(
          err instanceof Error ? err.message : "Failed to transcribe audio"
        );
        // Remove from processed set so we can retry
        processedChunksRef.current.delete(latestChunkIndex);
      }
    }

    transcribeChunk();
  }, [audioChunks, isRecording]);

  // Handle final chunk when recording stops
  const wasRecordingRef = useRef(false);
  const finalChunkProcessedRef = useRef(false);
  useEffect(() => {
    // Detect transition from recording to stopped
    if (wasRecordingRef.current && !isRecording && !isProcessing && audioChunks.length > 0 && !finalChunkProcessedRef.current) {
      // Recording just stopped, process final chunk
      finalChunkProcessedRef.current = true;
      
      const processFinalChunk = async () => {
        try {
          setTranscriptionError(null);
          setIsTranscribing(true);
          
          // Wait for MediaRecorder to fire final ondataavailable event
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Get all accumulated chunks and merge them into a valid WebM file
          // MediaRecorder chunks after the first are continuation chunks without headers
          // We need to merge all chunks to create a complete, valid WebM file
          if (audioChunks.length === 0) {
            return;
          }
          
          // Merge all chunks into a single blob for final transcription
          // This creates a complete, valid WebM file with all headers
          const finalBlob = new Blob(audioChunks, { type: "audio/webm" });
          const result = await api.transcribeAudio(finalBlob, true);
          
          // Update live text with final result
          if (result.isFinal && result.text) {
            setLiveText((prev) => {
              const merged = prev ? `${prev} ${result.text}` : result.text;
              return merged.trim();
            });
          }
          
          // Refresh recent transcripts to show the new one
          try {
            const transcripts = await api.getTranscripts();
            const recent = transcripts.slice(0, 3).map((t) => ({
              id: t.id,
              text: t.text,
            }));
            setRecentTranscripts(recent);
          } catch {
            // Silently fail - transcripts will refresh on next page load
          }
          
          // Clear live text after a short delay to show it was saved
          setTimeout(() => {
            setLiveText("");
          }, 2000);
          
        } catch (err) {
          setTranscriptionError(
            err instanceof Error ? err.message : "Failed to transcribe final audio"
          );
        } finally {
          setIsTranscribing(false);
          processedChunksRef.current.clear();
        }
      };
      
      processFinalChunk();
    }
    
    // Reset final chunk processed flag when starting new recording
    if (isRecording) {
      finalChunkProcessedRef.current = false;
    }
    
    wasRecordingRef.current = isRecording;
  }, [isRecording, isProcessing, audioChunks]);

  // Handle record button click
  const handleRecordClick = async () => {
    if (isProcessing) return;

    if (isRecording) {
      // Stop recording (final chunk will be processed by useEffect)
      await stopRecording();
    } else {
      // Start recording
      setLiveText("");
      setTranscriptionError(null);
      processedChunksRef.current.clear();
      await startRecording();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        {/* Error messages */}
        {(recorderError || transcriptionError) && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            {recorderError || transcriptionError}
          </div>
        )}

        {/* Record Button */}
        <RecordButton
          isRecording={isRecording}
          isProcessing={isProcessing || isTranscribing}
          onClick={handleRecordClick}
        />

        {/* Waveform */}
        <Waveform isRecording={isRecording} />

        {/* Live Transcript */}
        <LiveTranscript text={liveText} isRecording={isRecording} />

        {/* Status info */}
        {isRecording && (
          <div className="mt-4 text-xs text-muted-foreground text-center">
            Recording... {audioChunks.length > 0 && `Processing chunk ${audioChunks.length}...`}
          </div>
        )}

        {/* Recent Transcripts */}
        <RecentTranscripts transcripts={recentTranscripts} />
      </div>
    </div>
  );
}
