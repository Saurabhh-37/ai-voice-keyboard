import Link from "next/link";
import { cn } from "@/lib/utils";

export function FooterSection() {
  return (
    <footer className="py-12 border-t border-border bg-muted/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="text-lg font-light text-foreground">
            Voice Keyboard
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              Contact
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Voice Keyboard. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
