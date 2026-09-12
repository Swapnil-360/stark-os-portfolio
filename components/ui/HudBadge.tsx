"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface HudBadgeProps {
  children: React.ReactNode;
  variant?: "accent" | "muted" | "success" | "warning";
  className?: string;
  pulse?: boolean;
}

export default function HudBadge({
  children,
  variant = "accent",
  className,
  pulse = false,
}: HudBadgeProps) {
  const variantStyles = {
    accent: "text-accent border-accent/40 bg-accent/10",
    muted: "text-muted border-white/10 bg-white/5",
    success: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    warning: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-mono tracking-widest uppercase border rounded-sm relative",
        variantStyles[variant],
        className
      )}
    >
      {pulse && (
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
      )}
      <span>{children}</span>
    </span>
  );
}
