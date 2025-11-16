"use client";

import { useState, useEffect } from "react";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { SettingItem } from "@/components/settings/SettingItem";
import { api } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [autoPunctuation, setAutoPunctuation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const settings = await api.settings.get();
        setAutoPunctuation(settings.autoPunctuation);
      } catch (err: any) {
        console.error("Error fetching settings:", err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchSettings();
      setName(user.displayName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleNameChange = async (value: string | boolean) => {
    const newName = value as string;
    setName(newName);
    
    // Sync with Firebase and database
    if (user) {
      try {
        await api.user.sync(user.email || "", newName);
      } catch (err) {
        console.error("Error syncing user:", err);
      }
    }
  };

  const handleAutoPunctuationChange = async (value: string | boolean) => {
    const newValue = value as boolean;
    setAutoPunctuation(newValue);
    
    try {
      setSaving(true);
      await api.settings.update(newValue);
    } catch (err: any) {
      console.error("Error updating settings:", err);
      alert(err.message || "Failed to update settings");
      // Revert on error
      setAutoPunctuation(!newValue);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto pt-10 pb-24 px-6 space-y-10">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>

        {/* Account Section */}
        <SettingsSection title="Account">
          <SettingItem
            label="Name"
            description="Your display name."
            type="text"
            value={name}
            onChange={handleNameChange}
            disabled={loading || saving}
          />
          <SettingItem
            label="Email"
            description="Your email address."
            type="text"
            defaultValue={email}
            disabled
          />
        </SettingsSection>

        {/* Preferences Section */}
        <SettingsSection title="Preferences">
          <SettingItem
            label="Auto punctuation"
            description="Automatically apply punctuation to your transcriptions."
            type="toggle"
            value={autoPunctuation}
            onChange={handleAutoPunctuationChange}
            disabled={loading || saving}
          />
        </SettingsSection>
      </div>
    </div>
  );
}
