"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AddWordDialogProps {
  onAdd: (phrase: string, correction: string) => void;
}

export function AddWordDialog({ onAdd }: AddWordDialogProps) {
  const [open, setOpen] = useState(false);
  const [phrase, setPhrase] = useState("");
  const [correction, setCorrection] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phrase.trim() && correction.trim()) {
      onAdd(phrase.trim(), correction.trim());
      setPhrase("");
      setCorrection("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add word
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add new word</DialogTitle>
          <DialogDescription>
            Add a custom word or phrase with its correction to improve transcription accuracy.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phrase">Phrase</Label>
            <Input
              id="phrase"
              placeholder="e.g., 'teh'"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="correction">Correction</Label>
            <Input
              id="correction"
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
                setOpen(false);
                setPhrase("");
                setCorrection("");
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

