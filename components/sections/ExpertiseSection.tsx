"use client";

import React from "react";
import HudCard from "../ui/HudCard";
import HudBadge from "../ui/HudBadge";
import { useData } from "@/context/DataContext";
import {
  Globe,
  Smartphone,
  Layout,
  Palette,
  Film,
  Layers,
  Users,
  Coins,
  ArrowUpRight,
} from "lucide-react";

export default function ExpertiseSection() {
  const { services } = useData();

  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case "globe":
        return <Globe className="w-6 h-6" />;
      case "smartphone":
        return <Smartphone className="w-6 h-6" />;
      case "layout":
        return <Layout className="w-6 h-6" />;
      case "palette":
        return <Palette className="w-6 h-6" />;
      case "film":
        return <Film className="w-6 h-6" />;
      case "layers":
        return <Layers className="w-6 h-6" />;
      case "users":
        return <Users className="w-6 h-6" />;
      case "coins":
        return <Coins className="w-6 h-6" />;
      default:
        return <Globe className="w-6 h-6" />;
    }
  };

  return (
    <section id="expertise" className="py-24 relative overflow-hidden bg-surface/30">
      {/* Background HUD Grid */}
      <div className="absolute inset-0 hud-dots-pattern opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-[1px] bg-accent" />
            <HudBadge variant="accent">CAPABILITIES // MODULES</HudBadge>
            <span className="w-6 h-[1px] bg-accent" />
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground uppercase">
            EXPERTISE <span className="text-accent">//</span> SYSTEM CAPABILITIES
          </h2>
          <p className="font-mono text-xs sm:text-sm text-muted tracking-widest uppercase mt-2 max-w-xl">
            MODULAR DOMAINS OF PROFESSIONAL EXECUTION & ENGINEERING
          </p>
        </div>

        {/* 8 Modular Capability Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((item) => (
            <HudCard
              key={item.id}
              chamfer="tl"
              hoverEffect
              className="flex flex-col justify-between h-full bg-surface-elevated/70 hover:border-accent group"
            >
              <div>
                {/* Top Module Header: Number + Icon */}
                <div className="flex items-center justify-between border-b border-hud/60 pb-3 mb-4">
                  <span className="font-mono font-bold text-xs text-accent tracking-widest">
                    {item.number} //
                  </span>
                  <div className="p-2.5 bg-accent/10 border border-accent/30 rounded-sm text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300 shadow-hud-glow">
                    {getIcon(item.icon)}
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-lg text-foreground group-hover:text-accent transition-colors flex items-center justify-between">
                  <span>{item.title}</span>
                  <ArrowUpRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-muted mt-2.5 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              {/* Tags at bottom */}
              <div className="pt-4 mt-6 border-t border-white/5 flex flex-wrap gap-1.5">
                {item.tags?.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 bg-background border border-white/10 text-[10px] font-mono text-muted group-hover:border-hud transition-colors rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </HudCard>
          ))}
        </div>
      </div>
    </section>
  );
}
