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

  // Fetch transcripts on mount
  useEffect(() => {
    async function fetchTranscripts() {
      try {
        setLoading(true);
        const data = await api.getTranscripts();
        setTranscripts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load transcripts");
      } finally {
        setLoading(false);
      }
    }

    fetchTranscripts();
  }, []);

  // Format transcripts with readable dates
  const formattedTranscripts = useMemo(() => {
    return transcripts.map((t) => ({
      id: t.id,
      text: t.text,
      createdAt: format(new Date(t.createdAt), "MMM d • h:mm a"),
    }));
  }, [transcripts]);

  // Filter transcripts based on search query
  const filteredTranscripts = useMemo(() => {
    if (!searchQuery.trim()) {
      return formattedTranscripts;
    }

    const query = searchQuery.toLowerCase();
    return formattedTranscripts.filter((transcript) =>
      transcript.text.toLowerCase().includes(query)
    );
  }, [formattedTranscripts, searchQuery]);

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

        {/* Transcript List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">Loading transcripts...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : (
          <TranscriptList transcripts={filteredTranscripts} />
        )}
      </div>
    </div>
  );
}
