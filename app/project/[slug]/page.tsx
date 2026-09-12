"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import HudButton from "@/components/ui/HudButton";
import HudBadge from "@/components/ui/HudBadge";
import HudCard from "@/components/ui/HudCard";
import TopNav from "@/components/navigation/TopNav";
import Footer from "@/components/sections/Footer";
import { getProjectThumbnail } from "@/lib/projectUtils";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Award,
  Layers,
} from "lucide-react";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { projects } = useData();

  const currentIndex = projects.findIndex((p) => p.slug === slug || p.id === slug);
  const project = projects[currentIndex !== -1 ? currentIndex : 0];

  const prevProject =
    currentIndex > 0
      ? projects[currentIndex - 1]
      : projects[projects.length - 1];

  const nextProject =
    currentIndex < projects.length - 1
      ? projects[currentIndex + 1]
      : projects[0];

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground font-mono">
        <div className="text-center space-y-4">
          <h1 className="text-4xl text-accent font-bold">PROJECT NOT FOUND</h1>
          <Link href="/#work" className="text-muted hover:text-accent underline">
            Return to Command Center
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Header */}
      <TopNav
        activeSection="work"
        onMobileMenuToggle={() => router.push("/#work")}
        isMobileMenuOpen={false}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-32 pb-16 sm:pb-24 space-y-8 sm:space-y-12">
        {/* Back Link */}
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-accent uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO SELECTED WORK</span>
        </Link>

        {/* Header Block */}
        <div className="border-b border-hud pb-6 sm:pb-8 space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <HudBadge variant="accent">{project.year}</HudBadge>
            <span className="font-mono text-xs text-accent uppercase font-bold">
              // {project.categoryLabel}
            </span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground uppercase tracking-tight">
            {project.title}
          </h1>

          <p className="font-mono text-base sm:text-lg text-accent tracking-wide uppercase">
            {project.subtitle}
          </p>

          {/* Quick Details Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 mt-6 bg-surface/80 p-4 border border-white/5 rounded-sm font-mono text-xs">
            <div>
              <span className="text-muted block text-[10px] uppercase">My Role</span>
              <span className="text-foreground font-semibold">{project.role}</span>
            </div>
            <div>
              <span className="text-muted block text-[10px] uppercase">Status</span>
              <span className="text-emerald-400 font-semibold">{project.status}</span>
            </div>
            <div>
              <span className="text-muted block text-[10px] uppercase">Category</span>
              <span className="text-foreground">{project.category}</span>
            </div>
            <div>
              <span className="text-muted block text-[10px] uppercase">Timeline</span>
              <span className="text-foreground">{project.year}</span>
            </div>
          </div>
        </div>

        {/* Hero Banner Visual */}
        <div className="relative w-full h-64 sm:h-[450px] rounded-sm overflow-hidden border border-hud bg-black shadow-hud-card">
          <Image
            src={getProjectThumbnail(project)}
            alt={project.title}
            fill
            priority
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />

          {/* External Links Floating Actions (Desktop) */}
          <div className="hidden sm:flex absolute bottom-6 right-6 flex-wrap gap-3">
            {project.liveUrl && (
              <HudButton
                href={project.liveUrl}
                variant="primary"
                size="md"
                icon={<ExternalLink className="w-4 h-4" />}
                target="_blank"
                rel="noopener noreferrer"
              >
                LIVE LAUNCH
              </HudButton>
            )}
            {project.secondaryLiveUrl && (
              <HudButton
                href={project.secondaryLiveUrl}
                variant="secondary"
                size="md"
                icon={<ExternalLink className="w-4 h-4" />}
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
                size="md"
                icon={<Github className="w-4 h-4" />}
                target="_blank"
                rel="noopener noreferrer"
              >
                GITHUB REPO
              </HudButton>
            )}
          </div>
        </div>

        {/* Mobile Quick Action Buttons Row */}
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
              LIVE LAUNCH
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

        {/* Overview */}
        <HudCard chamfer="tl" className="space-y-4">
          <h2 className="font-mono text-xs font-bold text-accent uppercase tracking-widest">
            // 01. ARCHITECTURAL OVERVIEW
          </h2>
          <p className="text-foreground/90 text-base sm:text-lg leading-relaxed">
            {project.fullDescription || project.shortDescription}
          </p>
        </HudCard>

        {/* Problem & Solution */}
        {(project.problem || project.solution) && (
          <div className="grid md:grid-cols-2 gap-8">
            {project.problem && (
              <HudCard chamfer="tl" className="space-y-3 bg-red-950/15 border-red-500/30">
                <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase">
                  <AlertTriangle className="w-4 h-4" />
                  <span>THE PROBLEM SPACE</span>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  {project.problem}
                </p>
              </HudCard>
            )}

            {project.solution && (
              <HudCard chamfer="br" className="space-y-3 bg-emerald-950/15 border-emerald-500/30">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>THE ARCHITECTED SOLUTION</span>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  {project.solution}
                </p>
              </HudCard>
            )}
          </div>
        )}

        {/* Key Features */}
        {project.keyFeatures && (
          <HudCard chamfer="both" className="space-y-4">
            <h2 className="font-mono text-xs font-bold text-accent uppercase tracking-widest">
              // 02. KEY CAPABILITIES & FEATURES
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {project.keyFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-background border border-white/5 rounded-sm flex items-start gap-2.5 font-mono text-xs"
                >
                  <span className="text-accent">&gt;</span>
                  <span className="text-foreground/90">{feat}</span>
                </div>
              ))}
            </div>
          </HudCard>
        )}

        {/* Technologies Deployed */}
        <HudCard chamfer="none" className="space-y-4">
          <h2 className="font-mono text-xs font-bold text-accent uppercase tracking-widest">
            // 03. TECHNOLOGIES & TOOLS DEPLOYED
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 bg-surface-elevated border border-hud text-xs font-mono text-foreground rounded-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </HudCard>

        {/* Outcome & Impact */}
        {project.outcome && (
          <div className="p-6 bg-accent/10 border-2 border-accent/40 rounded-sm flex items-start gap-4 shadow-hud-glow">
            <Award className="w-6 h-6 text-accent shrink-0 mt-1" />
            <div className="space-y-1">
              <h3 className="font-mono text-xs text-accent font-bold uppercase tracking-wider">
                PROJECT OUTCOME & METRICS
              </h3>
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                {project.outcome}
              </p>
            </div>
          </div>
        )}

        {/* Previous / Next Case Study Navigation */}
        <div className="pt-8 border-t border-hud flex items-center justify-between font-mono text-xs">
          <Link
            href={`/project/${prevProject.slug}`}
            className="flex items-center gap-2 text-muted hover:text-accent transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <div className="text-left">
              <div className="text-[10px] text-muted">PREVIOUS INITIATIVE</div>
              <div className="text-foreground font-semibold uppercase">{prevProject.title}</div>
            </div>
          </Link>

          <Link
            href={`/project/${nextProject.slug}`}
            className="flex items-center gap-2 text-muted hover:text-accent transition-colors group text-right"
          >
            <div className="text-right">
              <div className="text-[10px] text-muted">NEXT INITIATIVE</div>
              <div className="text-foreground font-semibold uppercase">{nextProject.title}</div>
            </div>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
