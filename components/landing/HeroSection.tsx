"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-32 md:pt-40 md:pb-40 overflow-hidden">
      {/* Abstract Blobs Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/3 rounded-full blur-3xl"></div>
      </div>

      {/* Light Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20"></div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center space-y-10">
          {/* Headline */}
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-6xl md:text-7xl font-light text-foreground leading-[1.1] tracking-tight">
              Speak. We format.
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light max-w-2xl mx-auto">
              A calm, modern tool that turns your voice into clean, structured text - instantly.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto px-8">
                Start for free
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">
              <Play className="w-4 h-4 mr-2" />
              Watch it work
            </Button>
          </div>

          {/* Waveform Animation */}
          <div className="pt-16 flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <div className="flex items-center gap-2">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-1.5 bg-primary/30 rounded-full",
                    "animate-wave"
                  )}
                  style={{
                    height: `${25 + Math.sin(i * 0.6) * 20}px`,
                    animationDelay: `${i * 0.08}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Floating UI Mockup Card */}
          <div className="pt-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <div className="relative max-w-2xl mx-auto">
              <div className="bg-card rounded-xl border border-border p-8 shadow-soft transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <div className="h-4 bg-muted rounded w-32"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-foreground/80 rounded w-full"></div>
                    <div className="h-3 bg-foreground/60 rounded w-5/6"></div>
                    <div className="h-3 bg-foreground/40 rounded w-4/6"></div>
                  </div>
                  <div className="pt-2 space-y-2">
                    <div className="h-3 bg-muted rounded w-full"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
