"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { format } from "date-fns";
import { Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [id, setId] = useState<string | null>(null);

  // Resolve params
  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  // Fetch transcript
  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Transcript ID is missing");
      return;
    }

    // Store id in const to narrow TypeScript type
    const transcriptId = id;

    async function fetchTranscript() {
      try {
        setLoading(true);
        const data = await api.getTranscript(transcriptId);
        setTranscript(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching transcript:", err);
        setError(err instanceof Error ? err.message : "Failed to load transcript");
      } finally {
        setLoading(false);
      }
    }

    fetchTranscript();
  }, [id]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading transcript...</p>
        </div>
      </div>
    );
  }

  if (error || !transcript) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto pt-10 pb-24 px-6">
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error || "Transcript not found"}</p>
            <Button variant="outline" onClick={() => router.push("/library")}>
              Back to Library
            </Button>
          </div>
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

