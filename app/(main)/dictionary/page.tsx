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

  useEffect(() => {
    async function fetchEntries() {
      try {
        setLoading(true);
        setError(null);
        const data = await api.dictionary.getAll();
        setEntries(data);
      } catch (err: any) {
        console.error("Error fetching dictionary entries:", err);
        setError(err.message || "Failed to load dictionary");
      } finally {
        setLoading(false);
      }
    }

    fetchEntries();
  }, []);

  const handleAdd = async (phrase: string, correction: string) => {
    try {
      const newEntry = await api.dictionary.create(phrase, correction);
      setEntries([newEntry, ...entries]);
    } catch (err: any) {
      console.error("Error adding entry:", err);
      alert(err.message || "Failed to add dictionary entry");
    }
  };

  const handleEdit = (entry: DictionaryEntry) => {
    setEditingEntry(entry);
    setIsEditDialogOpen(true);
  };

  const handleSave = async (updatedEntry: DictionaryEntry) => {
    try {
      const saved = await api.dictionary.update(
        updatedEntry.id,
        updatedEntry.phrase,
        updatedEntry.correction
      );
      setEntries(
        entries.map((e) => (e.id === saved.id ? saved : e))
      );
      setEditingEntry(null);
      setIsEditDialogOpen(false);
    } catch (err: any) {
      console.error("Error updating entry:", err);
      alert(err.message || "Failed to update dictionary entry");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this dictionary entry?")) {
      return;
    }

    try {
      await api.dictionary.delete(id);
      setEntries(entries.filter((e) => e.id !== id));
    } catch (err: any) {
      console.error("Error deleting entry:", err);
      alert(err.message || "Failed to delete dictionary entry");
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

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 text-muted-foreground">
            Loading dictionary...
          </div>
        )}

        {/* Dictionary Table */}
        {!loading && !error && (
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
