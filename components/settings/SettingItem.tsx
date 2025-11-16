"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface SettingItemProps {
  label: string;
  description?: string;
  type: "text" | "toggle";
  defaultValue?: string | boolean;
  disabled?: boolean;
  value?: string | boolean;
  onChange?: (value: string | boolean) => void;
}

export function SettingItem({
  label,
  description,
  type,
  defaultValue,
  disabled = false,
  value,
  onChange,
}: SettingItemProps) {
  const [textValue, setTextValue] = useState(
    typeof defaultValue === "string" ? defaultValue : ""
  );
  const [toggleValue, setToggleValue] = useState(
    type === "toggle" 
      ? (typeof defaultValue === "boolean" 
          ? defaultValue 
          : defaultValue === "true")
      : false
  );

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    } else {
      setTextValue(newValue);
    }
  };

  const handleToggleChange = (checked: boolean) => {
    if (onChange) {
      onChange(checked);
    } else {
      setToggleValue(checked);
    }
  };

  const currentTextValue = value !== undefined && typeof value === "string" ? value : textValue;
  const currentToggleValue = value !== undefined && typeof value === "boolean" ? value : toggleValue;

  if (type === "text") {
    return (
      <div className="space-y-2">
        <div>
          <Label htmlFor={label.toLowerCase().replace(/\s+/g, "-")} className="text-foreground font-medium">
            {label}
          </Label>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <Input
          id={label.toLowerCase().replace(/\s+/g, "-")}
          type="text"
          value={currentTextValue}
          onChange={handleTextChange}
          disabled={disabled}
          className={cn(
            "mt-2 w-full",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
      </div>
    );
  }

  if (type === "toggle") {
    return (
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Label htmlFor={label.toLowerCase().replace(/\s+/g, "-")} className="text-foreground font-medium">
            {label}
          </Label>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <Switch
          id={label.toLowerCase().replace(/\s+/g, "-")}
          checked={currentToggleValue}
          onCheckedChange={handleToggleChange}
          disabled={disabled}
        />
      </div>
    );
  }

  return null;
}

