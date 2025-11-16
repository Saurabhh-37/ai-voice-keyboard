"use client";

import { useState } from "react";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { SettingItem } from "@/components/settings/SettingItem";

export default function SettingsPage() {
  const [name, setName] = useState("John Doe");
  const [autoPunctuation, setAutoPunctuation] = useState(false);

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
            defaultValue="john@example.com"
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
            onChange={(value) => setAutoPunctuation(value as boolean)}
          />
        </SettingsSection>
      </div>
    </div>
  );
}
