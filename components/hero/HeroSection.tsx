"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useData } from "@/context/DataContext";
import HudButton from "../ui/HudButton";
import HudBadge from "../ui/HudBadge";
import { ArrowDownRight, Mail, ChevronDown, Terminal, MapPin, Code2 } from "lucide-react";

export default function HeroSection() {
  const { hero, settings } = useData();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (videoRef.current && hero.videoEnabled) {
      videoRef.current.playbackRate = hero.videoSpeed || 1.0;
    }
  }, [hero.videoSpeed, hero.videoEnabled]);

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20 pb-16 lg:py-0"
    >
      {/* ========================================================
          LAYER 1: CINEMATIC BACKGROUND VIDEO / POSTER FALLBACK
      ======================================================== */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-background">
        {hero.videoEnabled && !videoError ? (
          <>
            {/* Desktop continuous cinematic video (16:9) */}
            <video
              ref={videoRef}
              src={hero.videoUrl || "/videos/bg_video.mp4"}
              poster={hero.posterUrl || "/images/bg_static_desktop.jpg"}
              autoPlay
              muted
              loop
              playsInline
              webkit-playsinline="true"
              onLoadedData={() => setVideoLoaded(true)}
              onError={() => setVideoError(true)}
              className={`hidden sm:block w-full h-full object-cover transition-opacity duration-1000 scale-105 ${
                videoLoaded ? "opacity-100" : "opacity-0"
              }`}
              style={{
                filter: `blur(${hero.blurAmount || 0}px)`,
              }}
            />

            {/* Mobile continuous cinematic video (9:16 vertical ratio) */}
            <video
              src={hero.mobileVideoUrl || hero.videoUrl || "/videos/bg_video.mp4"}
              poster={hero.mobileFallbackUrl || hero.staticMobileBg || "/images/bg_static_mobile.jpg"}
              autoPlay
              muted
              loop
              playsInline
              webkit-playsinline="true"
              onLoadedData={() => setVideoLoaded(true)}
              className={`sm:hidden w-full h-full object-cover transition-opacity duration-1000 scale-105 ${
                videoLoaded ? "opacity-100" : "opacity-0"
              }`}
              style={{
                filter: `blur(${hero.blurAmount || 0}px)`,
              }}
            />
          </>
        ) : null}

        {/* Poster Fallback Image (always behind or visible when video is disabled/loading) */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            videoLoaded && hero.videoEnabled && !videoError ? "opacity-0" : "opacity-100"
          }`}
        >
          <Image
            src={hero.posterUrl || "/images/background_ref.png"}
            alt="Cinematic Background Fallback"
            fill
            priority
            className="object-cover object-center scale-105"
            sizes="100vw"
          />
        </div>

        {/* ========================================================
            LAYER 2: DARK CINEMATIC GRADIENT & VIGNETTE
        ======================================================== */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/40"
          style={{ opacity: hero.overlayOpacity ?? 0.65 }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-background/40 to-background" />

        {/* ========================================================
            LAYER 3: RED ATMOSPHERIC LIGHTING & GLOW
        ======================================================== */}
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[120px] pointer-events-none" />

        {/* Background Grid Pattern */}
        <div className="absolute inset-0 hud-grid-pattern opacity-40 pointer-events-none" />
      </div>

      {/* ========================================================
          LAYER 5 & 6: HUD FRAME & MAIN COMPOSITION
      ======================================================== */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-12">
        {/* Outer Sci-Fi Command HUD Frame */}
        <div className="relative border border-hud bg-surface-glass backdrop-blur-md p-6 sm:p-8 lg:p-12 hud-cut-corner-both hud-scanline shadow-hud-card">
          {/* Corner Precision Brackets */}
          <span className="bracket-tl scale-150" />
          <span className="bracket-tr scale-150" />
          <span className="bracket-bl scale-150" />
          <span className="bracket-br scale-150" />

          {/* Top Frame Status Bar */}
          <div className="flex items-center justify-between border-b border-hud pb-4 mb-8">
            <div className="flex items-center gap-3">
              <HudBadge variant="accent" pulse>
                {hero.statusBadge || "SYS.ONLINE // ACTIVE"}
              </HudBadge>
              <span className="hidden sm:inline font-mono text-[10px] text-muted tracking-widest uppercase">
                {settings.coordinates}
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-muted tracking-widest">
              <span className="text-accent">//</span>
              <span className="hidden md:inline uppercase">CODE / CREATE / INNOVATE</span>
              <span className="text-accent">[ + ]</span>
            </div>
          </div>

          {/* Main Grid: Left Typography + Right Cinematic Portrait */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT COLUMN: Typography & Actions (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              {/* Category Micro-Label */}
              <div className="flex items-center gap-2">
                <span className="w-8 h-[2px] bg-accent shadow-hud-glow" />
                <span className="font-mono text-xs text-accent tracking-widest uppercase font-semibold">
                  [ {hero.label || "CREATIVE PROFESSIONAL"} ]
                </span>
              </div>

              {/* Large Name with Sci-Fi Accent */}
              <div>
                <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-none text-foreground uppercase">
                  {hero.name || "SWAPNIL"}
                  <span className="text-accent inline-block animate-pulse ml-1">_</span>
                </h1>
                <div className="font-mono text-sm sm:text-base lg:text-lg text-accent tracking-widest uppercase font-bold mt-2 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-accent" />
                  <span>{hero.subtitle || "DEVELOPER / DESIGNER / CREATOR"}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted text-base sm:text-lg leading-relaxed max-w-xl font-normal">
                {hero.description}
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <HudButton
                  href={hero.ctaPrimaryLink || "#projects"}
                  variant="primary"
                  size="lg"
                  icon={<ArrowDownRight className="w-4 h-4" />}
                >
                  {hero.ctaPrimaryText || "VIEW WORK"}
                </HudButton>

                <HudButton
                  href={hero.ctaSecondaryLink || "#contact"}
                  variant="secondary"
                  size="lg"
                  icon={<Mail className="w-4 h-4" />}
                >
                  {hero.ctaSecondaryText || "CONTACT ME"}
                </HudButton>
              </div>

              {/* Telemetry Status Indicator */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 text-xs font-mono text-muted border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  <span>{hero.locationLabel || "DHAKA, BANGLADESH"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-accent" />
                  <span>BSc CSE, BUBT</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-accent font-semibold">
                  <span>///</span>
                  <span>READY FOR DEPLOYMENT</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Cinematic Portrait Integration (5 Cols) */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Outer Glowing Energy Ring Reticle */}
              <div className="relative w-72 sm:w-84 md:w-96 lg:w-full max-w-md aspect-square flex items-center justify-center">
                {/* Rotating HUD Reticle Ring 1 */}
                <div className="absolute inset-0 rounded-full border border-dashed border-accent/40 animate-reticle-spin pointer-events-none" />

                {/* Rotating HUD Reticle Ring 2 (Counter) */}
                <div className="absolute inset-4 rounded-full border border-white/10 border-t-accent/60 animate-reverse-spin pointer-events-none" />

                {/* Ambient Red Glow Halo */}
                <div className="absolute inset-8 rounded-full bg-accent/20 blur-2xl pointer-events-none animate-pulse-glow" />

                {/* Main Cinematic Subject Container */}
                <div className="relative w-[85%] h-[85%] rounded-full overflow-hidden border-2 border-hud-bright shadow-hud-glow bg-surface">
                  <Image
                    src={hero.portraitUrl || "/images/background_ref.png"}
                    alt="Md. Miftahur Rahman Swapnil"
                    fill
                    priority
                    className="object-cover object-top hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 450px"
                  />

                  {/* Gradient Light Blending on Subject */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/15 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Micro HUD Coordinate Tags on Subject Frame */}
                <div className="absolute top-2 right-2 bg-background/90 px-2 py-0.5 border border-hud text-[9px] font-mono text-accent">
                  TARGET: SWAPNIL
                </div>
                <div className="absolute bottom-2 left-2 bg-background/90 px-2 py-0.5 border border-hud text-[9px] font-mono text-muted">
                  AUTH // VERIFIED
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="mt-8 pt-4 border-t border-hud flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-muted">
            <div className="flex items-center gap-3">
              <span className="text-accent font-bold">&gt;&gt;</span>
              <span>TURNING IDEAS INTO HIGH-PERFORMANCE PRODUCTS</span>
            </div>

            {/* Scroll Down Prompt Button */}
            <a
              href="#profile"
              className="flex items-center gap-2 text-accent hover:text-white transition-colors cursor-pointer group"
            >
              <span>SCROLL DOWN TO EXPLORE</span>
              <ChevronDown className="w-3.5 h-3.5 animate-bounce group-hover:translate-y-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
