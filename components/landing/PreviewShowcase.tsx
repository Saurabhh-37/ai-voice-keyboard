"use client";

import { cn } from "@/lib/utils";

export function PreviewShowcase() {
  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/3 rounded-full blur-3xl"></div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-light text-foreground">
            A simple interface, built to disappear.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Your focus stays on your thoughts, not the tool.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                "bg-card rounded-xl border border-border p-8",
                "shadow-soft",
                "animate-in fade-in slide-in-from-bottom-4",
                i === 1 && "md:transform md:rotate-[-1deg] md:hover:rotate-0",
                i === 2 && "md:transform md:translate-y-4",
                i === 3 && "md:transform md:rotate-[1deg] md:hover:rotate-0",
                "transition-all duration-300 hover:shadow-md"
              )}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Mock UI Elements */}
              <div className="space-y-6">
                {/* Header bar */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-muted"></div>
                  <div className="w-2 h-2 rounded-full bg-muted"></div>
                  <div className="w-2 h-2 rounded-full bg-muted"></div>
                  <div className="flex-1 h-3 bg-muted rounded ml-4"></div>
                </div>

                {/* Content area */}
                <div className="space-y-3">
                  <div className="h-4 bg-foreground/60 rounded w-full"></div>
                  <div className="h-4 bg-foreground/40 rounded w-5/6"></div>
                  <div className="h-4 bg-foreground/30 rounded w-4/6"></div>
                </div>

                {/* Secondary content */}
                <div className="pt-4 space-y-2 border-t border-border">
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>

                {/* Icon or accent */}
                {i === 2 && (
                  <div className="pt-4 flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <div className="w-8 h-8 bg-primary/20 rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

