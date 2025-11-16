"use client";

import { Mic, MessageCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Mic,
    title: "Tap to record",
    description: "You press one button. That's it.",
    graphic: "waveform",
  },
  {
    icon: MessageCircle,
    title: "Speak naturally",
    description: "Talk the way you think. No commands. No strict prompts.",
    graphic: "speech",
  },
  {
    icon: FileText,
    title: "See your text appear",
    description: "Our AI slices your audio in real time, making the final text ready almost immediately.",
    graphic: "document",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 md:py-32 bg-background relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-foreground mb-4">
            How it works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Icon */}
                <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Icon className="w-10 h-10 text-primary" />
                </div>

                {/* Graphic */}
                <div className="h-24 flex items-center justify-center">
                  {step.graphic === "waveform" && (
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-1.5 bg-primary/30 rounded-full animate-wave"
                          )}
                          style={{
                            height: `${15 + Math.sin(i * 0.8) * 12}px`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                  {step.graphic === "speech" && (
                    <div className="relative">
                      <div className="w-16 h-12 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary/40 rounded-full"></div>
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary/10"></div>
                    </div>
                  )}
                  {step.graphic === "document" && (
                    <div className="w-16 h-20 bg-card rounded-lg border border-border shadow-soft p-3 space-y-1.5">
                      <div className="h-1.5 bg-foreground/60 rounded w-full"></div>
                      <div className="h-1.5 bg-foreground/40 rounded w-5/6"></div>
                      <div className="h-1.5 bg-foreground/30 rounded w-4/6"></div>
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="space-y-2">
                  <h3 className="text-xl font-medium text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
