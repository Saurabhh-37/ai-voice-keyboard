"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DictionaryRow } from "./DictionaryRow";
import { EmptyState } from "@/components/common/EmptyState";
import { BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DictionaryEntry {
  id: string;
  phrase: string;
  correction: string;
}

interface DictionaryTableProps {
  entries: DictionaryEntry[];
  onEdit: (entry: DictionaryEntry) => void;
  onDelete: (id: string) => void;
}

export function DictionaryTable({
  entries,
  onEdit,
  onDelete,
}: DictionaryTableProps) {
  if (entries.length === 0) {
    return (
      <EmptyState
        title="Your dictionary is empty"
        description="Add words to improve transcription accuracy."
        icon={<BookOpen className="w-8 h-8 text-muted-foreground" />}
      />
    );
  }

  return (
    <Card className={cn("rounded-xl border border-border p-0 overflow-hidden")}>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border hover:bg-transparent">
            <TableHead className="text-foreground font-semibold h-12 px-6 py-3">
              Phrase
            </TableHead>
            <TableHead className="text-foreground font-semibold h-12 px-6 py-3">
              Correction
            </TableHead>
            <TableHead className="text-foreground font-semibold h-12 px-6 py-3 w-24 text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <DictionaryRow
              key={entry.id}
              entry={entry}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

