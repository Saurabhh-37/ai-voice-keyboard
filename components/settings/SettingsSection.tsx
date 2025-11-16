import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-6">
      <h2 className="text-lg font-medium text-foreground">{title}</h2>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

