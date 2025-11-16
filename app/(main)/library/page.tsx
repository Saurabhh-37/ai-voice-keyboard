"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { TranscriptList } from "@/components/transcripts/TranscriptList";

// Placeholder transcript data
const placeholderTranscripts = [
  {
    id: "1",
    text: "This is a sample transcription that demonstrates how the library page will display user recordings. The text should be truncated to show a preview, and users can click to view the full transcript.",
    createdAt: "Today • 3:21 PM",
  },
  {
    id: "2",
    text: "Another example transcription with different content. This shows how multiple transcripts will appear in the list, sorted by creation date with the most recent at the top.",
    createdAt: "Today • 2:15 PM",
  },
  {
    id: "3",
    text: "A third transcription example to demonstrate the grid layout and spacing. Each card should have a clean design with proper hover effects and copy functionality.",
    createdAt: "Nov 3 • 10:14 AM",
  },
  {
    id: "4",
    text: "This is a longer transcription example that will test the line-clamp functionality. The text should be properly truncated to show only the first one or two lines, with an ellipsis indicating there's more content. Users can click the card to view the full transcript in detail.",
    createdAt: "Nov 2 • 4:30 PM",
  },
  {
    id: "5",
    text: "Final example transcription to show how the list handles multiple items. The design should remain clean and organized even with many transcripts.",
    createdAt: "Nov 1 • 9:00 AM",
  },
];

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter transcripts based on search query
  const filteredTranscripts = useMemo(() => {
    if (!searchQuery.trim()) {
      return placeholderTranscripts;
    }

    const query = searchQuery.toLowerCase();
    return placeholderTranscripts.filter((transcript) =>
      transcript.text.toLowerCase().includes(query)
    );
  }, [searchQuery]);

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
        <TranscriptList transcripts={filteredTranscripts} />
      </div>
    </div>
  );
}
