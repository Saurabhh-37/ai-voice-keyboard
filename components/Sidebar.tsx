"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Home, 
  BookOpen, 
  Book, 
  Settings, 
  User,
  LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOutUser } from "@/lib/auth";
import { useState } from "react";

const navigation = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Library", href: "/library", icon: BookOpen },
  { name: "Dictionary", href: "/dictionary", icon: Book },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Profile", href: "/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOutUser();
      router.push("/login");
    } catch {
      // Silently fail - user will stay on current page
      setLoggingOut(false);
    }
  };

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      {/* Logo/Branding */}
      <div className="px-6 pt-8 pb-12">
        <h1 className="text-2xl font-light text-foreground leading-[1.4]">
          Voice Keyboard
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl",
                    "transition-all duration-150",
                    "transform hover:scale-[0.98] active:scale-[0.97]",
                    isActive
                      ? "bg-primary text-primary-foreground font-medium shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-[15px] leading-[1.4]">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-4 py-6 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="text-[15px] leading-[1.4]">
            {loggingOut ? "Logging out..." : "Logout"}
          </span>
        </Button>
      </div>
    </aside>
  );
}

