"use client";

import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { Experience } from "@/types/portfolio";
import { History, Plus, Edit, Trash2, Check, X } from "lucide-react";

export default function AdminExperiencePage() {
  const { experiences, updateExperiences } = useData();
  const [list, setList] = useState<Experience[]>(experiences);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const emptyExp: Experience = {
    id: "exp-" + Date.now(),
    role: "",
    organization: "",
    period: "2024 — Present",
    startDate: "2024",
    endDate: "Present",
    description: "",
    responsibilities: [],
    technologies: ["Next.js", "TypeScript"],
    isCurrent: true,
    badge: "",
  };

  const [formData, setFormData] = useState<Experience>(emptyExp);
  const [respInput, setRespInput] = useState("");
  const [techInput, setTechInput] = useState("");

  const startCreate = () => {
    const newExp = { ...emptyExp, id: "exp-" + Date.now() };
    setFormData(newExp);
    setEditingId(null);
    setRespInput("");
    setTechInput("");
    setIsEditing(true);
  };

  const startEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setFormData(exp);
    setRespInput(exp.responsibilities.join("\n"));
    setTechInput(exp.technologies.join(", "));
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this experience milestone?")) {
      const updated = list.filter((e) => e.id !== id);
      setList(updated);
      updateExperiences(updated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const responsibilities = respInput.split("\n").map((r) => r.trim()).filter(Boolean);
    const technologies = techInput.split(",").map((t) => t.trim()).filter(Boolean);

    const payload = { ...formData, responsibilities, technologies };

    let updated: Experience[];
    if (editingId) {
      updated = list.map((e) => (e.id === editingId ? payload : e));
    } else {
      updated = [payload, ...list];
    }

    setList(updated);
    await updateExperiences(updated);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Experience & Journey Milestones
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage professional roles, client initiatives, and technical engagements.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={startCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-semibold shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Experience</span>
          </button>
        )}
      </div>

      {isEditing && (
        <form onSubmit={handleSubmit} className="p-6 bg-[#11141c] border border-slate-800 rounded-lg space-y-4 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white">
              {editingId ? "Edit Milestone" : "Register Milestone"}
            </h2>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-400">Role Title *</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400">Organization / Project *</label>
              <input
                type="text"
                required
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-400">Period Display</label>
              <input
                type="text"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="2024 — Present"
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400">Badge Identifier</label>
              <input
                type="text"
                value={formData.badge || ""}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="Active Command"
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isCurrent}
                  onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-red-600 focus:ring-red-500"
                />
                <span>Active Ongoing Role</span>
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400">Description Narrative</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-400">Responsibilities (One per line)</label>
              <textarea
                rows={3}
                value={respInput}
                onChange={(e) => setRespInput(e.target.value)}
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400">Technologies (Comma-separated)</label>
              <textarea
                rows={3}
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-semibold"
            >
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="grid gap-4">
        {list.map((exp) => (
          <div
            key={exp.id}
            className="p-5 bg-[#11141c] border border-slate-800 rounded-lg flex items-start justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">{exp.role}</h3>
                <span className="text-red-400 text-xs font-mono">@{exp.organization}</span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-1">
                {exp.period} • {exp.technologies.join(", ")}
              </div>
              <p className="text-xs text-slate-300 mt-2">{exp.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => startEdit(exp)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
