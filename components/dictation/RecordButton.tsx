"use client";

import { Mic, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecordButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  onClick: () => void;
}

export function RecordButton({
  isRecording,
  isProcessing,
  onClick,
}: RecordButtonProps) {
  return (
      <div className="flex justify-center items-center mb-10">
      <button
        onClick={onClick}
        disabled={isProcessing}
        className={cn(
          "relative flex items-center justify-center",
          "rounded-full transition-all duration-150 ease-out",
          "transform hover:scale-[0.98] active:scale-[0.97]",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          // Size: 160px desktop, 120px mobile
          "w-[120px] h-[120px] md:w-[160px] md:h-[160px]",
          // States
          isRecording
            ? "bg-primary text-primary-foreground shadow-lg"
            : "bg-card border-2 border-primary text-primary shadow-soft",
          // Pulsing animation when recording
          isRecording && "animate-pulse"
        )}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {/* Pulsing glow ring when recording */}
        {isRecording && (
          <div
            className={cn(
              "absolute inset-0 rounded-full",
              "bg-primary opacity-20",
              "animate-ping"
            )}
            style={{
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          />
        )}

        {/* Icon */}
        <div className="relative z-10">
          {isProcessing ? (
            <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin" />
          ) : (
            <Mic className="w-8 h-8 md:w-10 md:h-10" />
          )}
        </div>
      </button>
    </div>
  );
}

