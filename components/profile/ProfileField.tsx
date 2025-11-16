import { cn } from "@/lib/utils";

interface ProfileFieldProps {
  label: string;
  value: string;
  isLast?: boolean;
}

export function ProfileField({ label, value, isLast = false }: ProfileFieldProps) {
  return (
    <div
      className={cn(
        "pb-4",
        !isLast && "border-b border-border"
      )}
    >
      <div className="text-sm font-medium text-muted-foreground mb-1">
        {label}
      </div>
      <div className="text-base text-foreground">{value}</div>
    </div>
  );
}

