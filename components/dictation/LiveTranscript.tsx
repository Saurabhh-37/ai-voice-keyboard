"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface LiveTranscriptProps {
  text: string;
  isRecording: boolean;
}

export function LiveTranscript({ text, isRecording }: LiveTranscriptProps) {
  const textRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on text update
  useEffect(() => {
    if (textRef.current) {
      textRef.current.scrollTop = textRef.current.scrollHeight;
    }
  }, [text]);

  // Don't show if not recording and no text
  if (!isRecording && !text) {
    return null;
  }

  return (
    <div
      className={cn(
        "mb-10 transition-all duration-300 ease-out",
        isRecording || text ? "opacity-100" : "opacity-0"
      )}
    >
      <div
        className={cn(
          "bg-card rounded-xl border border-border p-6 shadow-soft",
          "transition-all duration-300"
        )}
      >
        <div
          ref={textRef}
          className={cn(
            "text-lg leading-relaxed text-foreground",
            "max-h-48 overflow-y-auto",
            "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
          )}
        >
          {text || (
            <span className="text-muted-foreground italic">
              {isRecording ? "Listening..." : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

