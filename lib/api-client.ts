"use client";

import { auth } from "@/lib/firebase";

/**
 * Client-side API helper that automatically includes Firebase auth token
 */
async function getAuthToken(): Promise<string | null> {
  if (!auth?.currentUser) {
    console.warn("⚠️ No current user found. User must be logged in.");
    return null;
  }
  
  try {
    const token = await auth.currentUser.getIdToken();
    if (!token) {
      console.warn("⚠️ Failed to get ID token from Firebase");
      return null;
    }
    console.log("✅ Got auth token, length:", token.length);
    return token;
  } catch (error) {
    console.error("❌ Error getting auth token:", error);
    return null;
  }
}

/**
 * Make an authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * API client methods
 */
export const api = {
  // Transcripts
  getTranscripts: () => apiRequest<Array<{ id: string; text: string; createdAt: string; updatedAt: string }>>("/api/transcripts"),
  
  getTranscript: (id: string) => apiRequest<{ id: string; text: string; createdAt: string; updatedAt: string }>(`/api/transcripts/${id}`),
  
  createTranscript: (text: string) =>
    apiRequest<{ id: string; text: string; createdAt: string; updatedAt: string }>("/api/transcripts", {
      method: "POST",
      body: JSON.stringify({ text }),
    }),
  
  deleteTranscript: (id: string) =>
    apiRequest<{ success: boolean }>(`/api/transcripts/${id}`, {
      method: "DELETE",
    }),

  // Dictionary
  getDictionaryWords: () => apiRequest<Array<{ id: string; phrase: string; correction: string; createdAt: string; updatedAt: string }>>("/api/dictionary"),
  
  createDictionaryWord: (phrase: string, correction: string) =>
    apiRequest<{ id: string; phrase: string; correction: string; createdAt: string; updatedAt: string }>("/api/dictionary", {
      method: "POST",
      body: JSON.stringify({ phrase, correction }),
    }),
  
  updateDictionaryWord: (id: string, phrase: string, correction: string) =>
    apiRequest<{ id: string; phrase: string; correction: string; createdAt: string; updatedAt: string }>(`/api/dictionary/${id}`, {
      method: "PUT",
      body: JSON.stringify({ phrase, correction }),
    }),
  
  deleteDictionaryWord: (id: string) =>
    apiRequest<{ success: boolean }>(`/api/dictionary/${id}`, {
      method: "DELETE",
    }),

  // Settings
  getSettings: () => apiRequest<{ id: string; userId: string; autoPunctuation: boolean; createdAt: string; updatedAt: string }>("/api/settings"),
  
  updateSettings: (autoPunctuation: boolean) =>
    apiRequest<{ id: string; userId: string; autoPunctuation: boolean; createdAt: string; updatedAt: string }>("/api/settings", {
      method: "PUT",
      body: JSON.stringify({ autoPunctuation }),
    }),

  // Transcription
  transcribeAudio: async (audioBlob: Blob, isFinal: boolean = false) => {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error("Not authenticated");
    }

    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.webm");
    formData.append("final", isFinal ? "true" : "false");

    const response = await fetch("/api/transcribe", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type - browser will set it with boundary for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<{
      text: string;
      partial?: string;
      isFinal: boolean;
      transcriptId?: string;
    }>;
  },
};

