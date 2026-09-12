"use client";

import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { Project } from "@/types/portfolio";
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  Star,
  ExternalLink,
  Github,
  Check,
  X,
  AlertCircle,
  FolderGit2,
} from "lucide-react";

export default function AdminProjectsPage() {
  const { projects, addProject, updateProject, deleteProject } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const emptyProject: Omit<Project, "id"> = {
    slug: "",
    title: "",
    subtitle: "",
    category: "web",
    categoryLabel: "Web Platform",
    shortDescription: "",
    fullDescription: "",
    problem: "",
    solution: "",
    role: "Lead Frontend Developer",
    status: "Live",
    heroImage: "/images/background_ref.png",
    gallery: ["/images/background_ref.png"],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    liveUrl: "",
    secondaryLiveUrl: "",
    secondaryLiveLabel: "",
    githubUrl: "",
    featured: false,
    displayOrder: projects.length + 1,
    year: "2026",
    keyFeatures: ["High-performance responsive architecture"],
    challenges: "",
    outcome: "",
  };

  const [formData, setFormData] = useState<Omit<Project, "id">>(emptyProject);
  const [techInput, setTechInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");

  const startCreate = () => {
    setFormData(emptyProject);
    setEditingId(null);
    setTechInput(emptyProject.technologies.join(", "));
    setFeatureInput(emptyProject.keyFeatures?.join("\n") || "");
    setIsEditing(true);
  };

  const startEdit = (proj: Project) => {
    const { id, ...rest } = proj;
    setEditingId(id);
    setFormData(rest);
    setTechInput(proj.technologies.join(", "));
    setFeatureInput(proj.keyFeatures?.join("\n") || "");
    setIsEditing(true);
  };

  const handleDuplicate = async (proj: Project) => {
    const { id, ...rest } = proj;
    const duplicated: Omit<Project, "id"> = {
      ...rest,
      slug: `${rest.slug}-copy-${Date.now().toString().slice(-4)}`,
      title: `${rest.title} (Copy)`,
      displayOrder: projects.length + 1,
    };
    await addProject(duplicated);
    setStatusMessage("Project duplicated successfully!");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete initiative "${title}"? This cannot be undone.`)) {
      await deleteProject(id);
      setStatusMessage("Project deleted.");
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const technologies = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const keyFeatures = featureInput
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const payload = {
      ...formData,
      slug,
      technologies,
      keyFeatures,
    };

    if (editingId) {
      await updateProject(editingId, payload);
      setStatusMessage("Project updated successfully!");
    } else {
      await addProject(payload);
      setStatusMessage("New project created successfully!");
    }

    setIsEditing(false);
    setEditingId(null);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Projects Management (CRUD)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Create, modify, reorder, and configure cinematic case studies.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={startCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-semibold shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Project</span>
          </button>
        )}
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded text-xs font-mono text-emerald-400 flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Editing Form Modal / Drawer */}
      {isEditing ? (
        <form onSubmit={handleSubmit} className="p-6 bg-[#11141c] border border-slate-800 rounded-lg space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white">
              {editingId ? "Edit Project Specifications" : "Register New Project"}
            </h2>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="text-slate-400">Project Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400">URL Slug *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. edu51portal"
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400">Category *</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as "web" | "mobile" | "ai" | "design",
                    categoryLabel: e.target.value.toUpperCase() + " INITIATIVE",
                  })
                }
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
              >
                <option value="web">Web Application</option>
                <option value="mobile">Mobile Application</option>
                <option value="ai">AI Platform</option>
                <option value="design">UI/UX Design</option>
                <option value="game">Computer Graphics / Game</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="text-slate-400">Subtitle</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400">My Role</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400">Year / Timeline</label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            <label className="text-slate-400">Short Card Description *</label>
            <textarea
              rows={2}
              required
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            <label className="text-slate-400">Full Case Study Narrative</label>
            <textarea
              rows={4}
              value={formData.fullDescription}
              onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
              className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="text-slate-400">Problem Statement</label>
              <textarea
                rows={2}
                value={formData.problem || ""}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400">Architected Solution</label>
              <textarea
                rows={2}
                value={formData.solution || ""}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="text-slate-400">Hero Thumbnail Image URL *</label>
              <input
                type="text"
                required
                value={formData.heroImage}
                onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400">Primary Live URL</label>
              <input
                type="text"
                value={formData.liveUrl || ""}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400">GitHub Repository URL</label>
              <input
                type="text"
                value={formData.githubUrl || ""}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="text-slate-400">Technologies (Comma-separated)</label>
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="React, Next.js, TypeScript, Tailwind"
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400">Key Features (One per line)</label>
              <textarea
                rows={2}
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="Real-time class routine viewer&#10;Integrated curriculum PDF search"
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded bg-slate-900 border-slate-700 text-red-600 focus:ring-red-500"
              />
              <span>Mark as Featured Project</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-semibold shadow"
            >
              Save Project Changes
            </button>
          </div>
        </form>
      ) : null}

      {/* Projects List Grid */}
      <div className="grid gap-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 bg-[#11141c] border border-slate-800 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 bg-black rounded overflow-hidden relative shrink-0 border border-slate-800">
                <img
                  src={proj.heroImage}
                  alt={proj.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{proj.title}</h3>
                  {proj.featured && (
                    <span className="px-1.5 py-0.5 bg-red-600/20 text-red-400 border border-red-500/40 text-[10px] font-mono rounded">
                      Featured
                    </span>
                  )}
                  <span className="text-slate-400 text-xs font-mono">({proj.year})</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  {proj.categoryLabel} • {proj.technologies.slice(0, 3).join(", ")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => startEdit(proj)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded transition-colors"
                title="Edit Project"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDuplicate(proj)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded transition-colors"
                title="Duplicate Project"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(proj.id, proj.title)}
                className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 rounded transition-colors"
                title="Delete Project"
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
