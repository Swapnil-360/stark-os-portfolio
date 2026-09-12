"use client";

import React from "react";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import { useTheme } from "@/context/ThemeContext";
import {
  FolderGit2,
  Video,
  Eye,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Plus,
  Edit2,
  ExternalLink,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { projects, hero, experiences, services } = useData();
  const { currentTheme } = useTheme();

  const featuredCount = projects.filter((p) => p.featured).length;

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Command Center Overview
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time management for Md. Miftahur Rahman Swapnil&apos;s portfolio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/swapnildev/projects"
            className="flex items-center gap-2 px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-semibold shadow transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </Link>
          <Link
            href="/swapnildev/hero"
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold transition-all border border-slate-700"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Tune Hero Video</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#11141c] border border-slate-800 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Total Projects</span>
            <FolderGit2 className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-white">{projects.length}</div>
          <div className="text-xs text-slate-400 font-mono">
            {featuredCount} flagged as featured
          </div>
        </div>

        <div className="p-5 bg-[#11141c] border border-slate-800 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Active Theme</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white">{currentTheme.name}</div>
          <div className="text-xs text-slate-400 font-mono">
            Accent: {currentTheme.accent}
          </div>
        </div>

        <div className="p-5 bg-[#11141c] border border-slate-800 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Video Status</span>
            <Video className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white">
            {hero.videoEnabled ? "Enabled" : "Disabled"}
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Speed: {hero.videoSpeed}x // Opacity: {Math.round(hero.overlayOpacity * 100)}%
          </div>
        </div>

        <div className="p-5 bg-[#11141c] border border-slate-800 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Services & Exp</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white">
            {services.length + experiences.length}
          </div>
          <div className="text-xs text-slate-400 font-mono">
            {services.length} services • {experiences.length} timeline milestones
          </div>
        </div>
      </div>

      {/* Projects Overview Table */}
      <div className="bg-[#11141c] border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Active Projects Showcase</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Reorder, edit, or adjust live status directly.
            </p>
          </div>
          <Link
            href="/swapnildev/projects"
            className="text-xs text-red-400 hover:text-red-300 font-mono flex items-center gap-1"
          >
            <span>Manage All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0a0c10] text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Year</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-sans font-medium text-white">
                    <div className="font-semibold">{proj.title}</div>
                    <div className="text-slate-400 text-[11px] font-mono">{proj.slug}</div>
                  </td>
                  <td className="p-4 text-slate-300 uppercase">{proj.category}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-emerald-950/40 border border-emerald-800 text-emerald-400 rounded text-[10px]">
                      {proj.featured ? "Featured" : "Active"}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{proj.displayOrder ?? "—"}</td>
                  <td className="p-4">
                    {proj.featured ? (
                      <span className="text-red-400 font-bold">YES</span>
                    ) : (
                      <span className="text-slate-600">NO</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/project/${proj.slug}`}
                        target="_blank"
                        className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
                        title="View Public Case Study"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href="/swapnildev/projects"
                        className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
