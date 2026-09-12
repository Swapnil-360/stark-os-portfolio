"use client";

import React from "react";
import {
  Home,
  User,
  FolderGit2,
  History,
  Layers,
  Cpu,
  Mail,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface LeftCommandRailProps {
  activeSection: string;
}

const RAIL_ITEMS = [
  { id: "hero", label: "Home", icon: Home },
  { id: "profile", label: "Profile", icon: User },
  { id: "work", label: "Projects", icon: FolderGit2 },
  { id: "experience", label: "Experience", icon: History },
  { id: "expertise", label: "Expertise", icon: Layers },
  { id: "stack", label: "Tech Stack", icon: Cpu },
  { id: "contact", label: "Contact", icon: Mail },
];

export default function LeftCommandRail({ activeSection }: LeftCommandRailProps) {
  const handleScrollDown = () => {
    const sectionIds = ["hero", "profile", "work", "experience", "expertise", "stack", "contact"];
    const currentIndex = sectionIds.indexOf(activeSection);
    if (currentIndex < sectionIds.length - 1) {
      const nextId = sectionIds[currentIndex + 1];
      const el = document.getElementById(nextId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleScrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 z-30 w-16 hidden lg:flex flex-col items-center justify-between py-6 bg-surface/70 backdrop-blur-md border-r border-hud"
      aria-label="Command rail"
    >
      {/* Top Brand Marker */}
      <a
        href="#hero"
        className="w-10 h-10 bg-background border border-hud hover:border-accent flex items-center justify-center font-mono font-bold text-accent transition-all duration-300 group hud-cut-corner-tl"
        title="Top of Command Deck"
      >
        <span>S</span>
      </a>

      {/* Main Command Dock Icons */}
      <nav className="flex flex-col items-center gap-4">
        {RAIL_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`group relative w-10 h-10 flex items-center justify-center rounded-sm transition-all duration-300 ${
                isActive
                  ? "bg-accent text-white shadow-hud-glow"
                  : "text-muted hover:text-foreground hover:bg-white/5 border border-transparent hover:border-hud"
              }`}
              aria-label={item.label}
            >
              <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />

              {/* Tooltip */}
              <span className="absolute left-14 px-2.5 py-1 bg-surface-elevated text-foreground font-mono text-[11px] tracking-wider uppercase border border-hud rounded-sm opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                {item.label}
              </span>
            </a>
          );
        })}
      </nav>

      {/* Bottom Scroll Buttons */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={handleScrollUp}
          className="w-8 h-8 flex items-center justify-center bg-surface hover:bg-white/10 border border-hud rounded-sm text-muted hover:text-foreground transition-all"
          title="Scroll To Top"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button
          onClick={handleScrollDown}
          className="w-8 h-8 flex items-center justify-center bg-accent/20 hover:bg-accent border border-accent rounded-sm text-accent hover:text-white transition-all shadow-hud-glow"
          title="Scroll Down"
          aria-label="Scroll down"
        >
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>
    </aside>
  );
}
