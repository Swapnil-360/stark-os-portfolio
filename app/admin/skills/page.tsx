"use client";

import React, { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { SkillCategory } from "@/types/portfolio";
import { Cpu, Plus, Trash2, Check, Sparkles } from "lucide-react";

export default function AdminSkillsPage() {
  const { skills, updateSkills } = useData();
  const [skillGroups, setSkillGroups] = useState<SkillCategory[]>(skills);
  const [newSkillInput, setNewSkillInput] = useState<{ [catIdx: number]: string }>({});
  const [activeInputCat, setActiveInputCat] = useState<number | null>(null);

  // Synchronize local state with real-time context data
  useEffect(() => {
    setSkillGroups(skills);
  }, [skills]);

  const handleAddSkillDirect = (categoryIndex: number) => {
    const name = (newSkillInput[categoryIndex] || "").trim();
    if (!name) return;

    const updated = skillGroups.map((group, idx) => {
      if (idx === categoryIndex) {
        return {
          ...group,
          skills: [...group.skills, { name, highlight: true }],
        };
      }
      return group;
    });

    setSkillGroups(updated);
    updateSkills(updated); // IMMEDIATE AUTO-SAVE
    setNewSkillInput({ ...newSkillInput, [categoryIndex]: "" });
    setActiveInputCat(null);
  };

  const handleRemoveSkill = (categoryIndex: number, skillIndex: number) => {
    const updated = skillGroups.map((group, idx) => {
      if (idx === categoryIndex) {
        const filteredSkills = group.skills.filter((_, sIdx) => sIdx !== skillIndex);
        return { ...group, skills: filteredSkills };
      }
      return group;
    });
    setSkillGroups(updated);
    updateSkills(updated); // IMMEDIATE AUTO-SAVE
  };

  const handleToggleHighlight = (categoryIndex: number, skillIndex: number) => {
    const updated = skillGroups.map((group, idx) => {
      if (idx === categoryIndex) {
        const mappedSkills = group.skills.map((skill, sIdx) => {
          if (sIdx === skillIndex) {
            return { ...skill, highlight: !skill.highlight };
          }
          return skill;
        });
        return { ...group, skills: mappedSkills };
      }
      return group;
    });
    setSkillGroups(updated);
    updateSkills(updated); // IMMEDIATE AUTO-SAVE
  };

  return (
    <div className="space-y-8">
      {/* Header with Instant Auto-Save Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Technology Stack & Core Tooling
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Group, highlight, and adjust tech nodes visible on the public matrix. All changes save immediately!
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-950/40 border border-emerald-800/80 text-emerald-400 rounded-full text-xs font-mono shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Auto-Save Active // Instant Sync</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {skillGroups.map((group, cIdx) => (
          <div key={cIdx} className="p-6 bg-[#11141c] border border-slate-800 rounded-lg space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Cpu className="w-4 h-4 text-red-400" />
                <span>{group.category}</span>
              </div>
              <button
                onClick={() => setActiveInputCat(activeInputCat === cIdx ? null : cIdx)}
                className="flex items-center gap-1 text-xs font-mono text-red-400 hover:text-red-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{activeInputCat === cIdx ? "Cancel" : "+ Add Node"}</span>
              </button>
            </div>

            {/* Inline Add Node Input */}
            {activeInputCat === cIdx && (
              <div className="p-3 bg-[#0a0c10] border border-red-500/40 rounded flex items-center gap-2 animate-in fade-in duration-200">
                <input
                  type="text"
                  placeholder="Enter tool name (e.g. Next.js, Docker, PyTorch)..."
                  value={newSkillInput[cIdx] || ""}
                  onChange={(e) => setNewSkillInput({ ...newSkillInput, [cIdx]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkillDirect(cIdx);
                    }
                  }}
                  autoFocus
                  className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-white focus:outline-none focus:border-red-500"
                />
                <button
                  onClick={() => handleAddSkillDirect(cIdx)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-mono font-bold transition-all shadow-sm"
                >
                  Add
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill, sIdx) => (
                <div
                  key={sIdx}
                  className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-2 border transition-all ${
                    skill.highlight
                      ? "bg-red-600/20 border-red-500 text-white font-semibold shadow-[0_0_12px_rgba(255,30,56,0.3)]"
                      : "bg-[#0a0c10] border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <span
                    onClick={() => handleToggleHighlight(cIdx, sIdx)}
                    className="cursor-pointer select-none"
                    title="Click to toggle illuminated highlight status"
                  >
                    {skill.name}
                  </span>
                  <button
                    onClick={() => handleRemoveSkill(cIdx, sIdx)}
                    className="text-slate-500 hover:text-red-400 p-0.5 rounded transition-colors"
                    title="Remove node"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-500 font-mono pt-1">
              Tip: Click any skill label to toggle its illuminated highlight badge. Changes save instantly.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
