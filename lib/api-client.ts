"use client";

import { auth } from "@/lib/firebase";

/**
 * Client-side API helper that automatically includes Firebase auth token
 */
async function getAuthToken(): Promise<string | null> {
  if (!auth?.currentUser) {
    return null;
  }
  
  try {
    const token = await auth.currentUser.getIdToken();
    return token;
  } catch (error) {
    console.error("Error getting auth token:", error);
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
};

