"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { X, Shield, Palette } from "lucide-react";
import HudBadge from "../ui/HudBadge";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
}

const MOBILE_LINKS = [
  { href: "#hero", id: "hero", label: "HOME", num: "01" },
  { href: "#profile", id: "profile", label: "PROFILE", num: "02" },
  { href: "#work", id: "work", label: "SELECTED WORK", num: "03" },
  { href: "#experience", id: "experience", label: "EXPERIENCE", num: "04" },
  { href: "#expertise", id: "expertise", label: "EXPERTISE", num: "05" },
  { href: "#stack", id: "stack", label: "TECH STACK", num: "06" },
  { href: "#contact", id: "contact", label: "CONTACT", num: "07" },
];

export default function MobileDrawer({
  isOpen,
  onClose,
  activeSection,
}: MobileDrawerProps) {
  const { currentTheme, themeId, setTheme, availableThemes } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-between bg-background/95 backdrop-blur-xl border-l border-hud p-6 hud-grid-pattern">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-hud pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-surface border border-accent flex items-center justify-center font-mono font-bold text-accent">
            S
          </div>
          <div>
            <div className="font-display font-bold text-sm tracking-wider">SWAPNIL</div>
            <div className="font-mono text-[9px] text-muted">COMMAND DRAWER</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 border border-hud hover:border-accent text-accent rounded-sm"
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2 my-auto">
        {MOBILE_LINKS.map((link) => {
          const isActive = activeSection === link.id;
          return (
            <a
              key={link.id}
              href={link.href}
              onClick={onClose}
              className={`flex items-center justify-between p-3 border rounded-sm font-mono transition-all ${
                isActive
                  ? "bg-accent/20 text-accent border-accent shadow-hud-glow"
                  : "border-white/5 text-muted hover:text-foreground hover:bg-white/5"
              }`}
            >
              <span className="text-sm font-semibold tracking-wider">{link.label}</span>
              <span className="text-[10px] text-muted">{link.num} //</span>
            </a>
          );
        })}
      </nav>

      {/* Theme & Controls Footer */}
      <div className="border-t border-hud pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-muted flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-accent" /> THEME PROTOCOL:
          </span>
          <HudBadge variant="accent">{currentTheme.name.split(" ")[0]}</HudBadge>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {availableThemes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`h-8 rounded-sm border flex items-center justify-center transition-all ${
                themeId === t.id
                  ? "border-accent scale-105 shadow-hud-glow"
                  : "border-white/10 hover:border-white/30"
              }`}
              style={{ backgroundColor: t.surface }}
              title={t.name}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: t.accent }}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[10px] font-mono text-muted">SWAPNIL // PORTFOLIO</span>
          <span className="text-[10px] font-mono text-muted">BUILD 2026 // DHAKA</span>
        </div>
      </div>
    </div>
  );
}
