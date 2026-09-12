"use client";

import React from "react";
import HudCard from "../ui/HudCard";
import HudBadge from "../ui/HudBadge";
import { useData } from "@/context/DataContext";
import { Briefcase, Calendar, CheckCircle2, ChevronRight } from "lucide-react";

export default function ExperienceSection() {
  const { experiences } = useData();

  return (
    <section id="experience" className="py-24 relative overflow-hidden bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-[1px] bg-accent" />
            <HudBadge variant="accent">CHRONOLOGY // CAREER</HudBadge>
            <span className="w-6 h-[1px] bg-accent" />
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground uppercase">
            EXPERIENCE <span className="text-accent">//</span> JOURNEY & INITIATIVES
          </h2>
          <p className="font-mono text-xs sm:text-sm text-muted tracking-widest uppercase mt-2 max-w-xl">
            VERIFIED ROLES, ARCHITECTURAL ENGAGEMENTS & TECHNICAL LEADERSHIP
          </p>
        </div>

        {/* Vertical Sci-Fi Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Laser Center Line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-accent via-accent/50 to-transparent shadow-hud-glow" />

          <div className="space-y-12">
            {experiences.map((exp, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={exp.id}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    isEven ? "sm:flex-row-reverse" : ""
                  } gap-6 sm:gap-10`}
                >
                  {/* Glowing Laser Node */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-background border-2 border-accent flex items-center justify-center shadow-hud-glow z-20">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                  </div>

                  {/* Date & Period Box (Opposite side) */}
                  <div
                    className={`sm:w-1/2 pl-12 sm:pl-0 sm:pr-8 sm:text-right ${
                      isEven ? "sm:text-left sm:pl-8 sm:pr-0" : ""
                    }`}
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-hud text-xs font-mono text-accent rounded-sm shadow-sm">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{exp.period}</span>
                    </div>
                    {exp.badge && (
                      <div className="mt-1 font-mono text-[10px] text-muted tracking-widest uppercase">
                        [ {exp.badge} ]
                      </div>
                    )}
                  </div>

                  {/* Experience Card */}
                  <div className="sm:w-1/2 pl-12 sm:pl-0">
                    <HudCard
                      chamfer="tl"
                      className="bg-surface-elevated/80 border-hud hover:border-accent space-y-4"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-accent font-semibold uppercase tracking-wider">
                            {exp.organization}
                          </span>
                          {exp.isCurrent && (
                            <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono rounded-sm">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <h3 className="font-display font-bold text-lg text-foreground mt-1">
                          {exp.role}
                        </h3>
                      </div>

                      <p className="text-xs sm:text-sm text-muted leading-relaxed">
                        {exp.description}
                      </p>

                      {/* Responsibilities list */}
                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-white/5">
                          {exp.responsibilities.map((resp, rIdx) => (
                            <div
                              key={rIdx}
                              className="flex items-start gap-2 text-xs font-mono text-foreground/80"
                            >
                              <ChevronRight className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                              <span>{resp}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Technologies Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {exp.technologies.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 bg-background border border-white/10 text-[10px] font-mono text-muted rounded-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </HudCard>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
