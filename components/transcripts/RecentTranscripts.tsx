"use client";

import { useRouter } from "next/navigation";
import { Copy, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Transcript {
  id: string;
  text: string;
  createdAt?: string;
}

interface RecentTranscriptsProps {
  transcripts: Transcript[];
}

export function RecentTranscripts({ transcripts }: RecentTranscriptsProps) {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCardClick = (id: string) => {
    router.push(`/transcript/${id}`);
  };

  if (transcripts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-lg">
          You don't have any recordings yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-light text-foreground">Recent transcriptions</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {transcripts.map((transcript) => {
          const preview = transcript.text.length > 150
            ? transcript.text.substring(0, 150) + "..."
            : transcript.text;

          return (
            <Card
              key={transcript.id}
              className={cn(
                "cursor-pointer transition-all duration-150",
                "hover:shadow-md hover:border-primary/20",
                "group relative overflow-hidden"
              )}
              onClick={() => handleCardClick(transcript.id)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-foreground leading-relaxed flex-1 line-clamp-2">
                    {preview}
                  </p>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "opacity-0 group-hover:opacity-100 transition-opacity duration-150",
                      "flex-shrink-0"
                    )}
                    onClick={(e) => handleCopy(transcript.text, transcript.id, e)}
                    aria-label="Copy transcript"
                  >
                    {copiedId === transcript.id ? (
                      <span className="text-sm text-primary">Copied!</span>
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

