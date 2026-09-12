"use client";

import React from "react";
import { useData } from "@/context/DataContext";
import { ArrowUp, Terminal, Shield } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const { settings, socialLinks } = useData();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-hud bg-background/90 py-12 relative overflow-hidden z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse" />
              <span className="font-display font-black text-xl tracking-widest text-foreground uppercase">
                SWAPNIL
              </span>
              <span className="font-mono text-[10px] text-muted tracking-widest uppercase">
                // {settings.systemVersion}
              </span>
            </div>
            <p className="font-mono text-xs text-muted tracking-wider uppercase">
              BUILDING DIGITAL EXPERIENCES ACROSS WEB, APPS & INTELLIGENT SYSTEMS
            </p>
          </div>

          {/* Social Links Network */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {socialLinks.slice(0, 5).map((soc) => (
              <a
                key={soc.id}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-muted hover:text-accent transition-colors"
              >
                {soc.platform}
              </a>
            ))}
            <Link
              href="/admin"
              className="text-xs font-mono text-accent/80 hover:text-accent flex items-center gap-1 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" /> CMS
            </Link>
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-hud hover:border-accent text-accent font-mono text-xs uppercase tracking-wider rounded-sm transition-all group shadow-sm hover:shadow-hud-glow"
          >
            <span>ELEVATE TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Bottom Technical Telemetry Bar */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-muted">
          <div>
            © {settings.buildYear} {settings.author}. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>COORDINATES: {settings.coordinates}</span>
            <span className="text-accent">•</span>
            <span>STATUS: {settings.availability}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
