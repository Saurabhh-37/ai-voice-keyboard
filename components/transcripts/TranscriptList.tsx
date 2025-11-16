"use client";

import { TranscriptCard } from "./TranscriptCard";
import { EmptyState } from "@/components/common/EmptyState";

interface Transcript {
  id: string;
  text: string;
  createdAt: string;
}

interface TranscriptListProps {
  transcripts: Transcript[];
}

export function TranscriptList({ transcripts }: TranscriptListProps) {
  if (transcripts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {transcripts.map((transcript) => (
        <TranscriptCard
          key={transcript.id}
          id={transcript.id}
          text={transcript.text}
          createdAt={transcript.createdAt}
        />
      ))}
    </div>
  );
}

