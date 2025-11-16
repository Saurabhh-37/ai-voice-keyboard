"use client";

import { Pencil, Trash2 } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DictionaryEntry {
  id: string;
  phrase: string;
  correction: string;
}

interface DictionaryRowProps {
  entry: DictionaryEntry;
  onEdit: (entry: DictionaryEntry) => void;
  onDelete: (id: string) => void;
}

export function DictionaryRow({ entry, onEdit, onDelete }: DictionaryRowProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${entry.phrase}"?`)) {
      onDelete(entry.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(entry);
  };

  return (
    <TableRow
      className={cn(
        "group transition-all duration-150",
        "hover:bg-muted/30"
      )}
    >
      <TableCell className="text-base text-foreground font-normal px-6 py-4">
        {entry.phrase}
      </TableCell>
      <TableCell className="text-base text-foreground font-normal px-6 py-4">
        {entry.correction}
      </TableCell>
      <TableCell className="w-24 px-6 py-4">
        <div className="flex items-center gap-2 justify-end">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-150",
              "hover:bg-accent"
            )}
            onClick={handleEdit}
            aria-label="Edit word"
          >
            <Pencil className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-150",
              "hover:bg-destructive/10 hover:text-destructive"
            )}
            onClick={handleDelete}
            aria-label="Delete word"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

