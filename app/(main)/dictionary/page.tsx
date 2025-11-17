"use client";

import { useState } from "react";
import { AddWordDialog } from "@/components/dictionary/AddWordDialog";
import { DictionaryTable } from "@/components/dictionary/DictionaryTable";
import { EditWordDialog } from "@/components/dictionary/EditWordDialog";

interface DictionaryEntry {
  id: string;
  phrase: string;
  correction: string;
}

// Placeholder dictionary entries
const placeholderEntries: DictionaryEntry[] = [
  {
    id: "1",
    phrase: "teh",
    correction: "the",
  },
  {
    id: "2",
    phrase: "recieve",
    correction: "receive",
  },
  {
    id: "3",
    phrase: "seperate",
    correction: "separate",
  },
];

export default function DictionaryPage() {
  const [entries, setEntries] = useState<DictionaryEntry[]>(placeholderEntries);
  const [editingEntry, setEditingEntry] = useState<DictionaryEntry | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleAdd = (phrase: string, correction: string) => {
    const newEntry: DictionaryEntry = {
      id: Date.now().toString(),
      phrase,
      correction,
    };
    setEntries([newEntry, ...entries]);
    // TODO: API call to save new entry
    console.log("Adding entry:", newEntry);
  };

  const handleEdit = (entry: DictionaryEntry) => {
    setEditingEntry(entry);
    setIsEditDialogOpen(true);
  };

  const handleSave = (updatedEntry: DictionaryEntry) => {
    setEntries(
      entries.map((e) => (e.id === updatedEntry.id ? updatedEntry : e))
    );
    setEditingEntry(null);
    setIsEditDialogOpen(false);
    // TODO: API call to update entry
    console.log("Updating entry:", updatedEntry);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this dictionary word?")) {
      return;
    }
    setEntries(entries.filter((e) => e.id !== id));
    // TODO: API call to delete entry
    console.log("Deleting entry:", id);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto pt-10 pb-24 px-6 space-y-8">
        {/* Header with Title and Add Button */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">
            Dictionary
          </h1>
          <AddWordDialog onAdd={handleAdd} />
        </div>

        {/* Dictionary Table */}
        <DictionaryTable
          entries={entries}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Edit Dialog */}
        <EditWordDialog
          entry={editingEntry}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
