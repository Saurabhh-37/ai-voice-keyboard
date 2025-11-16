"use client";

import { cn } from "@/lib/utils";

interface WaveformProps {
  isRecording: boolean;
}

export function Waveform({ isRecording }: WaveformProps) {
  if (!isRecording) {
    return null;
  }

  return (
    <div
      className={cn(
        "w-full mb-8 h-[60px] md:h-[60px]",
        "transition-opacity duration-300 ease-out",
        isRecording ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="relative w-full h-full flex items-center justify-center gap-1.5 px-4">
        {/* Waveform bars */}
        {Array.from({ length: 20 }).map((_, i) => {
          const baseHeight = 20;
          const variation = Math.sin(i * 0.5) * 15;
          const height = baseHeight + variation;
          
          return (
            <div
              key={i}
              className={cn(
                "w-1.5 bg-primary/30 rounded-full animate-wave",
                "transition-all duration-300"
              )}
              style={{
                height: `${height}px`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

