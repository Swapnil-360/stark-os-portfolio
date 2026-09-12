"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeConfig, ThemeId } from "@/types/portfolio";
import { THEME_PRESETS } from "@/lib/initialData";

interface ThemeContextType {
  currentTheme: ThemeConfig;
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
  availableThemes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>("obsidian-red");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("swapnil_theme") as ThemeId;
    if (saved && THEME_PRESETS.some((t) => t.id === saved)) {
      setThemeId(saved);
    }
  }, []);

  const currentTheme = THEME_PRESETS.find((t) => t.id === themeId) || THEME_PRESETS[0];

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;

    root.style.setProperty("--accent", currentTheme.accent);
    root.style.setProperty("--accent-hover", currentTheme.accentHover);
    root.style.setProperty("--accent-glow", currentTheme.accentGlow);
    root.style.setProperty("--accent-secondary", currentTheme.accentSecondary);
    root.style.setProperty("--accent-subtle", currentTheme.accentSubtle);
    root.style.setProperty("--background", currentTheme.background);
    root.style.setProperty("--surface", currentTheme.surface);
    root.style.setProperty("--surface-elevated", currentTheme.surfaceElevated);
    root.style.setProperty("--surface-glass", currentTheme.surfaceGlass);
    root.style.setProperty("--foreground", currentTheme.foreground);
    root.style.setProperty("--muted", currentTheme.muted);
    root.style.setProperty("--border-hud", currentTheme.borderHud);
    root.style.setProperty("--border-hud-bright", currentTheme.borderHudBright);
    root.style.setProperty("--grid-hud", currentTheme.gridHud);

    // Also set body background and color directly
    document.body.style.backgroundColor = currentTheme.background;
    document.body.style.color = currentTheme.foreground;

    localStorage.setItem("swapnil_theme", themeId);
  }, [themeId, currentTheme, mounted]);

  const setTheme = (id: ThemeId) => {
    setThemeId(id);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        themeId,
        setTheme,
        availableThemes: THEME_PRESETS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
