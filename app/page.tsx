"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import { useTheme } from "@/context/ThemeContext";
import { Project } from "@/types/portfolio";
import ProjectModal from "@/components/projects/ProjectModal";
import { CardStack, CardStackItem } from "@/components/ui/card-stack";
import confetti from "canvas-confetti";
import {
  Home,
  User,
  Code2,
  FolderGit2,
  Layers,
  Mail,
  ExternalLink,
  Github,
  Palette,
  Shield,
  Menu,
  X,
  MapPin,
  Send,
  CheckCircle2,
  Cpu,
  ArrowRight,
  Eye,
  Linkedin,
  Video,
  VideoOff,
  Facebook,
  Check,
  LayoutGrid,
  Sparkles,
} from "lucide-react";

type ActiveTab = "home" | "about" | "skills" | "projects" | "experience" | "contact";

// WhatsApp Icon SVG Component
function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  );
}

export default function CleanGlassPortfolio() {
  const { currentTheme, themeId, setTheme, availableThemes } = useTheme();
  const {
    hero,
    projects,
    experiences,
    skills,
    services,
    education,
    settings,
    socialLinks,
  } = useData();

  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectCategory, setProjectCategory] = useState<string>("all");
  const [projectsViewMode, setProjectsViewMode] = useState<"stack" | "grid">("stack");
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [videoActive, setVideoActive] = useState(true);
  const [videoDropdownOpen, setVideoDropdownOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>(
    hero.videoUrl || "/videos/bg_video.mp4"
  );
  const [selectedMobileVideoUrl, setSelectedMobileVideoUrl] = useState<string>(
    hero.mobileVideoUrl || hero.videoUrl || "/videos/bg_video.mp4"
  );
  const [videoCategoryTab, setVideoCategoryTab] = useState<"desktop" | "mobile">("desktop");
  const [marqueeMode, setMarqueeMode] = useState<"tech" | "icons">("tech");

  // Keep selected video synchronized if updated in admin panel
  useEffect(() => {
    if (hero.videoUrl) {
      setSelectedVideoUrl(hero.videoUrl);
    }
  }, [hero.videoUrl]);

  useEffect(() => {
    if (hero.mobileVideoUrl) {
      setSelectedMobileVideoUrl(hero.mobileVideoUrl);
    }
  }, [hero.mobileVideoUrl]);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [contactStatus, setContactStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mobileVideoRef = useRef<HTMLVideoElement | null>(null);

  // Toggle background video on/off (master motion toggle)
  const toggleVideo = () => {
    setVideoActive((prev) => {
      const next = !prev;
      [videoRef.current, mobileVideoRef.current].forEach((v) => {
        if (v) {
          if (next) v.play().catch(() => {});
          else v.pause();
        }
      });
      return next;
    });
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.playbackRate = hero.videoSpeed || 1.0;
    if (videoActive) {
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch(() => {});
      }
    } else {
      video.pause();
    }
  }, [videoActive, hero.videoSpeed, selectedVideoUrl]);

  useEffect(() => {
    const video = mobileVideoRef.current;
    if (!video) return;
    video.muted = true;
    video.playbackRate = hero.videoSpeed || 1.0;
    if (videoActive) {
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch(() => {});
      }
    } else {
      video.pause();
    }
  }, [videoActive, hero.videoSpeed, selectedMobileVideoUrl]);

  // When selected video changes, reload and play
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      if (videoActive) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [selectedVideoUrl]);

  useEffect(() => {
    if (mobileVideoRef.current) {
      mobileVideoRef.current.load();
      if (videoActive) {
        mobileVideoRef.current.play().catch(() => {});
      }
    }
  }, [selectedMobileVideoUrl]);

  const desktopVideoOptions =
    hero.backgroundVideos && hero.backgroundVideos.length > 0
      ? hero.backgroundVideos
      : [
          {
            id: "vid-default",
            name: "Obsidian Cyber Horizon (Default)",
            url: "/videos/bg_video.mp4",
            poster: "/images/bg_static_desktop.jpg",
          },
        ];

  const mobileVideoOptions =
    hero.mobileBackgroundVideos && hero.mobileBackgroundVideos.length > 0
      ? hero.mobileBackgroundVideos
      : [
          {
            id: "vid-mobile-default",
            name: "Cyber Horizon Vertical (Default Mobile)",
            url: hero.mobileVideoUrl || "/videos/bg_video.mp4",
            poster: "/images/bg_static_mobile.jpg",
            deviceType: "mobile" as const,
          },
        ];

  // Filtered projects
  const filteredProjects =
    projectCategory === "all"
      ? projects
      : projects.filter((p) => p.category === projectCategory);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      if (res.ok) {
        setContactStatus("success");
        setContactForm({ name: "", email: "", subject: "", message: "" });
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ["#ff1e38", "#ffffff", "#ff4d61"],
          });
        } catch {}
      } else {
        setContactStatus("error");
      }
    } catch {
      setContactStatus("error");
    }
  };

  // Bottom ticker pills list with brand colors
  const techPills = [
    { name: "Claude AI", color: "#d97706" },
    { name: "ChatGPT", color: "#10b981" },
    { name: "Cursor IDE", color: "#3b82f6" },
    { name: "React.js", color: "#06b6d4" },
    { name: "Next.js", color: "#ffffff" },
    { name: "TypeScript", color: "#3b82f6" },
    { name: "Tailwind CSS", color: "#38bdf8" },
    { name: "Node.js", color: "#22c55e" },
    { name: "PostgreSQL", color: "#60a5fa" },
    { name: "Git & GitHub", color: "#f97316" },
    { name: "Figma", color: "#a855f7" },
    { name: "Adobe Photoshop", color: "#38bdf8" },
    { name: "UI/UX Design", color: "#ec4899" },
    { name: "Supabase", color: "#3ecf8e" },
    { name: "Vercel", color: "#ffffff" },
  ];

  // 250+ App Integration Icons from integration-hero
  const integrationIcons = [
    "https://cdn.21st.dev/assets/mirror/86/8622b1a4306b413670d9d200591dac7a11d02f70dc525683e44ba14b91737a90.png",
    "https://cdn.21st.dev/assets/mirror/8e/8ee5be289b25fe1868edb80dd7ebd3f8de6f9cc581c1324261bc74146a2bd0e8.png",
    "https://cdn.21st.dev/assets/mirror/b6/b6f94ff4cf6d63ecd9945dd0c6fd806c82afad8cb1f4b350cb0ff9297d6fdb74.png",
    "https://cdn.21st.dev/assets/mirror/8e/8ec92b4cf29e37b05768a5b7027ff6da920ebeec32e16b4063f5b70617fc079d.png",
    "https://cdn.21st.dev/assets/mirror/83/8387574f7ebab08465d1419134bbff0e73bc26ca7220b18d16a264d67f996116.png",
    "https://cdn.21st.dev/assets/mirror/61/61243e3e521df8314819e9929dd5d53d53dc3161545b0fc74c27edf96130190d.png",
    "https://cdn.21st.dev/assets/mirror/a1/a1a606bc6e11ae6714100008321081c24019489862df4243fe436a51adff5ab4.png",
    "https://cdn.21st.dev/assets/mirror/9e/9eb6ffcfa297dc25aebd90fd7930e9d4ad724d8cd496d4621df28ddc29631d77.png",
    "https://cdn.21st.dev/assets/mirror/e8/e899b6d586e1dc1058236c2f16969da36e3a7bdf126a51153ed723e710995823.png",
    "https://cdn.21st.dev/assets/mirror/e6/e6a8797615bf186b1e2bbe586dc3bb2a0b13a8924ba1ead2a431bd3e7d95dd70.png",
    "https://cdn.21st.dev/assets/mirror/fb/fbae1b43d23969d7c2078467a5431adc4b6b39d88d88a3710ed9b08c51a9fd3d.png",
    "https://cdn.21st.dev/assets/mirror/03/03b8741ba2f1e519cafd7c185ece02da69086370a576ec27d0d014a5864ede2e.png",
    "https://cdn.21st.dev/assets/mirror/d2/d2e9f9dda468cbbf30b63ec62ed81dfbea099e09552632d4be89570a8486ec50.png",
    "https://cdn.21st.dev/assets/mirror/a7/a7e2f5f2c86fba897e233c7a04830382b81b31603b4d1f05a46fcd5c7e4d45c8.png",
  ];

  return (
    <div className="min-h-[100dvh] sm:h-screen w-full overflow-y-auto sm:overflow-hidden bg-[#04060a] text-foreground relative flex flex-col p-0 m-0 select-none font-sans">
      {/* ========================================================
          BACKGROUND LAYER: DUAL-MODE (CINEMATIC VIDEO / STATIC BG)
      ======================================================== */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Desktop Static Wallpaper (16:9 Landscape - Glowing Arc Portal & Dark Starfield) */}
        <div
          className={`hidden sm:block absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-700 ease-in-out ${
            videoActive ? "opacity-0" : "opacity-100"
          }`}
          style={{
            backgroundImage: `url('${hero.staticDesktopBg || "/images/bg_static_desktop.jpg"}')`,
            filter: (hero.blurAmount || 0) > 0 ? `blur(${hero.blurAmount}px)` : undefined,
            transform: (hero.blurAmount || 0) > 0 ? "scale(1.04)" : undefined,
          }}
        />

        {/* Mobile Static Wallpaper (9:16 Portrait - Centered Cyber Arc & Smooth Gradient Fade) */}
        <div
          className={`sm:hidden absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-700 ease-in-out ${
            videoActive ? "opacity-0" : "opacity-100"
          }`}
          style={{
            backgroundImage: `url('${hero.staticMobileBg || "/images/bg_static_mobile.jpg"}')`,
            filter: (hero.blurAmount || 0) > 0 ? `blur(${hero.blurAmount}px)` : undefined,
            transform: (hero.blurAmount || 0) > 0 ? "scale(1.04)" : undefined,
          }}
        />

        {/* Desktop Continuous Cinematic Video (16:9) */}
        <video
          ref={videoRef}
          src={selectedVideoUrl || hero.videoUrl || "/videos/bg_video.mp4"}
          poster={hero.posterUrl || "/images/bg_static_desktop.jpg"}
          autoPlay
          muted
          loop
          playsInline
          webkit-playsinline="true"
          preload="metadata"
          className={`hidden sm:block w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
            videoActive ? "opacity-100" : "opacity-0"
          }`}
          style={{
            filter: (hero.blurAmount || 0) > 0 ? `blur(${hero.blurAmount}px)` : undefined,
            transform: (hero.blurAmount || 0) > 0 ? "scale(1.04)" : undefined,
          }}
        />

        {/* Mobile-Only Ratio Cinematic Video (9:16 Vertical / Portrait) */}
        <video
          ref={mobileVideoRef}
          src={selectedMobileVideoUrl || hero.mobileVideoUrl || selectedVideoUrl || hero.videoUrl || "/videos/bg_video.mp4"}
          poster={hero.mobileFallbackUrl || hero.staticMobileBg || "/images/bg_static_mobile.jpg"}
          autoPlay
          muted
          loop
          playsInline
          webkit-playsinline="true"
          preload="metadata"
          className={`sm:hidden w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
            videoActive ? "opacity-100" : "opacity-0"
          }`}
          style={{
            filter: (hero.blurAmount || 0) > 0 ? `blur(${hero.blurAmount}px)` : undefined,
            transform: (hero.blurAmount || 0) > 0 ? "scale(1.04)" : undefined,
          }}
        />

        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
      </div>

      {/* ========================================================
          CLEAN GLASS FLOATING HEADER (MATCHING TANJIL.ME)
      ======================================================== */}
      <header className="relative z-40 w-full flex items-center justify-between px-3 sm:px-8 lg:px-12 py-3 sm:py-6 shrink-0">
        {/* Left: Brand Logo */}
        <div
          onClick={() => setActiveTab("home")}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
        >
          <div className="relative h-8 w-8 sm:h-11 sm:w-11 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/images/s_clean.png"
              alt="Swapnil Logo"
              width={44}
              height={38}
              className="object-contain drop-shadow-[0_0_12px_rgba(255,30,56,0.5)]"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-xs sm:text-base tracking-wider text-white group-hover:text-accent transition-colors uppercase leading-none">
              SWAPNIL
            </span>
            <span className="font-mono text-[9px] tracking-widest text-accent uppercase font-bold mt-0.5 hidden sm:inline">
              PORTFOLIO
            </span>
          </div>
        </div>

        {/* Center: Floating Pill Navbar (Visible on tablet/desktop) */}
        <nav className="hidden sm:flex rounded-full border border-white/15 bg-[#0a0f18]/70 backdrop-blur-xl px-2 py-1.5 items-center gap-1 sm:gap-2 shadow-2xl shadow-black/80">
          {[
            { id: "home", label: "Home" },
            { id: "about", label: "About" },
            { id: "skills", label: "Skills" },
            { id: "projects", label: "Projects" },
            { id: "contact", label: "Contact" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`px-3.5 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-accent/20 border border-accent text-white shadow-[0_0_15px_rgba(255,30,56,0.35)] font-semibold"
                    : "text-gray-300 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right Corner: Circular Video Dropdown + Theme Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Circular Video Dropdown Switcher (Toggle Live Motion vs Static + Select Video Stream) */}
          <div className="relative">
            <button
              onClick={() => setVideoDropdownOpen(!videoDropdownOpen)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all shadow-lg cursor-pointer backdrop-blur-md ${
                videoActive
                  ? "border-accent/80 bg-accent/20 text-accent hover:bg-accent hover:text-white"
                  : "border-white/20 bg-black/60 text-gray-400 hover:border-white/40 hover:text-white"
              }`}
              title="Background Video & Static Wallpaper Controller"
              aria-label="Toggle Video Mode and Switch Background"
            >
              {videoActive ? (
                <Video className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              ) : (
                <VideoOff className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              )}
            </button>

            {/* Video Popover Dropdown */}
            {videoDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-24px)] bg-[#0b101b]/95 backdrop-blur-2xl border border-white/15 p-3 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200"
                onMouseLeave={() => setVideoDropdownOpen(false)}
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2.5">
                  <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider font-semibold">
                    Backdrop Control
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/20 text-accent font-bold">
                    {videoActive ? "LIVE MOTION" : "STATIC BG"}
                  </span>
                </div>

                {/* Master Switch: Motion vs Static */}
                <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 mb-3 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">Motion Video</span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {videoActive ? "Playing live video" : "Turned off (Static)"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleVideo}
                    className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                      videoActive
                        ? "bg-accent text-white shadow-[0_0_12px_rgba(255,30,56,0.6)]"
                        : "bg-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {videoActive ? "ON" : "OFF"}
                  </button>
                </div>

                {/* Default Static Wallpaper Selector */}
                <div className="mb-3">
                  <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider px-1 mb-1">
                    Static Wallpaper
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setVideoActive(false);
                      setVideoDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
                      !videoActive
                        ? "bg-accent/25 border border-accent/60 text-white font-semibold shadow-sm"
                        : "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span className="truncate">Cyber Stargate (Static HD)</span>
                    </div>
                    {!videoActive && (
                      <span className="w-2 h-2 rounded-full bg-accent shrink-0 animate-pulse" />
                    )}
                  </button>
                </div>

                {/* Available Video Streams List with Device Tabs */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                      Video Stream Feed
                    </span>
                    <span className="text-[9px] font-mono text-accent font-bold">
                      {videoCategoryTab === "desktop" ? `${desktopVideoOptions.length} Desktop` : `${mobileVideoOptions.length} Mobile`}
                    </span>
                  </div>

                  {/* Device Switcher Tabs */}
                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/60 border border-white/10 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setVideoCategoryTab("desktop")}
                      className={`flex-1 py-1 rounded text-center transition-all ${
                        videoCategoryTab === "desktop"
                          ? "bg-accent text-white font-bold shadow-sm"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Desktop 16:9
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoCategoryTab("mobile")}
                      className={`flex-1 py-1 rounded text-center transition-all ${
                        videoCategoryTab === "mobile"
                          ? "bg-accent text-white font-bold shadow-sm"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Mobile 9:16
                    </button>
                  </div>

                  <div className="max-h-44 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {(videoCategoryTab === "desktop" ? desktopVideoOptions : mobileVideoOptions).map((v) => {
                      const isSelected =
                        videoCategoryTab === "desktop"
                          ? (selectedVideoUrl === v.url || (hero.selectedVideoId === v.id && !selectedVideoUrl))
                          : (selectedMobileVideoUrl === v.url || (hero.selectedMobileVideoId === v.id && !selectedMobileVideoUrl));

                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => {
                            if (videoCategoryTab === "desktop") {
                              setSelectedVideoUrl(v.url);
                            } else {
                              setSelectedMobileVideoUrl(v.url);
                            }
                            setVideoActive(true);
                            setVideoDropdownOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
                            isSelected && videoActive
                              ? "bg-accent/25 border border-accent/60 text-white font-semibold shadow-sm"
                              : "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Video className="w-3.5 h-3.5 text-accent shrink-0" />
                            <span className="truncate">{v.name}</span>
                          </div>
                          {isSelected && videoActive && (
                            <span className="w-2 h-2 rounded-full bg-accent shrink-0 animate-pulse" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Theme Switcher Button */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-black/80 border border-white/15 hover:border-accent text-gray-300 hover:text-accent transition-all flex items-center justify-center backdrop-blur-md cursor-pointer"
              title="Theme Selector"
            >
              <Palette className="w-4 h-4" />
            </button>

            {themeDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 max-w-[calc(100vw-24px)] bg-[#0b101b]/95 backdrop-blur-xl border border-white/15 p-2 rounded-2xl shadow-2xl z-50"
                onMouseLeave={() => setThemeDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-mono text-gray-400 uppercase tracking-wider border-b border-white/10 mb-1">
                  Color Theme
                </div>
                {availableThemes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl font-mono text-xs flex items-center justify-between transition-all cursor-pointer ${
                      themeId === t.id
                        ? "bg-accent/20 text-white font-semibold"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{t.name}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/20"
                      style={{ backgroundColor: t.accent }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-black/80 border border-white/15 hover:border-accent text-gray-300 flex items-center justify-center sm:hidden transition-all backdrop-blur-md cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Floating Bottom Glass Dock (Quick one-thumb navigation) */}
      <div className="fixed bottom-3 inset-x-0 z-50 flex justify-center sm:hidden px-3 pointer-events-none">
        <nav className="pointer-events-auto rounded-full border border-white/20 bg-[#080d16]/95 backdrop-blur-2xl px-2.5 py-1.5 flex items-center gap-1 shadow-[0_8px_32px_rgba(0,0,0,0.95)] max-w-full overflow-x-auto no-scrollbar">
          {[
            { id: "home", label: "Home" },
            { id: "about", label: "About" },
            { id: "skills", label: "Skills" },
            { id: "projects", label: "Projects" },
            { id: "contact", label: "Contact" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-accent text-white shadow-[0_0_12px_rgba(255,30,56,0.5)] font-bold"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Menu Dropdown (Clean backup) */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-4 top-16 z-50 rounded-2xl bg-[#0a0f18]/95 backdrop-blur-2xl border border-white/15 p-4 space-y-2 font-mono text-xs shadow-2xl sm:hidden animate-in fade-in zoom-in-95 duration-200">
          {[
            { id: "home", label: "Home" },
            { id: "about", label: "About" },
            { id: "skills", label: "Skills" },
            { id: "projects", label: "Projects" },
            { id: "contact", label: "Contact" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as ActiveTab);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-accent text-white font-bold"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* ========================================================
          MAIN VIEWPORT (CLEAN GLASS, RESPONSIVE CONTAINER)
      ======================================================== */}
      <main className="relative z-20 flex-1 flex flex-col justify-center px-3 sm:px-8 lg:px-14 pb-20 sm:pb-0 overflow-y-auto sm:overflow-hidden">
        {/* ======================================================
            TAB 1: HOME (EXACT TANJIL.ME CLEAN GLASS LANDING PAGE VIEW)
        ====================================================== */}
        {activeTab === "home" && (
          <div className="w-full max-w-7xl mx-auto my-auto grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-14 items-center animate-in fade-in duration-500 py-3 sm:py-0">
            {/* Left Column: Headline, Bio & Action Buttons */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-6">
              {/* Status Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-black/40 backdrop-blur-md text-xs font-mono tracking-wider text-emerald-400 font-semibold w-fit shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>AVAILABLE FOR HIRE</span>
              </div>

              {/* Bold Headline */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.5rem] font-black text-white tracking-tight leading-[1.1]">
                Building Fast,<br />
                Reliable <span className="text-accent drop-shadow-[0_0_30px_rgba(255,30,56,0.45)]">Web</span><br />
                <span className="text-accent drop-shadow-[0_0_30px_rgba(255,30,56,0.45)]">Experiences.</span>
              </h1>

              {/* Narrative Bio */}
              <p className="text-gray-300 text-xs sm:text-base md:text-lg leading-relaxed max-w-xl font-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Frontend Developer specializing in modern web and mobile applications. I use an AI-assisted workflow — Claude, ChatGPT, and Cursor — to build and ship faster.
              </p>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {/* Download Resume Button */}
                <a
                  href={hero.resumeUrl || settings.resumeUrl || "/resume.pdf"}
                  download="Swapnil_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-white/20 bg-black/50 hover:bg-black/80 backdrop-blur-md text-xs sm:text-sm font-semibold text-white flex items-center gap-2.5 hover:border-white/40 transition shadow-lg group cursor-pointer"
                >
                  <span>Download Resume</span>
                  <span className="text-accent text-base group-hover:translate-y-0.5 transition-transform">
                    ↓
                  </span>
                </a>

                {/* Explore Projects 3x3 Grid Dots Icon Button */}
                <button
                  onClick={() => setActiveTab("projects")}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-black/50 hover:bg-black/80 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:border-white/40 transition shadow-lg cursor-pointer group"
                  title="Explore Projects"
                  aria-label="Explore Projects"
                >
                  <div className="grid grid-cols-3 gap-1 group-hover:scale-110 transition-transform">
                    <span className="w-1 h-1 rounded-full bg-current" />
                    <span className="w-1 h-1 rounded-full bg-current" />
                    <span className="w-1 h-1 rounded-full bg-current" />
                    <span className="w-1 h-1 rounded-full bg-current" />
                    <span className="w-1 h-1 rounded-full bg-current" />
                    <span className="w-1 h-1 rounded-full bg-current" />
                    <span className="w-1 h-1 rounded-full bg-current" />
                    <span className="w-1 h-1 rounded-full bg-current" />
                    <span className="w-1 h-1 rounded-full bg-current" />
                  </div>
                </button>
              </div>
            </div>

            {/* Right Column: Profile Picture Squircle Card + Flanking Social Column */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-3 sm:gap-4">
              {/* Circle Profile Card Frame */}
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-[22rem] lg:h-[22rem] xl:w-[25rem] xl:h-[25rem] aspect-square rounded-full border border-white/20 hover:border-accent/60 bg-black/40 backdrop-blur-md shadow-2xl shadow-black/80 p-2 sm:p-3 group transition-all duration-500 hover:shadow-[0_0_35px_rgba(255,30,56,0.35)] shrink-0">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-black/60 border border-white/10">
                  <Image
                    src="/images/pfp.png"
                    alt="Md. Miftahur Rahman Swapnil"
                    fill
                    sizes="(max-width: 768px) 200px, 400px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  {/* Subtle circular glass gloss highlight */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none rounded-full" />
                </div>
              </div>

              {/* Column (or row on mobile) of Circular Dark Glass Social Buttons */}
              <div className="flex sm:flex-col items-center justify-center gap-2 sm:gap-3 mt-2 sm:mt-0 flex-wrap">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/mr.swapnil360/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/15 bg-black/60 hover:bg-black/90 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 hover:scale-110 transition shadow-lg"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>

                {/* Telegram */}
                <a
                  href="https://t.me/swapnil360"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/15 bg-black/60 hover:bg-black/90 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 hover:scale-110 transition shadow-lg"
                  title="Telegram"
                >
                  <Send className="w-4 h-4" />
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/Swapnil-360"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/15 bg-black/60 hover:bg-black/90 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 hover:scale-110 transition shadow-lg"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/mr-swapnil/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/15 bg-black/60 hover:bg-black/90 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 hover:scale-110 transition shadow-lg"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>

                {/* Email (Opens Gmail Inbox Compose) */}
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(settings.email || "miftahurr503@gmail.com")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/15 bg-black/60 hover:bg-black/90 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 hover:scale-110 transition shadow-lg"
                  title="Open Gmail Inbox"
                >
                  <Mail className="w-4 h-4" />
                </a>

                {/* WhatsApp (Opens WhatsApp Inbox) */}
                <a
                  href={`https://wa.me/${(settings.whatsapp || "8801318090383").replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/15 bg-black/60 hover:bg-black/90 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 hover:scale-110 transition shadow-lg"
                  title="Open WhatsApp Inbox"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================
            TAB 2: ABOUT MODAL CARD (CLEAN GLASS STYLE)
        ====================================================== */}
        {activeTab === "about" && (
          <div className="relative z-30 w-full max-w-5xl mx-auto my-auto p-4 sm:p-10 rounded-2xl sm:rounded-3xl border border-white/15 bg-[#080d16]/90 backdrop-blur-2xl shadow-2xl shadow-black/95 overflow-y-auto max-h-[86vh] sm:max-h-[80vh] custom-scrollbar animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  About <span className="text-accent">Swapnil</span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  BUBT CSE • Frontend & Creative Technologist
                </p>
              </div>
              <button
                onClick={() => setActiveTab("home")}
                className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition cursor-pointer"
                title="Return to Home"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-12 gap-6">
              {/* Left narrative */}
              <div className="md:col-span-7 space-y-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <p className="text-white text-sm sm:text-base leading-relaxed">
                    I am <span className="text-accent font-bold">Md. Miftahur Rahman Swapnil</span>, a developer studying Computer Science & Engineering at BUBT (Dhaka, Bangladesh).
                  </p>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                    I specialize in building high-performance web applications and mobile platforms using an AI-assisted workflow — Claude, ChatGPT, and Cursor. I collaborate transparently on GitHub, design intuitive interfaces in Figma, and deploy seamlessly on Vercel and Netlify.
                  </p>
                </div>

                {/* Research exploration */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="text-xs font-bold text-accent uppercase tracking-wider">
                    Academic Research & Exploration
                  </div>
                  <div className="space-y-2">
                    {education.researchInterests.map((r, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/5">
                        <div className="font-semibold text-xs text-white">{r.title}</div>
                        <div className="text-[11px] text-gray-400 mt-1">{r.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right specs */}
              <div className="md:col-span-5 space-y-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="text-xs font-bold text-accent uppercase tracking-wider border-b border-white/10 pb-2">
                    Core Information
                  </div>
                  <div className="divide-y divide-white/5 text-xs space-y-2">
                    <div className="pt-2 flex justify-between">
                      <span className="text-gray-400">Full Name</span>
                      <span className="text-white font-medium">Md. M. R. Swapnil</span>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span className="text-gray-400">Degree</span>
                      <span className="text-white font-medium">BSc CSE, BUBT</span>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span className="text-gray-400">Graduation</span>
                      <span className="text-accent font-semibold">2026 (Expected)</span>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span className="text-gray-400">Location</span>
                      <span className="text-white font-medium">Dhaka, Bangladesh</span>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span className="text-gray-400">Availability</span>
                      <span className="text-emerald-400 font-semibold">{settings.availability}</span>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span className="text-gray-400">Primary Stack</span>
                      <span className="text-white font-medium">Next.js / TypeScript / Tailwind</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xs font-bold text-accent uppercase mb-2">
                    Engineering Coursework
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    {education.coursework.map((c, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-gray-300">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================
            TAB 3: SKILLS MODAL CARD (CLEAN GLASS STYLE)
        ====================================================== */}
        {activeTab === "skills" && (
          <div className="relative z-30 w-full max-w-5xl mx-auto my-auto p-4 sm:p-10 rounded-2xl sm:rounded-3xl border border-white/15 bg-[#080d16]/90 backdrop-blur-2xl shadow-2xl shadow-black/95 overflow-y-auto max-h-[86vh] sm:max-h-[80vh] custom-scrollbar animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Skills & <span className="text-accent">Expertise</span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Modern Tools, Frameworks & Core Execution Capabilities
                </p>
              </div>
              <button
                onClick={() => setActiveTab("home")}
                className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition cursor-pointer"
                title="Return to Home"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Skills Categories Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {skills.map((grp, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-accent uppercase font-bold border-b border-white/10 pb-2">
                    <Cpu className="w-4 h-4" />
                    <span>{grp.category}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {grp.skills.map((s, sIdx) => (
                      <span
                        key={sIdx}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border ${
                          s.highlight
                            ? "bg-accent/20 border-accent text-white shadow-[0_0_10px_rgba(255,30,56,0.3)]"
                            : "bg-black/40 border-white/10 text-gray-300"
                        }`}
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Services / Execution Modules */}
            <div className="pt-6 border-t border-white/10 mt-6">
              <div className="text-xs font-bold text-accent uppercase tracking-wider mb-3">
                Core Execution Modules
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1 hover:border-accent/60 transition-colors"
                  >
                    <div className="text-[10px] font-mono text-accent">{srv.number} //</div>
                    <div className="font-bold text-sm text-white">{srv.title}</div>
                    <div className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {srv.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>


          </div>
        )}

        {/* ======================================================
            TAB 4: PROJECTS MODAL CARD (COMPACT 3-CARD 3D STACK + GRID)
        ====================================================== */}
        {activeTab === "projects" && (
          <div className={`relative z-30 w-full max-w-5xl mx-auto my-auto p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/15 bg-[#080d16]/90 backdrop-blur-2xl shadow-2xl shadow-black/95 ${projectsViewMode === "stack" ? "overflow-x-hidden overflow-y-auto sm:overflow-hidden" : "overflow-y-auto custom-scrollbar"} max-h-[88vh] sm:max-h-[85vh] animate-in fade-in zoom-in-95 duration-300`}>
            {/* Header: Clean HUD Layout */}
            <div className="border-b border-white/10 pb-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-accent uppercase font-bold">
                    <span>——</span>
                    <span>FEATURED PORTFOLIO</span>
                    <span>——</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                    Selected <span className="text-accent">Projects</span>
                  </h2>
                </div>

                <div className="flex items-center gap-2.5">
                  {/* View Mode Toggle: 3D Deck vs Grid */}
                  <div className="flex items-center rounded-full bg-black/60 border border-white/10 p-1 shadow-inner">
                    <button
                      type="button"
                      onClick={() => setProjectsViewMode("stack")}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                        projectsViewMode === "stack"
                          ? "bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold shadow-[0_0_12px_rgba(255,30,56,0.6)]"
                          : "text-gray-400 hover:text-white"
                      }`}
                      title="3D Interactive Stack View"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>3D Deck</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setProjectsViewMode("grid")}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                        projectsViewMode === "grid"
                          ? "bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold shadow-[0_0_12px_rgba(255,30,56,0.6)]"
                          : "text-gray-400 hover:text-white"
                      }`}
                      title="Grid Gallery View"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Grid</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setActiveTab("home")}
                    className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-accent/20 hover:border-accent/40 text-gray-300 hover:text-white transition cursor-pointer"
                    title="Return to Home"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Category Filters Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-white/5">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "all", label: "All Projects" },
                    { id: "web", label: "Web Apps" },
                    { id: "mobile", label: "Mobile" },
                    { id: "ai", label: "AI & Tools" },
                    { id: "game", label: "Graphics / C" },
                  ].map((cat) => {
                    const count = cat.id === "all"
                      ? projects.length
                      : projects.filter((p) => p.category === cat.id).length;
                    const active = projectCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setProjectCategory(cat.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                          active
                            ? "bg-accent/20 border border-accent text-white font-semibold shadow-[0_0_10px_rgba(255,30,56,0.3)]"
                            : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <span>{cat.label}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${active ? "bg-accent text-white" : "bg-white/10 text-gray-400"}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {projectsViewMode === "stack" && (
                  <span className="text-[11px] font-mono text-gray-400 hidden sm:inline-block">
                    Click card to view details • 3 in view
                  </span>
                )}
              </div>
            </div>

            {/* 3D Stack View Mode (Compact 3-Card Layout) */}
            {projectsViewMode === "stack" ? (
              <div className="py-1">
                <CardStack
                  items={filteredProjects.map((p) => {
                    const isEdu51 = p.id === "proj-2" || p.slug === "edu51five";
                    const heroImg = isEdu51 ? "/images/projects/edu51_real.jpeg" : (p.heroImage || "/images/background_ref.png");
                    return {
                      id: p.id,
                      title: p.title,
                      description: p.subtitle || p.shortDescription,
                      imageSrc: heroImg,
                      href: p.liveUrl || p.githubUrl || undefined,
                      tag: p.categoryLabel,
                    };
                  })}
                  initialIndex={0}
                  maxVisible={3}
                  cardWidth={440}
                  cardHeight={310}
                  overlap={0.52}
                  spreadDeg={16}
                  depthPx={70}
                  tiltXDeg={4}
                  activeLiftPx={14}
                  autoAdvance={false}
                  showDots
                  onCardClick={(item, state) => {
                    const proj = projects.find((p) => p.id === item.id);
                    if (proj && state.active) {
                      setSelectedProject(proj);
                    }
                  }}
                  renderCard={(item, { active: isActive }) => {
                    const proj = projects.find((p) => p.id === item.id);
                    const isEdu51 = proj?.id === "proj-2" || proj?.slug === "edu51five";
                    const heroImg = isEdu51 ? "/images/projects/edu51_real.jpeg" : (item.imageSrc || "/images/background_ref.png");

                    return (
                      <div
                        onClick={() => {
                          if (isActive && proj) {
                            setSelectedProject(proj);
                          }
                        }}
                        className={`relative h-full w-full group overflow-hidden rounded-2xl sm:rounded-3xl border flex flex-col justify-between transition-[border-color,box-shadow] duration-150 ${
                          isActive
                            ? "border-accent/60 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_30px_rgba(255,30,56,0.3)] ring-1 ring-accent/40 cursor-pointer"
                            : "border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.8)] cursor-pointer hover:border-white/30"
                        }`}
                      >
                        {/* Background Thumbnail Image */}
                        <div className="absolute inset-0">
                          <img
                            src={heroImg}
                            alt={item.title}
                            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                            draggable={false}
                          />
                        </div>

                        {/* Rich Vignette Gradient */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />

                        {/* Top Badges */}
                        <div className="relative z-10 p-3.5 sm:p-4 flex items-center justify-between pointer-events-auto">
                          {proj?.featured ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-accent text-white text-[9px] font-mono font-bold shadow-[0_0_10px_rgba(255,30,56,0.6)]">
                              FEATURED
                            </span>
                          ) : <div />}

                          {proj?.status && (
                            <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[11px] font-mono text-white/90 shadow-md">
                              {proj.status === "Live" ? "● Live System" : proj.status}
                            </span>
                          )}
                        </div>

                        {/* Bottom Gradient Neon Line for Active Card */}
                        {isActive && (
                          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-500 via-accent to-rose-600 shadow-[0_0_15px_rgba(255,30,56,0.9)] z-20" />
                        )}

                        {/* Bottom Card Content */}
                        <div className="relative z-10 p-3 sm:p-5 flex flex-col justify-end gap-1.5 sm:gap-2">
                          <div>
                            <h3 className="text-base sm:text-xl font-black text-white tracking-tight leading-snug drop-shadow-md group-hover:text-accent transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-gray-300 mt-0.5 line-clamp-1">
                              {proj?.subtitle || proj?.shortDescription}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/15 text-[10px] sm:text-xs text-gray-200 font-medium">
                              {proj?.categoryLabel || "Production"}
                            </span>

                            <div className="flex items-center gap-2">
                              {proj?.liveUrl && (
                                <a
                                  href={proj.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition hover:scale-105"
                                  title="Open Live Website"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (proj) setSelectedProject(proj);
                                }}
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 hover:bg-accent border border-white/25 hover:border-accent text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg cursor-pointer group/btn"
                                title="View Full Details"
                              >
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
              </div>
            ) : (
              /* Projects Grid */
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((proj) => {
                const isEdu51 = proj.id === "proj-2" || proj.slug === "edu51five";
                const heroImg = isEdu51 ? "/images/projects/edu51_real.jpeg" : (proj.heroImage || "/images/background_ref.png");

                return (
                <div
                  key={proj.id}
                  onClick={() => setSelectedProject(proj)}
                  className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-accent/60 transition-all duration-300 flex flex-col justify-between group shadow-lg cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative w-full h-48 bg-black/60 overflow-hidden">
                    <Image
                      src={heroImg}
                      alt={proj.title}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-accent font-semibold">
                        {proj.status}
                      </span>
                      {proj.featured && (
                        <span className="px-2.5 py-0.5 rounded-full bg-accent text-white text-[10px] font-mono font-bold shadow-md">
                          FEATURED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-accent uppercase tracking-wider">
                        {proj.categoryLabel}
                      </div>
                      <h3 className="font-bold text-base text-white group-hover:text-accent transition-colors mt-0.5">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-gray-300 mt-1 line-clamp-2 leading-relaxed">
                        {proj.shortDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 space-y-3">
                      <div className="flex flex-wrap gap-1 text-[10px] text-gray-400">
                        {proj.technologies.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-black/40 border border-white/10">
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-accent hover:text-white uppercase flex items-center gap-1 text-xs font-semibold">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Case Study</span>
                        </span>

                        <div className="flex items-center gap-2">
                          {proj.liveUrl && (
                            <a
                              href={proj.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-accent text-gray-300 hover:text-accent transition-colors"
                              title="Open Live Website"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {proj.githubUrl && (
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-accent text-gray-300 hover:text-accent transition-colors"
                              title="View Git Repository"
                            >
                              <Github className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
            )}
          </div>
        )}

        {/* ======================================================
            TAB 5: CONTACT MODAL CARD (CLEAN GLASS STYLE)
        ====================================================== */}
        {activeTab === "contact" && (
          <div className="relative z-30 w-full max-w-4xl mx-auto my-auto p-4 sm:p-10 rounded-2xl sm:rounded-3xl border border-white/15 bg-[#080d16]/90 backdrop-blur-2xl shadow-2xl shadow-black/95 overflow-y-auto max-h-[86vh] sm:max-h-[80vh] custom-scrollbar animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Get in <span className="text-accent">Touch</span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Let&apos;s Discuss Your Next Web App, Design, or Project Inquiry
                </p>
              </div>
              <button
                onClick={() => setActiveTab("home")}
                className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition cursor-pointer"
                title="Return to Home"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-12 gap-6">
              {/* Direct channels */}
              <div className="md:col-span-5 space-y-3">
                {/* Gmail Inbox Channel */}
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(settings.email || "miftahurr503@gmail.com")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/60 hover:bg-white/10 flex items-center justify-between group transition-all cursor-pointer"
                  title="Open Gmail Inbox to compose message"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">
                        Gmail Inbox
                      </div>
                      <div className="font-semibold text-xs sm:text-sm text-white group-hover:text-red-300 transition-colors">
                        Open Gmail Inbox
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 group-hover:text-red-400 transition-colors flex items-center gap-1">
                    <span>Compose</span>
                    <span>→</span>
                  </span>
                </a>

                {/* WhatsApp Inbox Channel */}
                <a
                  href={`https://wa.me/${(settings.whatsapp || "8801318090383").replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/60 hover:bg-white/10 flex items-center justify-between group transition-all cursor-pointer"
                  title="Open WhatsApp Inbox to chat directly"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                      <WhatsAppIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">
                        WhatsApp Direct
                      </div>
                      <div className="font-semibold text-xs sm:text-sm text-white group-hover:text-emerald-300 transition-colors">
                        Open WhatsApp Inbox
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                    <span>Chat</span>
                    <span>→</span>
                  </span>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/mr-swapnil/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-400/60 hover:bg-white/10 flex items-center justify-between group transition-all cursor-pointer"
                  title="View LinkedIn Profile"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">
                        LinkedIn Network
                      </div>
                      <div className="font-semibold text-xs sm:text-sm text-white group-hover:text-blue-300 transition-colors">
                        Connect on LinkedIn
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 group-hover:text-blue-400 transition-colors flex items-center gap-1">
                    <span>Profile</span>
                    <span>→</span>
                  </span>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/Swapnil-360"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/60 hover:bg-white/10 flex items-center justify-between group transition-all cursor-pointer"
                  title="Explore GitHub Repositories"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                      <Github className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">
                        GitHub Repositories
                      </div>
                      <div className="font-semibold text-xs sm:text-sm text-white group-hover:text-purple-300 transition-colors">
                        View Repositories
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 group-hover:text-purple-400 transition-colors flex items-center gap-1">
                    <span>Code</span>
                    <span>→</span>
                  </span>
                </a>
              </div>

              {/* Message form */}
              <div className="md:col-span-7">
                <form
                  onSubmit={handleContactSubmit}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs"
                >
                  {contactStatus === "success" ? (
                    <div className="py-8 text-center space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                      <div className="font-bold text-base text-white">MESSAGE SENT</div>
                      <p className="text-gray-400 text-xs">
                        Thank you for reaching out! I will respond to your email promptly.
                      </p>
                      <button
                        type="button"
                        onClick={() => setContactStatus("idle")}
                        className="px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-accent text-xs mt-2"
                      >
                        Send Another
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Your Name *"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="px-3.5 py-2.5 bg-black/50 border border-white/10 focus:border-accent rounded-xl text-white focus:outline-none"
                        />
                        <input
                          type="email"
                          required
                          placeholder="Your Email *"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="px-3.5 py-2.5 bg-black/50 border border-white/10 focus:border-accent rounded-xl text-white focus:outline-none"
                        />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Subject (Project Inquiry / Commission) *"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 focus:border-accent rounded-xl text-white focus:outline-none"
                      />
                      <textarea
                        rows={4}
                        required
                        placeholder="Message / Project Scope Details *"
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 focus:border-accent rounded-xl text-white focus:outline-none resize-none"
                      />
                      <button
                        type="submit"
                        disabled={contactStatus === "submitting"}
                        className="w-full py-3 bg-accent hover:bg-accent-hover text-white font-bold tracking-wider uppercase rounded-full shadow-[0_0_15px_rgba(255,30,56,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{contactStatus === "submitting" ? "Sending..." : "Send Message"}</span>
                      </button>
                    </>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          BOTTOM INFINITE MARQUEE TICKER (CONTINUOUS ANIMATED SCROLL)
      ======================================================== */}
      <footer className="relative z-30 w-full overflow-hidden py-3 shrink-0 border-t border-white/5 bg-black/40 backdrop-blur-md flex items-center">
        {/* Left Edge Gradient Fade Mask */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#04060a] to-transparent z-20 pointer-events-none" />

        {/* Right Edge Gradient Fade Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#04060a] to-transparent z-20 pointer-events-none" />

        {/* Mode Toggle Button */}
        <button
          onClick={() => setMarqueeMode(marqueeMode === "tech" ? "icons" : "tech")}
          className="absolute right-3 sm:right-6 z-30 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-black/80 hover:bg-black border border-white/20 hover:border-accent text-gray-300 hover:text-white transition shadow-xl flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
          title={`Switch to ${marqueeMode === "tech" ? "250+ App Integrations" : "Core Tech Stack"}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span>{marqueeMode === "tech" ? "⚡ Tools" : "💻 Stack"}</span>
        </button>

        {/* Marquee Track (Smooth Infinite Loop) */}
        {marqueeMode === "tech" ? (
          <div className="flex items-center gap-3 animate-marquee hover:[animation-play-state:paused] py-0.5">
            {[...techPills, ...techPills, ...techPills, ...techPills].map((tech, idx) => (
              <div
                key={`${tech.name}-${idx}`}
                className="rounded-full border border-white/10 bg-black/60 hover:bg-black/90 backdrop-blur-md px-4 py-1.5 text-xs text-gray-300 flex items-center gap-2 whitespace-nowrap shadow-md hover:border-accent/60 hover:text-white hover:scale-105 transition-all duration-300 shrink-0 cursor-pointer"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: tech.color }}
                />
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-4 animate-marquee hover:[animation-play-state:paused] py-0.5">
            {[...integrationIcons, ...integrationIcons, ...integrationIcons, ...integrationIcons].map((src, i) => (
              <div
                key={i}
                className="h-10 w-10 flex-shrink-0 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-md flex items-center justify-center p-2 hover:scale-110 hover:border-accent transition-all cursor-pointer"
              >
                <img src={src} alt="Tool Integration" className="h-6 w-6 object-contain" />
              </div>
            ))}
          </div>
        )}
      </footer>

      {/* Case Study Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onPrev={() => {
            const idx = projects.findIndex((p) => p.id === selectedProject.id);
            const prev = (idx - 1 + projects.length) % projects.length;
            setSelectedProject(projects[prev]);
          }}
          onNext={() => {
            const idx = projects.findIndex((p) => p.id === selectedProject.id);
            const next = (idx + 1) % projects.length;
            setSelectedProject(projects[next]);
          }}
        />
      )}
    </div>
  );
}
