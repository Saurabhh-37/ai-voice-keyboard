"use client";

import { useState, useEffect } from "react";
import { AddWordDialog } from "@/components/dictionary/AddWordDialog";
import { DictionaryTable } from "@/components/dictionary/DictionaryTable";
import { EditWordDialog } from "@/components/dictionary/EditWordDialog";
import { api } from "@/lib/api-client";

interface DictionaryEntry {
  id: string;
  phrase: string;
  correction: string;
}

export default function DictionaryPage() {
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<DictionaryEntry | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dictionary entries on mount
  useEffect(() => {
    async function fetchEntries() {
      try {
        setLoading(true);
        const data = await api.getDictionaryWords();
        setEntries(data.map((w) => ({
          id: w.id,
          phrase: w.phrase,
          correction: w.correction,
        })));
        setError(null);
      } catch (err) {
        console.error("Error fetching dictionary words:", err);
        setError(err instanceof Error ? err.message : "Failed to load dictionary");
      } finally {
        setLoading(false);
      }
    }

    fetchEntries();
  }, []);

  const handleAdd = async (phrase: string, correction: string) => {
    try {
      const newEntry = await api.createDictionaryWord(phrase, correction);
      setEntries([newEntry, ...entries]);
    } catch (err) {
      console.error("Error adding dictionary word:", err);
      alert(err instanceof Error ? err.message : "Failed to add word");
    }
  };

  const handleEdit = (entry: DictionaryEntry) => {
    setEditingEntry(entry);
    setIsEditDialogOpen(true);
  };

  const handleSave = async (updatedEntry: DictionaryEntry) => {
    try {
      const saved = await api.updateDictionaryWord(
        updatedEntry.id,
        updatedEntry.phrase,
        updatedEntry.correction
      );
      setEntries(
        entries.map((e) => (e.id === saved.id ? saved : e))
      );
      setEditingEntry(null);
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error("Error updating dictionary word:", err);
      alert(err instanceof Error ? err.message : "Failed to update word");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this dictionary word?")) {
      return;
    }

    try {
      await api.deleteDictionaryWord(id);
      setEntries(entries.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Error deleting dictionary word:", err);
      alert(err instanceof Error ? err.message : "Failed to delete word");
    }
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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">Loading dictionary...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : (
          <DictionaryTable
            entries={entries}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

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
