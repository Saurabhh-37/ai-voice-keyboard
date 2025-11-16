import { auth } from "@/lib/firebase";

/**
 * Get the current user's Firebase ID token
 */
async function getIdToken(): Promise<string | null> {
  try {
    if (!auth?.currentUser) {
      return null;
    }
    return await auth.currentUser.getIdToken();
  } catch (error) {
    console.error("Error getting ID token:", error);
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
  const token = await getIdToken();
  
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

// API Client functions
export const api = {
  // Transcripts
  transcripts: {
    getAll: () => apiRequest<Array<{ id: string; text: string; createdAt: string; updatedAt: string }>>("/api/transcripts"),
    getById: (id: string) => apiRequest<{ id: string; text: string; createdAt: string; updatedAt: string }>(`/api/transcripts/${id}`),
    create: (text: string) => apiRequest<{ id: string; text: string; createdAt: string; updatedAt: string }>("/api/transcripts", {
      method: "POST",
      body: JSON.stringify({ text }),
    }),
    delete: (id: string) => apiRequest<{ success: boolean }>(`/api/transcripts/${id}`, {
      method: "DELETE",
    }),
  },

  // Dictionary
  dictionary: {
    getAll: () => apiRequest<Array<{ id: string; phrase: string; correction: string; createdAt: string; updatedAt: string }>>("/api/dictionary"),
    create: (phrase: string, correction: string) => apiRequest<{ id: string; phrase: string; correction: string; createdAt: string; updatedAt: string }>("/api/dictionary", {
      method: "POST",
      body: JSON.stringify({ phrase, correction }),
    }),
    update: (id: string, phrase: string, correction: string) => apiRequest<{ id: string; phrase: string; correction: string; createdAt: string; updatedAt: string }>(`/api/dictionary/${id}`, {
      method: "PUT",
      body: JSON.stringify({ phrase, correction }),
    }),
    delete: (id: string) => apiRequest<{ success: boolean }>(`/api/dictionary/${id}`, {
      method: "DELETE",
    }),
  },

  // Settings
  settings: {
    get: () => apiRequest<{ id: string; autoPunctuation: boolean; createdAt: string; updatedAt: string }>("/api/settings"),
    update: (autoPunctuation: boolean) => apiRequest<{ id: string; autoPunctuation: boolean; createdAt: string; updatedAt: string }>("/api/settings", {
      method: "PUT",
      body: JSON.stringify({ autoPunctuation }),
    }),
  },

  // User sync
  user: {
    sync: (email: string, name?: string) => apiRequest<{ id: string; email: string; name: string | null; createdAt: string; updatedAt: string }>("/api/user/sync", {
      method: "POST",
      body: JSON.stringify({ email, name }),
    }),
  },
};

