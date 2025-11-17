"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Placeholder transcript data
const placeholderTranscript = {
  id: "1",
  text: "This is a sample transcription that demonstrates how the transcript detail page will display the full text. The text should be properly formatted with line breaks and spacing preserved. Users can copy the text using the copy button.",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function TranscriptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [transcript, setTranscript] = useState<{
    id: string;
    text: string;
    createdAt: string;
    updatedAt: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [id, setId] = useState<string | null>(null);

  // Resolve params
  useEffect(() => {
    params.then((p) => {
      setId(p.id);
      // Use placeholder data for now
      setTranscript(placeholderTranscript);
      setLoading(false);
    });
  }, [params]);

  const handleCopy = async () => {
    if (!transcript) return;
    try {
      await navigator.clipboard.writeText(transcript.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (loading || !transcript) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading transcript...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto pt-10 pb-24 px-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Transcript
            </h1>
            <p className="text-sm text-muted-foreground">
              {format(new Date(transcript.createdAt), "MMMM d, yyyy • h:mm a")}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleCopy}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </Button>
        </div>

        {/* Transcript Content */}
        <Card className="p-8">
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {transcript.text}
          </p>
        </Card>
      </div>
    </div>
  );
}

