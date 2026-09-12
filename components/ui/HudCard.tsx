"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface HudCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  chamfer?: "tl" | "br" | "both" | "all" | "none";
  hoverEffect?: boolean;
  glow?: boolean;
}

export default function HudCard({
  children,
  chamfer = "tl",
  hoverEffect = true,
  glow = false,
  className,
  ...props
}: HudCardProps) {
  const chamferClass = {
    tl: "hud-cut-corner-tl",
    br: "hud-cut-corner-br",
    both: "hud-cut-corner-both",
    all: "hud-cut-corner-all",
    none: "",
  }[chamfer];

  return (
    <div
      className={cn(
        "relative bg-surface/80 backdrop-blur-md border border-hud p-6 transition-all duration-400 group",
        chamferClass,
        hoverEffect && "hover:border-hud-bright hover:shadow-hud-glow hover:-translate-y-1",
        glow && "shadow-hud-glow border-accent/40",
        className
      )}
      {...props}
    >
      <span className="bracket-tl opacity-50 group-hover:opacity-100 transition-opacity" />
      <span className="bracket-tr opacity-50 group-hover:opacity-100 transition-opacity" />
      <span className="bracket-bl opacity-50 group-hover:opacity-100 transition-opacity" />
      <span className="bracket-br opacity-50 group-hover:opacity-100 transition-opacity" />
      {children}
    </div>
  );
}
