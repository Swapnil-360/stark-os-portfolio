"use client";

import React from "react";
import HudCard from "../ui/HudCard";
import HudBadge from "../ui/HudBadge";
import { User, Cpu, Sparkles, Brain, Layers, Code, Award, GraduationCap } from "lucide-react";
import { useData } from "@/context/DataContext";

export default function ProfileSection() {
  const { education, settings } = useData();

  return (
    <section id="profile" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-[1px] bg-accent" />
            <HudBadge variant="accent">SYS.DOSSIER // 01</HudBadge>
            <span className="w-6 h-[1px] bg-accent" />
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground uppercase">
            PROFILE <span className="text-accent">//</span> WHO I AM
          </h2>
          <p className="font-mono text-xs sm:text-sm text-muted tracking-widest uppercase mt-2">
            ENGINEERING COHESIVE DIGITAL EXPERIENCES
          </p>
        </div>

        {/* 2-Column Dossier Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Bio Narrative & Core Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <HudCard chamfer="tl" className="space-y-4">
              <div className="flex items-center justify-between border-b border-hud pb-3">
                <div className="flex items-center gap-2 text-accent font-mono text-xs uppercase tracking-wider">
                  <User className="w-4 h-4" />
                  <span>BIOGRAPHICAL SUMMARY</span>
                </div>
                <span className="font-mono text-[10px] text-muted">ID: M-360-SWP</span>
              </div>

              <p className="text-foreground/90 text-base sm:text-lg leading-relaxed font-normal">
                I am <span className="text-accent font-semibold">Md. Miftahur Rahman Swapnil</span>, a developer and creative technologist based in Dhaka, Bangladesh. Currently pursuing my BSc in Computer Science & Engineering at Bangladesh University of Business and Technology (BUBT).
              </p>

              <p className="text-muted text-base leading-relaxed">
                My work spans modern web and mobile applications, human-centered UI/UX systems, and creative digital media. Rather than building generic solutions, I focus on crafting software that feels responsive, reliable, and visually distinctive.
              </p>

              <p className="text-muted text-base leading-relaxed">
                I actively harness AI-assisted development tools like Claude and Cursor to accelerate prototyping and shipping, while ensuring high architectural standards, clean component hierarchies, and maintainable TypeScript codebases.
              </p>

              {/* Core Attributes Pills */}
              <div className="pt-4 border-t border-white/5 flex flex-wrap gap-2">
                {[
                  "Frontend Architecture",
                  "Mobile Applications",
                  "UI/UX Design Systems",
                  "AI-Assisted Engineering",
                  "Motion & Creative Media",
                  "BUBT CSE"
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-surface-elevated border border-hud text-xs font-mono text-foreground/80 rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </HudCard>

            {/* Academic Research Interests */}
            <HudCard chamfer="br" className="space-y-4">
              <div className="flex items-center justify-between border-b border-hud pb-3">
                <div className="flex items-center gap-2 text-accent font-mono text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>SPECIALIZED RESEARCH & EXPLORATION</span>
                </div>
                <span className="font-mono text-[10px] text-muted">ACADEMIC // R&D</span>
              </div>

              <div className="grid gap-3">
                {education.researchInterests?.map((res, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-surface-elevated/60 border border-white/5 hover:border-hud rounded-sm transition-all flex items-start gap-3"
                  >
                    <div className="p-2 bg-accent/10 text-accent rounded-sm mt-0.5">
                      {idx === 0 ? <Layers className="w-4 h-4" /> : idx === 1 ? <Cpu className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-sm text-foreground">
                        {res.title}
                      </h4>
                      <p className="text-xs text-muted mt-1 leading-normal">
                        {res.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </HudCard>
          </div>

          {/* Right Column: Key Specifications Dossier Table */}
          <div className="lg:col-span-5 space-y-6">
            <HudCard chamfer="both" glow className="space-y-5">
              <div className="flex items-center justify-between border-b border-hud pb-3">
                <span className="font-mono text-xs text-accent uppercase tracking-widest font-bold">
                  // TELEMETRY DOSSIER
                </span>
                <HudBadge variant="success">ACTIVE STATUS</HudBadge>
              </div>

              <div className="divide-y divide-white/5 font-mono text-xs">
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-muted uppercase">Full Name</span>
                  <span className="text-foreground font-semibold">Md. Miftahur Rahman Swapnil</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-muted uppercase">Primary Role</span>
                  <span className="text-accent font-semibold">Frontend & Creative Dev</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-muted uppercase">Base Location</span>
                  <span className="text-foreground">Dhaka, Bangladesh</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-muted uppercase">Education</span>
                  <span className="text-foreground">BSc in CSE, BUBT</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-muted uppercase">Graduation Target</span>
                  <span className="text-accent">2026 (Undergraduate)</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-muted uppercase">Work Status</span>
                  <span className="text-emerald-400 font-semibold">{settings.availability}</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-muted uppercase">Primary Stack</span>
                  <span className="text-foreground">Next.js / TypeScript / React</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-muted uppercase">Design Tools</span>
                  <span className="text-foreground">Figma / Photoshop / Canva</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-muted uppercase">Motion Suite</span>
                  <span className="text-foreground">CapCut Pro / Premiere Pro</span>
                </div>
              </div>

              <div className="pt-3 border-t border-hud">
                <div className="bg-background/80 p-3 rounded-sm border border-hud text-[11px] font-mono text-muted space-y-1">
                  <div className="text-accent font-semibold">&gt;&gt; INTAKE 51 COMMUNITY INITIATIVE</div>
                  <p>Co-founded and engineered the BUBT Edu51Portal academic infrastructure utilized across engineering batches.</p>
                </div>
              </div>
            </HudCard>
          </div>
        </div>
      </div>
    </section>
  );
}
