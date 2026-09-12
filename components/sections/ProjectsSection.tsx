"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useData } from "@/context/DataContext";
import { Project } from "@/types/portfolio";
import HudCard from "../ui/HudCard";
import HudBadge from "../ui/HudBadge";
import HudButton from "../ui/HudButton";
import ProjectModal from "../projects/ProjectModal";
import { ExternalLink, Github, Eye, ArrowUpRight, FolderGit2 } from "lucide-react";
import { matchProjectCategory } from "@/lib/projectUtils";

export default function ProjectsSection() {
  const { projects } = useData();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = [
    { id: "all", label: "ALL INITIATIVES" },
    { id: "web", label: "WEB PLATFORMS" },
    { id: "mobile", label: "MOBILE APPS" },
    { id: "ai", label: "AI & CREATIVE SUITE" },
    { id: "game", label: "GRAPHICS & GAMES" },
  ];

  const filteredProjects = projects.filter((p) =>
    matchProjectCategory(p, activeCategory)
  );

  const handlePrev = () => {
    if (!selectedProject) return;
    const currentIndex = projects.findIndex((p) => p.id === selectedProject.id);
    const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
    setSelectedProject(projects[prevIndex]);
  };

  const handleNext = () => {
    if (!selectedProject) return;
    const currentIndex = projects.findIndex((p) => p.id === selectedProject.id);
    const nextIndex = (currentIndex + 1) % projects.length;
    setSelectedProject(projects[nextIndex]);
  };

  return (
    <section id="work" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-[1px] bg-accent" />
            <HudBadge variant="accent">PORTFOLIO // INDEX</HudBadge>
            <span className="w-6 h-[1px] bg-accent" />
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground uppercase">
            SELECTED WORK <span className="text-accent">//</span> CASE STUDIES
          </h2>
          <p className="font-mono text-xs sm:text-sm text-muted tracking-widest uppercase mt-2 max-w-xl">
            DYNAMIC PRODUCTION REPOSITORIES, CLIENT SYSTEMS & EMERGING PLATFORMS
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 font-mono text-xs uppercase tracking-wider rounded-sm border transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-accent text-white border-accent shadow-hud-glow"
                    : "bg-surface border-hud text-muted hover:text-foreground hover:border-white/20"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="relative group bg-surface/90 border border-hud hover:border-accent rounded-sm overflow-hidden flex flex-col justify-between transition-all duration-500 hover:shadow-hud-card hover:-translate-y-1 hud-cut-corner-tl"
            >
              {/* Top Image Container */}
              <div className="relative w-full h-56 bg-black overflow-hidden cursor-pointer" onClick={() => setSelectedProject(project)}>
                <Image
                  src={project.heroImage}
                  alt={project.title}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Red Light Sweep Line on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Status Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-background/80 backdrop-blur-md border border-hud text-[10px] font-mono text-accent font-semibold uppercase">
                    {project.status}
                  </span>
                  {project.featured && (
                    <span className="px-2 py-0.5 bg-accent text-white text-[10px] font-mono font-bold uppercase shadow-hud-glow">
                      FEATURED
                    </span>
                  )}
                </div>

                {/* Year Label */}
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-background/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-muted">
                  {project.year}
                </div>

                {/* Hover Quick Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <span className="px-4 py-2 bg-accent/90 text-white font-mono text-xs tracking-widest uppercase flex items-center gap-2 shadow-hud-glow rounded-sm">
                    <Eye className="w-3.5 h-3.5" />
                    EXPLORE CASE STUDY
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div>
                  <div className="font-mono text-[11px] text-accent tracking-wider uppercase mb-1">
                    {project.categoryLabel}
                  </div>
                  <h3
                    onClick={() => setSelectedProject(project)}
                    className="font-display font-bold text-xl text-foreground group-hover:text-accent transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span>{project.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h3>
                  <p className="text-xs sm:text-sm text-muted mt-2 line-clamp-2 leading-relaxed">
                    {project.shortDescription}
                  </p>
                </div>

                {/* Tech Chips */}
                <div className="pt-3 border-t border-white/5">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.slice(0, 4).map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 bg-background border border-white/10 text-[10px] font-mono text-muted rounded-sm"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono text-muted">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Actions Links */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="font-mono text-xs text-accent hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors"
                    >
                      <span>DETAILS</span>
                      <span className="text-xs">&gt;&gt;</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-surface border border-hud hover:border-accent text-muted hover:text-accent rounded-sm transition-all"
                          title="Open Live Deployment"
                          aria-label="Open live link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-surface border border-hud hover:border-accent text-muted hover:text-accent rounded-sm transition-all"
                          title="View GitHub Repository"
                          aria-label="View github repository"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Corner Brackets */}
              <span className="bracket-tl opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="bracket-br opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </section>
  );
}
