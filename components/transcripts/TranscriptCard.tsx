"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TranscriptCardProps {
  id: string;
  text: string;
  createdAt: string;
}

export function TranscriptCard({ id, text, createdAt }: TranscriptCardProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently fail - clipboard API may not be available
    }
  };

  const handleCardClick = () => {
    router.push(`/transcript/${id}`);
  };

  // Format preview text (first 1-2 lines, ~150 chars)
  const preview = text.length > 150 ? text.substring(0, 150) + "..." : text;

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-150",
        "hover:shadow-md hover:border-primary/20",
        "group relative overflow-hidden"
      )}
      onClick={handleCardClick}
    >
      <div className="p-6 space-y-4">
        {/* Top Row: Preview Text + Copy Button */}
        <div className="flex items-start justify-between gap-4">
          <p
            className={cn(
              "text-foreground leading-relaxed flex-1",
              "line-clamp-2 text-base"
            )}
          >
            {preview}
          </p>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "opacity-0 group-hover:opacity-100 transition-opacity duration-150",
              "flex-shrink-0 w-8 h-8",
              "hover:bg-accent"
            )}
            onClick={handleCopy}
            aria-label="Copy transcript"
          >
            {copied ? (
              <Check className="w-4 h-4 text-primary" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground" />
            )}
          </Button>
        </div>

        {/* Bottom Row: Timestamp */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{createdAt}</span>
        </div>
      </div>
    </Card>
  );
}

