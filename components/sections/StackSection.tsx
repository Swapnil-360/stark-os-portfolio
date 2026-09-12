"use client";

import React, { useState } from "react";
import HudCard from "../ui/HudCard";
import HudBadge from "../ui/HudBadge";
import { useData } from "@/context/DataContext";
import { Cpu, Terminal, Sparkles, Layers, ShieldCheck } from "lucide-react";

export default function StackSection() {
  const { skills } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", ...skills.map((s) => s.category)];

  const filteredSkills =
    selectedCategory === "all"
      ? skills
      : skills.filter((s) => s.category === selectedCategory);

  return (
    <section id="stack" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-[1px] bg-accent" />
            <HudBadge variant="accent">TECHNOLOGY NODES // MATRIX</HudBadge>
            <span className="w-6 h-[1px] bg-accent" />
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground uppercase">
            STACK <span className="text-accent">//</span> INSTRUMENTS & TOOLS
          </h2>
          <p className="font-mono text-xs sm:text-sm text-muted tracking-widest uppercase mt-2 max-w-xl">
            PRECISION ENGINEERING & DESIGN ECOSYSTEM UTILIZED FOR HIGH-END PRODUCTION
          </p>

          {/* Category Switcher Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 font-mono text-xs uppercase tracking-wider rounded-sm border transition-all ${
                  selectedCategory === cat
                    ? "bg-accent text-white border-accent shadow-hud-glow"
                    : "bg-surface border-hud text-muted hover:text-foreground hover:border-white/20"
                }`}
              >
                {cat === "all" ? "ALL NODES" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grouped Technology Node Matrix */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredSkills.map((catGroup, idx) => (
            <HudCard
              key={idx}
              chamfer="tl"
              className="bg-surface-elevated/70 border-hud space-y-4"
            >
              {/* Group Title Bar */}
              <div className="flex items-center justify-between border-b border-hud/60 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-accent" />
                  <h3 className="font-display font-bold text-base tracking-wide text-foreground uppercase">
                    {catGroup.category}
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-muted uppercase">
                  {catGroup.skills.length} MODULES
                </span>
              </div>

              {/* Technology Node Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                {catGroup.skills.map((skill, sIdx) => (
                  <div
                    key={sIdx}
                    className={`group relative p-3 rounded-sm border transition-all duration-300 flex flex-col justify-between ${
                      skill.highlight
                        ? "bg-accent/10 border-accent/40 hover:border-accent hover:shadow-hud-glow hover:bg-accent/20"
                        : "bg-surface border-white/5 hover:border-hud hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      <span className="font-mono text-[9px] text-muted">
                        SYS.OK
                      </span>
                    </div>

                    <div className="mt-2">
                      <div className="font-display font-semibold text-xs sm:text-sm text-foreground group-hover:text-accent transition-colors">
                        {skill.name}
                      </div>
                      <div className="font-mono text-[9px] text-muted tracking-wider uppercase mt-0.5">
                        {skill.highlight ? "CORE MASTERY" : "OPERATIONAL"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </HudCard>
          ))}
        </div>
      </div>
    </section>
  );
}
