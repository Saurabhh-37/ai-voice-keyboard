"use client";

import { useState, useRef, useCallback } from "react";

interface UseRecorderReturn {
  isRecording: boolean;
  isProcessing: boolean;
  audioChunks: Blob[];
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  error: string | null;
}

/**
 * Custom hook for audio recording with 5-second slicing
 * 
 * Features:
 * - Requests microphone access
 * - Uses MediaRecorder API
 * - Records in audio/webm format
 * - Slices audio every 5 seconds (5000ms)
 * - Exposes recording state and actions
 */
export function useRecorder(): UseRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Refs to persist across renders
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  /**
   * Start recording audio
   * - Requests microphone permission
   * - Creates MediaRecorder with 5s timeslice
   * - Collects audio chunks on dataavailable events
   */
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setIsProcessing(true);

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      mediaStreamRef.current = stream;

      // Check if MediaRecorder is supported
      if (!MediaRecorder.isTypeSupported("audio/webm")) {
        throw new Error("audio/webm format is not supported in this browser");
      }

      // Create MediaRecorder with audio/webm format
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;

      // Reset audio chunks
      audioChunksRef.current = [];
      setAudioChunks([]);

      // Handle dataavailable event (fires every 5 seconds)
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          setAudioChunks([...audioChunksRef.current]);
        }
      };

      // Handle recording errors
      mediaRecorder.onerror = () => {
        setError("Recording error occurred");
        stopRecording();
      };

      // Handle recording stop
      mediaRecorder.onstop = () => {
        // Stop all tracks to release microphone
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }
      };

      // Start recording with 5000ms timeslice (5 seconds)
      mediaRecorder.start(5000);
      
      setIsRecording(true);
      setIsProcessing(false);
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : "Failed to start recording. Please check microphone permissions."
      );
      setIsRecording(false);
      setIsProcessing(false);

      // Clean up on error
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    }
  }, []);

  /**
   * Stop recording audio
   * - Stops MediaRecorder
   * - Releases microphone
   * - Returns all collected audio chunks
   */
  const stopRecording = useCallback(async () => {
    try {
      if (!mediaRecorderRef.current || !isRecording) {
        return;
      }

      setIsProcessing(true);

      // Stop the MediaRecorder
      if (mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }

      // Stop all media tracks to release microphone
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
        mediaStreamRef.current = null;
      }

      setIsRecording(false);
      setIsProcessing(false);
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : "Failed to stop recording"
      );
      setIsRecording(false);
      setIsProcessing(false);
    }
  }, [isRecording]);

  return {
    isRecording,
    isProcessing,
    audioChunks,
    startRecording,
    stopRecording,
    error,
  };
}

