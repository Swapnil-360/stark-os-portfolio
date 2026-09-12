"use client";

import React from "react";
import HudCard from "../ui/HudCard";
import HudBadge from "../ui/HudBadge";
import { useData } from "@/context/DataContext";
import { GraduationCap, BookOpen, MapPin, Calendar, CheckCircle2 } from "lucide-react";

export default function EducationSection() {
  const { education } = useData();

  return (
    <section id="education" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-[1px] bg-accent" />
            <HudBadge variant="accent">FOUNDATIONS // SCHOLASTIC</HudBadge>
            <span className="w-6 h-[1px] bg-accent" />
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground uppercase">
            ACADEMICS <span className="text-accent">//</span> COMPUTER SCIENCE
          </h2>
          <p className="font-mono text-xs sm:text-sm text-muted tracking-widest uppercase mt-2 max-w-xl">
            FORMAL COMPUTER SCIENCE & ENGINEERING UNDERGRADUATE FOUNDATION
          </p>
        </div>

        {/* Academic Card */}
        <div className="max-w-4xl mx-auto">
          <HudCard chamfer="both" glow className="bg-surface-elevated p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hud pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-accent/10 border border-accent/40 rounded-sm flex items-center justify-center text-accent shadow-hud-glow shrink-0">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-display font-black text-2xl text-foreground">
                    {education.degree}
                  </h3>
                  <div className="font-mono text-sm text-accent font-semibold mt-1">
                    {education.institution}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-1 font-mono text-xs text-muted">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-accent" />
                  <span>{education.period}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  <span>{education.location}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
              {education.description}
            </p>

            {/* Coursework Matrix */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase font-bold tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>CORE ENGINEERING COURSEWORK</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {education.coursework.map((course, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-background border border-white/5 hover:border-hud rounded-sm font-mono text-xs text-muted hover:text-foreground transition-all flex items-center gap-2"
                  >
                    <span className="text-accent">&gt;</span>
                    <span className="truncate">{course}</span>
                  </div>
                ))}
              </div>
            </div>
          </HudCard>
        </div>
      </div>
    </section>
  );
}
