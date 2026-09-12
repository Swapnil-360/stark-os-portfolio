"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { Palette, Shield, Menu, X } from "lucide-react";
import HudBadge from "../ui/HudBadge";

interface TopNavProps {
  activeSection: string;
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

const NAV_LINKS = [
  { href: "#hero", id: "hero", label: "HOME" },
  { href: "#profile", id: "profile", label: "PROFILE" },
  { href: "#work", id: "work", label: "WORK" },
  { href: "#experience", id: "experience", label: "EXPERIENCE" },
  { href: "#expertise", id: "expertise", label: "EXPERTISE" },
  { href: "#stack", id: "stack", label: "STACK" },
  { href: "#contact", id: "contact", label: "CONTACT" },
];

export default function TopNav({
  activeSection,
  onMobileMenuToggle,
  isMobileMenuOpen,
}: TopNavProps) {
  const { currentTheme, themeId, setTheme, availableThemes } = useTheme();
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-hud py-3 shadow-lg"
          : "bg-transparent border-white/5 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">
        {/* Brand Logo with Command Mark */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="relative w-10 h-10 bg-surface border border-accent/40 rounded-sm flex items-center justify-center font-mono font-black text-xl text-white group-hover:border-accent group-hover:shadow-hud-glow transition-all duration-300 hud-cut-corner-tl">
            <span className="text-accent group-hover:scale-110 transition-transform">S</span>
            <span className="bracket-tl" />
            <span className="bracket-br" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-base tracking-widest text-foreground group-hover:text-accent transition-colors">
              SWAPNIL
            </span>
            <span className="font-mono text-[9px] tracking-widest text-muted uppercase">
              CMD // INTERFACE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`/${link.href}`}
                className={`relative font-mono text-xs tracking-widest uppercase transition-all py-1 px-1 ${
                  isActive
                    ? "text-accent font-semibold"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent shadow-hud-glow transition-all" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right HUD Controls */}
        <div className="flex items-center gap-3">
          <HudBadge variant="accent" pulse className="hidden sm:inline-flex">
            SYS.ONLINE
          </HudBadge>

          {/* Theme Selector Trigger */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="p-2 bg-surface/80 hover:bg-surface border border-hud hover:border-accent rounded-sm text-foreground transition-all flex items-center gap-1.5 font-mono text-xs"
              title="Switch HUD Theme"
              aria-label="Theme selector"
            >
              <Palette className="w-4 h-4 text-accent" />
              <span className="hidden xl:inline text-[11px] uppercase tracking-wider text-muted">
                {currentTheme.name.split(" ")[0]}
              </span>
            </button>

            {/* Theme Dropdown */}
            {themeDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-surface-elevated/95 backdrop-blur-md border border-hud p-2 shadow-hud-card z-50 hud-cut-corner-tl"
                onMouseLeave={() => setThemeDropdownOpen(false)}
              >
                <div className="px-2 py-1 text-[10px] font-mono text-muted uppercase tracking-wider border-b border-white/5 mb-1">
                  Select Theme Protocol
                </div>
                {availableThemes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-sm font-mono text-xs flex items-center justify-between transition-all ${
                      themeId === t.id
                        ? "bg-accent/20 text-white border-l-2 border-accent"
                        : "text-muted hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    <span>{t.name}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/20"
                      style={{ backgroundColor: t.accent }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>



          {/* Mobile Menu Toggle */}
          <button
            onClick={onMobileMenuToggle}
            className="p-2 lg:hidden bg-surface border border-hud hover:border-accent text-foreground rounded-sm transition-all"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-accent" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
