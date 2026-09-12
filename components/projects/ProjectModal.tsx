"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Project } from "@/types/portfolio";
import { getProjectThumbnail } from "@/lib/projectUtils";
import HudButton from "../ui/HudButton";
import HudBadge from "../ui/HudBadge";
import {
  X,
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Award,
} from "lucide-react";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function ProjectModal({
  project,
  onClose,
  onPrev,
  onNext,
}: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-background/90 backdrop-blur-xl overflow-y-auto">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-surface-elevated border-2 border-hud shadow-hud-card hud-cut-corner-both my-auto max-h-[92vh] flex flex-col overflow-hidden">
        {/* Corner Precision Brackets */}
        <span className="bracket-tl scale-150" />
        <span className="bracket-tr scale-150" />
        <span className="bracket-bl scale-150" />
        <span className="bracket-br scale-150" />

        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-hud bg-surface/90">
          <div className="flex items-center gap-2 sm:gap-3">
            <HudBadge variant="accent">
              CASE STUDY // {project.year}
            </HudBadge>
            <span className="font-mono text-xs text-muted uppercase hidden sm:inline">
              CAT: {project.categoryLabel}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onPrev}
              className="p-1.5 bg-surface border border-hud hover:border-accent text-muted hover:text-foreground rounded-sm transition-all"
              title="Previous Project"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onNext}
              className="p-1.5 bg-surface border border-hud hover:border-accent text-muted hover:text-foreground rounded-sm transition-all"
              title="Next Project"
              aria-label="Next project"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 bg-surface border border-hud hover:border-accent text-accent hover:text-white rounded-sm transition-all ml-1 sm:ml-2"
              title="Close Modal"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8 custom-scrollbar">
          {/* Hero Banner Visual */}
          <div className="relative w-full h-48 sm:h-80 md:h-96 rounded-sm overflow-hidden border border-hud bg-black">
            <Image
              src={getProjectThumbnail(project)}
              alt={project.title}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 850px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-elevated via-transparent to-transparent pointer-events-none" />

            {/* Quick Action Overlay (hidden on small mobile to avoid blocking banner, shown below) */}
            <div className="hidden sm:flex absolute bottom-4 right-4 flex-wrap gap-2 sm:gap-3">
              {project.liveUrl && (
                <HudButton
                  href={project.liveUrl}
                  variant="primary"
                  size="sm"
                  icon={<ExternalLink className="w-3.5 h-3.5" />}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LIVE SYSTEM
                </HudButton>
              )}
              {project.secondaryLiveUrl && (
                <HudButton
                  href={project.secondaryLiveUrl}
                  variant="secondary"
                  size="sm"
                  icon={<ExternalLink className="w-3.5 h-3.5" />}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.secondaryLiveLabel || "SECONDARY DEPLOY"}
                </HudButton>
              )}
              {project.githubUrl && (
                <HudButton
                  href={project.githubUrl}
                  variant="secondary"
                  size="sm"
                  icon={<Github className="w-3.5 h-3.5" />}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SOURCE CODE
                </HudButton>
              )}
            </div>
          </div>

          {/* Mobile Quick Action Buttons Row (visible on mobile phones below banner) */}
          <div className="flex sm:hidden flex-wrap gap-2">
            {project.liveUrl && (
              <HudButton
                href={project.liveUrl}
                variant="primary"
                size="sm"
                icon={<ExternalLink className="w-3.5 h-3.5" />}
                target="_blank"
                rel="noopener noreferrer"
              >
                LIVE SYSTEM
              </HudButton>
            )}
            {project.secondaryLiveUrl && (
              <HudButton
                href={project.secondaryLiveUrl}
                variant="secondary"
                size="sm"
                icon={<ExternalLink className="w-3.5 h-3.5" />}
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.secondaryLiveLabel || "SECONDARY"}
              </HudButton>
            )}
            {project.githubUrl && (
              <HudButton
                href={project.githubUrl}
                variant="secondary"
                size="sm"
                icon={<Github className="w-3.5 h-3.5" />}
                target="_blank"
                rel="noopener noreferrer"
              >
                GITHUB
              </HudButton>
            )}
          </div>

          {/* Project Title & Metadata Header */}
          <div className="border-b border-hud/60 pb-5 sm:pb-6">
            <h2 className="font-display font-black text-2xl sm:text-4xl text-foreground uppercase tracking-tight">
              {project.title}
            </h2>
            <p className="font-mono text-xs sm:text-sm text-accent tracking-wider uppercase mt-1">
              {project.subtitle}
            </p>

            {/* Role & Status Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6 p-3 sm:p-4 bg-surface border border-white/5 font-mono text-xs rounded-sm">
              <div>
                <span className="text-muted block text-[10px] uppercase">Role</span>
                <span className="text-foreground font-semibold text-xs truncate block">{project.role}</span>
              </div>
              <div>
                <span className="text-muted block text-[10px] uppercase">Status</span>
                <span className="text-emerald-400 font-semibold text-xs">{project.status}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-muted block text-[10px] uppercase">Timeline</span>
                <span className="text-foreground text-xs">{project.year}</span>
              </div>
            </div>
          </div>

          {/* Overview & Problem / Solution Narrative */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs font-bold text-accent uppercase tracking-widest">
              // ARCHITECTURAL OVERVIEW
            </h3>
            <p className="text-foreground/90 text-sm sm:text-base leading-relaxed">
              {project.fullDescription || project.shortDescription}
            </p>
          </div>

          {(project.problem || project.solution) && (
            <div className="grid sm:grid-cols-2 gap-6">
              {project.problem && (
                <div className="p-4 bg-surface border border-red-500/20 rounded-sm space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-red-400 uppercase font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>THE CHALLENGE</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    {project.problem}
                  </p>
                </div>
              )}
              {project.solution && (
                <div className="p-4 bg-surface border border-emerald-500/20 rounded-sm space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 uppercase font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ENGINEERED SOLUTION</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Key Features List */}
          {project.keyFeatures && project.keyFeatures.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-mono text-xs font-bold text-accent uppercase tracking-widest">
                // KEY CAPABILITIES & FEATURES
              </h3>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {project.keyFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-surface border border-white/5 rounded-sm flex items-start gap-2.5 font-mono text-xs text-foreground/90"
                  >
                    <span className="text-accent mt-0.5">&gt;</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technologies Chips */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs font-bold text-accent uppercase tracking-widest">
              // TECHNOLOGY NODES DEPLOYED
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-surface border border-hud text-xs font-mono text-foreground rounded-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Outcome */}
          {project.outcome && (
            <div className="p-4 bg-accent/5 border border-accent/30 rounded-sm flex items-start gap-3">
              <Award className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <div className="font-mono text-xs text-accent uppercase font-bold">
                  PROJECT IMPACT & OUTCOME
                </div>
                <p className="text-xs sm:text-sm text-foreground/90 mt-1 leading-relaxed">
                  {project.outcome}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
