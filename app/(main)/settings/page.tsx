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

  // Fetch settings on mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        const settings = await api.getSettings();
        setAutoPunctuation(settings.autoPunctuation);
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      setName(user.displayName || "");
      setEmail(user.email || "");
      fetchSettings();
    }
  }, [user]);

  // Update auto punctuation setting
  const handleAutoPunctuationChange = async (value: boolean) => {
    try {
      await api.updateSettings(value);
      setAutoPunctuation(value);
    } catch (err) {
      console.error("Error updating settings:", err);
      alert(err instanceof Error ? err.message : "Failed to update settings");
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
            onChange={(value) => setName(value as string)}
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
            onChange={(value) => handleAutoPunctuationChange(value as boolean)}
          />
        </SettingsSection>
      </div>
    </div>
  );
}
