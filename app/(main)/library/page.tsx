"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { TranscriptList } from "@/components/transcripts/TranscriptList";
import { api } from "@/lib/api-client";
import { format } from "date-fns";

interface Transcript {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTranscripts() {
      try {
        setLoading(true);
        setError(null);
        const data = await api.transcripts.getAll();
        setTranscripts(data);
      } catch (err: any) {
        console.error("Error fetching transcripts:", err);
        setError(err.message || "Failed to load transcripts");
      } finally {
        setLoading(false);
      }
    }

    fetchTranscripts();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return `Today • ${format(date, "h:mm a")}`;
      } else if (diffInHours < 48) {
        return `Yesterday • ${format(date, "h:mm a")}`;
      } else {
        return format(date, "MMM d • h:mm a");
      }
    } catch {
      return dateString;
    }
  };

  // Transform transcripts for display
  const displayTranscripts = useMemo(() => {
    return transcripts.map((t) => ({
      id: t.id,
      text: t.text,
      createdAt: formatDate(t.createdAt),
    }));
  }, [transcripts]);

  // Filter transcripts based on search query
  const filteredTranscripts = useMemo(() => {
    if (!searchQuery.trim()) {
      return displayTranscripts;
    }

    const query = searchQuery.toLowerCase();
    return displayTranscripts.filter((transcript) =>
      transcript.text.toLowerCase().includes(query)
    );
  }, [displayTranscripts, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto pt-10 pb-24 px-6 space-y-8">
        {/* Page Heading */}
        <h1 className="text-2xl font-semibold text-foreground">
          Your transcriptions
        </h1>

        {/* Search Bar */}
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search transcripts…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 text-muted-foreground">
            Loading transcripts...
          </div>
        )}

        {/* Transcript List */}
        {!loading && !error && <TranscriptList transcripts={filteredTranscripts} />}
      </div>
    </div>
  );
}
