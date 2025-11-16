"use client";

import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

// Map paths to page titles
const pageTitles: Record<string, string> = {
  "/home": "Home",
  "/library": "Library",
  "/dictionary": "Dictionary",
  "/settings": "Settings",
  "/profile": "Profile",
};

export default function Appbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const pageTitle = pageTitles[pathname] || "Voice Keyboard";

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.displayName) {
      return user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center px-8 sticky top-0 z-10">
      <div className="flex items-center justify-between w-full">
        {/* Left side - Page title */}
        <div className="flex items-center">
          <h2 className="text-lg font-medium text-foreground">{pageTitle}</h2>
        </div>

        {/* Right side - User info */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user.displayName || user.email}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="User profile"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {getUserInitials()}
                  </span>
                </div>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

