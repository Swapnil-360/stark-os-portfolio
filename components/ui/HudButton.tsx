"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface HudButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  target?: string;
  rel?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export default function HudButton({
  variant = "primary",
  size = "md",
  href,
  target,
  rel,
  icon,
  className,
  children,
  ...props
}: HudButtonProps) {
  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs tracking-wider",
    md: "px-6 py-2.5 text-sm tracking-widest",
    lg: "px-8 py-3.5 text-base tracking-widest font-semibold",
  };

  const variantClasses = {
    primary:
      "bg-accent text-white font-mono shadow-hud-glow hover:bg-accent-hover hover:shadow-hud-glow-lg border border-accent/40",
    secondary:
      "bg-surface-glass text-foreground hover:text-white border border-hud hover:border-accent hover:bg-accent/10 font-mono",
    danger:
      "bg-red-950/40 text-red-400 border border-red-500/50 hover:bg-red-900/60 font-mono",
    ghost:
      "bg-transparent text-muted hover:text-foreground border border-transparent hover:border-hud font-mono",
  };

  const content = (
    <>
      <span className="bracket-tl opacity-70 transition-transform group-hover:scale-125" />
      <span className="bracket-br opacity-70 transition-transform group-hover:scale-125" />
      <span className="flex items-center gap-2 relative z-10">
        {icon && <span className="transition-transform group-hover:scale-110">{icon}</span>}
        <span>{children}</span>
      </span>
    </>
  );

  const combinedClasses = cn(
    "relative inline-flex items-center justify-center uppercase select-none transition-all duration-300 group cursor-pointer active:scale-95 hud-cut-corner-tl",
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={combinedClasses}>
        {content}
      </a>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {content}
    </button>
  );
}
