"use client";

import React from "react";

interface RightSidebarProps {
  activeSection: string;
}

const CONTEXT_TABS = [
  { id: "profile", label: "PROFILE" },
  { id: "work", label: "WORK" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "expertise", label: "EXPERTISE" },
  { id: "stack", label: "STACK" },
  { id: "contact", label: "CONTACT" },
];

export default function RightSidebar({ activeSection }: RightSidebarProps) {
  return (
    <aside
      className="fixed right-0 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col items-center bg-surface/80 backdrop-blur-md border-l border-t border-b border-hud py-6 px-1 rounded-l-md shadow-2xl"
      aria-label="Contextual panel"
    >
      <div className="text-[9px] font-mono text-muted tracking-widest uppercase mb-4 [writing-mode:vertical-lr] rotate-180 opacity-60">
        NAVIGATION
      </div>
      <div className="flex flex-col items-center gap-3">
        {CONTEXT_TABS.map((tab) => {
          const isActive = activeSection === tab.id;
          return (
            <a
              key={tab.id}
              href={`#${tab.id}`}
              className={`relative py-3 px-1.5 font-mono text-[11px] tracking-widest transition-all duration-300 [writing-mode:vertical-lr] rotate-180 rounded-sm flex items-center justify-center ${
                isActive
                  ? "bg-accent text-white font-bold shadow-hud-glow border-r-2 border-white scale-105"
                  : "text-muted hover:text-foreground hover:bg-white/5"
              }`}
            >
              {tab.label}
            </a>
          );
        })}
      </div>
    </aside>
  );
}
