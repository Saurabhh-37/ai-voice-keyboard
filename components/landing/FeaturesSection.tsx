"use client";

import { Zap, Sparkles, BookOpen, Copy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Zap,
    title: "Real-time transcription",
    description: "Your speech becomes text while you're still speaking.",
    graphic: "waveform",
  },
  {
    icon: Sparkles,
    title: "Smart formatting",
    description: "Clean paragraphs. Natural punctuation. Better than typing.",
    graphic: "paragraph",
  },
  {
    icon: BookOpen,
    title: "Personal dictionary",
    description: "Teach the system how you spell names, brands, and jargon.",
    graphic: "dictionary",
  },
  {
    icon: Copy,
    title: "One-tap copy",
    description: "Drop your text anywhere with a single click.",
    graphic: "copy",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-32 bg-muted/20 relative">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background"></div>
      
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-foreground mb-4">
            Everything you need. Nothing you don't.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className={cn(
                  "p-8 transition-all duration-300",
                  "hover:shadow-md hover:border-primary/20 hover:-translate-y-1"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="space-y-6">
                  {/* Icon + Graphic */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    
                    {/* Graphic */}
                    <div className="flex-1 h-14 flex items-center">
                      {feature.graphic === "waveform" && (
                        <div className="flex items-center gap-1 w-full">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <div
                              key={i}
                              className={cn(
                                "flex-1 bg-primary/20 rounded-full animate-wave"
                              )}
                              style={{
                                height: `${8 + Math.sin(i * 0.5) * 6}px`,
                                animationDelay: `${i * 0.05}s`,
                              }}
                            />
                          ))}
                        </div>
                      )}
                      {feature.graphic === "paragraph" && (
                        <div className="space-y-2 w-full">
                          <div className="h-2 bg-foreground/40 rounded w-full"></div>
                          <div className="h-2 bg-foreground/30 rounded w-5/6"></div>
                          <div className="h-2 bg-foreground/20 rounded w-4/6"></div>
                        </div>
                      )}
                      {feature.graphic === "dictionary" && (
                        <div className="flex items-center gap-2">
                          <div className="text-2xl font-light text-foreground">A</div>
                          <div className="text-muted-foreground">→</div>
                          <div className="text-2xl font-medium text-foreground">Aa</div>
                        </div>
                      )}
                      {feature.graphic === "copy" && (
                        <div className="relative">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                            <Copy className="w-6 h-6 text-primary" />
                          </div>
                          <div className="absolute inset-0 rounded-lg bg-primary/20 animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Text */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
