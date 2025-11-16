import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md bg-card rounded-xl border border-border p-8",
        "shadow-soft",
        "animate-in fade-in duration-150"
      )}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {/* Content */}
        <div>{children}</div>

        {/* Footer */}
        {footer && <div className="pt-4">{footer}</div>}
      </div>
    </div>
  );
}

