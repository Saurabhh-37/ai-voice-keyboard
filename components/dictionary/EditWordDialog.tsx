"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DictionaryEntry {
  id: string;
  phrase: string;
  correction: string;
}

interface EditWordDialogProps {
  entry: DictionaryEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (entry: DictionaryEntry) => void;
}

export function EditWordDialog({
  entry,
  open,
  onOpenChange,
  onSave,
}: EditWordDialogProps) {
  const [phrase, setPhrase] = useState("");
  const [correction, setCorrection] = useState("");

  useEffect(() => {
    if (entry) {
      setPhrase(entry.phrase);
      setCorrection(entry.correction);
    }
  }, [entry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (entry && phrase.trim() && correction.trim()) {
      onSave({
        ...entry,
        phrase: phrase.trim(),
        correction: correction.trim(),
      });
      setPhrase("");
      setCorrection("");
      onOpenChange(false);
    }
  };

  if (!entry) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit word</DialogTitle>
          <DialogDescription>
            Update the phrase and its correction.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-phrase">Phrase</Label>
            <Input
              id="edit-phrase"
              placeholder="e.g., 'teh'"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-correction">Correction</Label>
            <Input
              id="edit-correction"
              placeholder="e.g., 'the'"
              value={correction}
              onChange={(e) => setCorrection(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                onOpenChange(false);
                setPhrase(entry.phrase);
                setCorrection(entry.correction);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

