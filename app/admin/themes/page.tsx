"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { THEME_PRESETS } from "@/lib/initialData";
import { Palette, Check, Sparkles } from "lucide-react";

export default function AdminThemesPage() {
  const { currentTheme, themeId, setTheme, availableThemes } = useTheme();
  const [statusMessage, setStatusMessage] = useState("");

  const handleSelectTheme = (id: any) => {
    setTheme(id);
    setStatusMessage(`Theme protocol changed to "${id}"`);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Theme Protocols & Palette Architecture
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Toggle between the 5 engineered sci-fi command color schemes.
          </p>
        </div>

        {statusMessage && (
          <div className="px-3 py-1.5 bg-emerald-950/40 border border-emerald-800 text-emerald-400 rounded text-xs font-mono flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* 5 Themes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableThemes.map((preset) => {
          const isActive = themeId === preset.id;
          return (
            <div
              key={preset.id}
              className={`p-6 bg-[#11141c] border rounded-lg space-y-4 transition-all ${
                isActive
                  ? "border-red-500 ring-1 ring-red-500/50 shadow-lg"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{preset.name}</span>
                    {isActive && (
                      <span className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-mono">
                        ACTIVE
                      </span>
                    )}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    {preset.subtitle}
                  </div>
                </div>
                <div
                  className="w-8 h-8 rounded-full border border-white/20 shadow-inner"
                  style={{ backgroundColor: preset.accent }}
                />
              </div>

              {/* Color Swatches */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Accent Core</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300">{preset.accent}</span>
                    <span
                      className="w-3.5 h-3.5 rounded border border-white/10"
                      style={{ backgroundColor: preset.accent }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Surface Depth</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300">{preset.surface}</span>
                    <span
                      className="w-3.5 h-3.5 rounded border border-white/10"
                      style={{ backgroundColor: preset.surface }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Obsidian Base</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300">{preset.background}</span>
                    <span
                      className="w-3.5 h-3.5 rounded border border-white/10"
                      style={{ backgroundColor: preset.background }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleSelectTheme(preset.id)}
                  disabled={isActive}
                  className={`w-full py-2 rounded text-xs font-semibold font-mono uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-slate-800 text-slate-500 cursor-default"
                      : "bg-red-600 hover:bg-red-500 text-white shadow"
                  }`}
                >
                  {isActive ? "Currently Deployed" : "Deploy Theme Protocol"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
