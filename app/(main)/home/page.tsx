"use client";

import { useState, useEffect } from "react";
import { RecordButton } from "@/components/dictation/RecordButton";
import { Waveform } from "@/components/dictation/Waveform";
import { LiveTranscript } from "@/components/dictation/LiveTranscript";
import { RecentTranscripts } from "@/components/transcripts/RecentTranscripts";

// Placeholder transcript data
const placeholderTranscripts = [
  {
    id: "1",
    text: "This is a sample transcription. It demonstrates how the text will appear in the recent transcripts section. The card should be clickable and show a copy button on hover.",
  },
  {
    id: "2",
    text: "Another example transcription with slightly different content to show variety in the list.",
  },
  {
    id: "3",
    text: "A third transcription example to demonstrate the grid layout and spacing.",
  },
];

export default function HomePage() {
  // State management
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [liveText, setLiveText] = useState("");
  const [recentTranscripts, setRecentTranscripts] = useState<Array<{ id: string; text: string }>>(placeholderTranscripts);

  // Simulate live transcription updates when recording
  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      setLiveText((prev) => prev + " This is a simulated live transcription update. ");
    }, 2000);

    return () => clearInterval(interval);
  }, [isRecording]);

  // Handle record button click
  const handleRecordClick = () => {
    if (isProcessing) return;

    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      setIsProcessing(true);
      
      // Simulate processing
      setTimeout(() => {
        setIsProcessing(false);
        // In real implementation, save transcription here
        setLiveText("");
      }, 2000);
    } else {
      // Start recording
      setIsRecording(true);
      setLiveText("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        {/* Record Button */}
        <RecordButton
          isRecording={isRecording}
          isProcessing={isProcessing}
          onClick={handleRecordClick}
        />

        {/* Waveform */}
        <Waveform isRecording={isRecording} />

        {/* Live Transcript */}
        <LiveTranscript text={liveText} isRecording={isRecording} />

        {/* Recent Transcripts */}
        <RecentTranscripts transcripts={recentTranscripts} />
      </div>
    </div>
  );
}
