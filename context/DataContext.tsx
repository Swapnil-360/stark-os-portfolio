"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  HeroConfig,
  Project,
  Experience,
  Education,
  Service,
  SkillCategory,
  SocialLink,
  SiteSettings,
} from "@/types/portfolio";
import {
  INITIAL_HERO,
  INITIAL_SETTINGS,
  INITIAL_PROJECTS,
  INITIAL_SERVICES,
  INITIAL_SKILL_CATEGORIES,
  INITIAL_EXPERIENCES,
  INITIAL_EDUCATION,
  INITIAL_SOCIAL_LINKS,
} from "@/lib/initialData";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { getProjectThumbnail, normalizeProjectCategory, normalizeProjectLiveUrl, sanitizeProjectData } from "@/lib/projectUtils";

interface DataContextType {
  hero: HeroConfig;
  updateHero: (data: Partial<HeroConfig>) => Promise<void>;
  projects: Project[];
  addProject: (project: Omit<Project, "id">) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  experiences: Experience[];
  updateExperiences: (experiences: Experience[]) => Promise<void>;
  education: Education;
  updateEducation: (education: Education) => Promise<void>;
  services: Service[];
  updateServices: (services: Service[]) => Promise<void>;
  skills: SkillCategory[];
  updateSkills: (skills: SkillCategory[]) => Promise<void>;
  socialLinks: SocialLink[];
  updateSocialLinks: (links: SocialLink[]) => Promise<void>;
  settings: SiteSettings;
  updateSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  resetToDefaults: () => void;
  isLiveDb: boolean;
  lastSaved: number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  HERO: "swapnil_hero_data_v7",
  PROJECTS: "swapnil_projects_data_v7",
  EXPERIENCES: "swapnil_experiences_data_v3",
  EDUCATION: "swapnil_education_data_v3",
  SERVICES: "swapnil_services_data_v3",
  SKILLS: "swapnil_skills_data_v3",
  SOCIALS: "swapnil_socials_data_v4",
  SETTINGS: "swapnil_settings_data_v4",
};

// ─── snake_case → camelCase mappers ──────────────────────────────────────────

function heroFromDb(row: Record<string, any>): HeroConfig {
  const parseJsonArray = (val: any, fallback: any[]) => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string") {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return fallback;
  };

  return {
    name: row.name ?? INITIAL_HERO.name,
    label: row.label ?? INITIAL_HERO.label,
    subtitle: row.subtitle ?? INITIAL_HERO.subtitle,
    description: row.description ?? INITIAL_HERO.description,
    statusBadge: row.status_badge ?? INITIAL_HERO.statusBadge,
    ctaPrimaryText: row.cta_primary_text ?? INITIAL_HERO.ctaPrimaryText,
    ctaPrimaryLink: row.cta_primary_link ?? INITIAL_HERO.ctaPrimaryLink,
    ctaSecondaryText: row.cta_secondary_text ?? INITIAL_HERO.ctaSecondaryText,
    ctaSecondaryLink: row.cta_secondary_link ?? INITIAL_HERO.ctaSecondaryLink,
    videoUrl: row.video_url ?? INITIAL_HERO.videoUrl,
    mobileVideoUrl: row.mobile_video_url ?? INITIAL_HERO.mobileVideoUrl,
    posterUrl: row.poster_url ?? INITIAL_HERO.posterUrl,
    mobileFallbackUrl: row.mobile_fallback_url ?? INITIAL_HERO.mobileFallbackUrl,
    staticDesktopBg: row.static_desktop_bg ?? INITIAL_HERO.staticDesktopBg,
    staticMobileBg: row.static_mobile_bg ?? INITIAL_HERO.staticMobileBg,
    portraitUrl: (row.portrait_url && row.portrait_url !== "/images/background_ref.png") ? row.portrait_url : "/images/pfp.png",
    resumeUrl: row.resume_url ?? INITIAL_HERO.resumeUrl,
    videoSpeed: row.video_speed !== undefined && row.video_speed !== null ? Number(row.video_speed) : INITIAL_HERO.videoSpeed,
    overlayOpacity: row.overlay_opacity !== undefined && row.overlay_opacity !== null ? Number(row.overlay_opacity) : INITIAL_HERO.overlayOpacity,
    blurAmount: row.blur_amount !== undefined && row.blur_amount !== null ? Number(row.blur_amount) : (INITIAL_HERO.blurAmount ?? 0),
    videoEnabled: row.video_enabled !== undefined && row.video_enabled !== null ? Boolean(row.video_enabled) : INITIAL_HERO.videoEnabled,
    backgroundVideos: parseJsonArray(row.background_videos, INITIAL_HERO.backgroundVideos ?? []),
    mobileBackgroundVideos: parseJsonArray(row.mobile_background_videos, INITIAL_HERO.mobileBackgroundVideos ?? []),
    selectedVideoId: row.selected_video_id ?? INITIAL_HERO.selectedVideoId,
    selectedMobileVideoId: row.selected_mobile_video_id ?? INITIAL_HERO.selectedMobileVideoId,
    locationLabel: row.location_label ?? INITIAL_HERO.locationLabel,
  };
}

function heroToDb(hero: HeroConfig): Record<string, any> {
  return {
    id: "default_hero",
    name: hero.name,
    label: hero.label,
    subtitle: hero.subtitle,
    description: hero.description,
    status_badge: hero.statusBadge,
    cta_primary_text: hero.ctaPrimaryText,
    cta_secondary_text: hero.ctaSecondaryText,
    video_url: hero.videoUrl,
    mobile_video_url: hero.mobileVideoUrl,
    poster_url: hero.posterUrl,
    mobile_fallback_url: hero.mobileFallbackUrl,
    static_desktop_bg: hero.staticDesktopBg,
    static_mobile_bg: hero.staticMobileBg,
    portrait_url: hero.portraitUrl,
    resume_url: hero.resumeUrl,
    video_speed: typeof hero.videoSpeed === "number" ? hero.videoSpeed : (parseFloat(hero.videoSpeed as any) || 1.0),
    overlay_opacity: typeof hero.overlayOpacity === "number" ? hero.overlayOpacity : (parseFloat(hero.overlayOpacity as any) || 0.65),
    blur_amount: typeof hero.blurAmount === "number" ? hero.blurAmount : (parseFloat(hero.blurAmount as any) || 0),
    video_enabled: Boolean(hero.videoEnabled),
    background_videos: hero.backgroundVideos ?? [],
    mobile_background_videos: hero.mobileBackgroundVideos ?? [],
    selected_video_id: hero.selectedVideoId,
    selected_mobile_video_id: hero.selectedMobileVideoId,
    updated_at: new Date().toISOString(),
  };
}

function projectFromDb(row: Record<string, any>): Project {
  const heroImage = getProjectThumbnail({
    heroImage: row.thumbnail_url,
    slug: row.slug,
    id: row.id,
    title: row.title,
  });

  const { category, categoryLabel } = normalizeProjectCategory(
    row.category,
    row.slug,
    row.title
  );

  return sanitizeProjectData({
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.tagline ?? "",
    category,
    categoryLabel,
    shortDescription: row.description ?? "",
    fullDescription: row.description ?? "",
    heroImage,
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    technologies: Array.isArray(row.tags) ? row.tags : [],
    liveUrl: normalizeProjectLiveUrl(row.live_url, row.slug, row.title),
    githubUrl: row.github_url,
    featured: row.featured ?? false,
    displayOrder: row.display_order ?? 0,
    year: row.created_at ? new Date(row.created_at).getFullYear().toString() : "2024",
    role: row.category ?? "",
    status: "Live",
    keyFeatures: [],
  });
}

function projectToDb(proj: Partial<Project> & { id: string }): Record<string, any> {
  const out: Record<string, any> = { id: proj.id };
  if (proj.title !== undefined) out.title = proj.title;
  if (proj.slug !== undefined) out.slug = proj.slug;
  if (proj.subtitle !== undefined) out.tagline = proj.subtitle;
  if (proj.shortDescription !== undefined) out.description = proj.shortDescription;
  if (proj.category !== undefined) out.category = proj.category;
  if (proj.heroImage !== undefined) out.thumbnail_url = proj.heroImage;
  if (proj.featured !== undefined) out.featured = proj.featured;
  if (proj.displayOrder !== undefined) out.display_order = proj.displayOrder;
  if (proj.liveUrl !== undefined) out.live_url = proj.liveUrl;
  if (proj.githubUrl !== undefined) out.github_url = proj.githubUrl;
  if (proj.technologies !== undefined) out.tags = proj.technologies;
  if (proj.gallery !== undefined) out.gallery = proj.gallery;
  return out;
}

function settingsFromDb(row: Record<string, any>): SiteSettings {
  return {
    title: row.title ?? INITIAL_SETTINGS.title,
    description: row.description ?? INITIAL_SETTINGS.description,
    author: row.author ?? INITIAL_SETTINGS.author,
    email: row.email ?? INITIAL_SETTINGS.email,
    adminEmail: row.admin_email ?? INITIAL_SETTINGS.adminEmail,
    whatsapp: row.whatsapp ?? INITIAL_SETTINGS.whatsapp,
    location: row.location ?? INITIAL_SETTINGS.location,
    coordinates: row.coordinates ?? INITIAL_SETTINGS.coordinates,
    availability: row.availability ?? INITIAL_SETTINGS.availability,
    systemVersion: row.system_version ?? INITIAL_SETTINGS.systemVersion,
    buildYear: row.build_year ?? INITIAL_SETTINGS.buildYear,
    resumeUrl: row.resume_url ?? INITIAL_SETTINGS.resumeUrl,
  };
}

function settingsToDb(s: SiteSettings): Record<string, any> {
  return {
    id: "default_settings",
    author: s.author,
    email: s.email,
    admin_email: s.adminEmail,
    whatsapp: s.whatsapp,
    coordinates: s.coordinates,
    availability: s.availability,
    system_version: s.systemVersion,
    build_year: s.buildYear,
    resume_url: s.resumeUrl,
    updated_at: new Date().toISOString(),
  };
}

function educationFromDb(row: Record<string, any>): Education {
  const parseJsonArray = (val: any, fallback: any[]) => {
    if (Array.isArray(val) && val.length > 0) return val;
    if (typeof val === "string") {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return fallback;
  };

  return {
    ...INITIAL_EDUCATION,
    id: row.id || INITIAL_EDUCATION.id,
    degree: row.degree || INITIAL_EDUCATION.degree,
    institution: row.institution || INITIAL_EDUCATION.institution,
    period: row.period || INITIAL_EDUCATION.period,
    location: row.location || INITIAL_EDUCATION.location,
    description: row.description || row.field || INITIAL_EDUCATION.description,
    coursework: parseJsonArray(row.coursework, INITIAL_EDUCATION.coursework),
    researchInterests: parseJsonArray(
      row.research_interests ?? row.researchInterests,
      INITIAL_EDUCATION.researchInterests
    ),
  };
}

// ─── Broadcast helpers ───────────────────────────────────────────────────────

function broadcastDataChange(key: string, data: any) {
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(new CustomEvent("swapnil_local_sync", { detail: { key, data } }));
    } catch {}
    try {
      const channel = new BroadcastChannel("swapnil_portfolio_channel_v4");
      channel.postMessage({ key, data });
      channel.close();
    } catch {}
  }
}

// ─── Provider ───────────────────────────────────────────────────────────────

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [hero, setHero] = useState<HeroConfig>(INITIAL_HERO);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [experiences, setExperiences] = useState<Experience[]>(INITIAL_EXPERIENCES);
  const [education, setEducation] = useState<Education>(INITIAL_EDUCATION);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [skills, setSkills] = useState<SkillCategory[]>(INITIAL_SKILL_CATEGORIES);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(INITIAL_SOCIAL_LINKS);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [isLiveDb, setIsLiveDb] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<number>(Date.now());

  // Load initial data from Supabase (each table independently), then localStorage fallback
  useEffect(() => {
    async function loadData() {
      let dbLoaded = false;

      if (isSupabaseConfigured && supabase) {
        // Each table fetch is isolated — one failure won't crash the others
        try {
          const { data } = await supabase.from("hero_config").select("*").eq("id", "default_hero").single();
          if (data) { setHero(heroFromDb(data)); dbLoaded = true; }
        } catch (e) { console.warn("hero_config fetch failed:", e); }

        try {
          const { data } = await supabase.from("projects").select("*").order("display_order", { ascending: true });
          if (data && data.length > 0) {
            let mapped = data.map(projectFromDb);
            const hasMikasa = mapped.some((p: any) => p.slug === "mikasa-ai-assistant" || p.id === "proj-mikasa-ai" || p.title?.toLowerCase().includes("mikasa"));
            if (!hasMikasa) {
              const mikasaInitial = INITIAL_PROJECTS.find(p => p.id === "proj-mikasa-ai" || p.slug === "mikasa-ai-assistant");
              if (mikasaInitial) mapped = [mikasaInitial, ...mapped];
            }
            setProjects(mapped);
            dbLoaded = true;
            try { localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(mapped)); } catch {}

            // Self-heal OpusGen live URL if stale in Supabase database
            const staleOpus = data.find((p: any) =>
              (p.slug?.includes("opusgen") || p.title?.toLowerCase().includes("opusgen")) &&
              p.live_url &&
              (p.live_url.includes("opusgen.ai") || !p.live_url.includes("opusgenai.com"))
            );
            if (staleOpus) {
              supabase.from("projects").update({ live_url: "https://www.opusgenai.com/" }).eq("id", staleOpus.id).then(() => {});
            }

            // Self-heal Prince project details in Supabase database if stale or wrong
            const stalePrince = data.find((p: any) =>
              (p.slug?.includes("prince") || p.title?.toLowerCase().includes("prince")) &&
              (p.title?.toLowerCase().includes("agro") || p.live_url?.includes("princeagrotech") || !p.live_url?.includes("sbprince.com"))
            );
            if (stalePrince) {
              supabase.from("projects").update({
                title: "Prince - Digital Marketing & Web Expert Portfolio",
                tagline: "High-Conversion Client Portfolio & Personal Branding Platform",
                category: "Client Web Experience",
                description: "Prince Varman - Expert in crypto project support, digital marketing, web development, and creative design. Professional bespoke client portfolio engineered with high-conversion visual design, interactive service showcases, and modern responsive architecture.",
                live_url: "https://www.sbprince.com/",
                github_url: "https://github.com/Swapnil-360/Myself_Prince.git",
                thumbnail_url: "/images/projects/prince.jpg",
                tags: ["React", "JavaScript", "Tailwind CSS", "Web Development", "Crypto Marketing"],
                gallery: ["/images/projects/prince.jpg", "/images/projects/prince_real.png"]
              }).eq("id", stalePrince.id).then(() => {});
            }
          }
        } catch (e) { console.warn("projects fetch failed:", e); }

        try {
          const { data } = await supabase.from("experiences").select("*").order("display_order", { ascending: true });
          if (data && data.length > 0) setExperiences(data);
        } catch (e) { console.warn("experiences fetch failed:", e); }

        try {
          const { data } = await supabase.from("education").select("*").eq("id", "default_education").single();
          if (data) setEducation(educationFromDb(data));
        } catch (e) { console.warn("education fetch failed:", e); }

        try {
          const { data } = await supabase.from("services").select("*");
          if (data && data.length > 0) setServices(data);
        } catch (e) { console.warn("services fetch failed:", e); }

        try {
          const { data } = await supabase.from("skills").select("*").order("display_order", { ascending: true });
          if (data && data.length > 0) setSkills(data);
        } catch (e) { console.warn("skills fetch failed:", e); }

        try {
          const { data } = await supabase.from("social_links").select("*");
          if (data && data.length > 0) setSocialLinks(data);
        } catch (e) { console.warn("social_links fetch failed:", e); }

        try {
          const { data } = await supabase.from("site_settings").select("*").eq("id", "default_settings").single();
          if (data) setSettings(settingsFromDb(data));
        } catch (e) { console.warn("site_settings fetch failed:", e); }

        if (dbLoaded) { setIsLiveDb(true); return; }
      }

      // localStorage fallback
      try {
        const storedHero = localStorage.getItem(STORAGE_KEYS.HERO);
        if (storedHero) {
          const parsed = JSON.parse(storedHero);
          setHero({ ...INITIAL_HERO, ...parsed });
        }
        const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
        if (storedProjects) {
          try {
            const parsed = JSON.parse(storedProjects);
            if (Array.isArray(parsed)) {
              setProjects(parsed.map(p => sanitizeProjectData({
                ...p,
                liveUrl: normalizeProjectLiveUrl(p.liveUrl, p.slug, p.title),
                heroImage: getProjectThumbnail(p),
              })));
            }
          } catch {}
        }
        const storedExp = localStorage.getItem(STORAGE_KEYS.EXPERIENCES);
        if (storedExp) setExperiences(JSON.parse(storedExp));
        const storedEdu = localStorage.getItem(STORAGE_KEYS.EDUCATION);
        if (storedEdu) {
          try {
            setEducation(educationFromDb(JSON.parse(storedEdu)));
          } catch {}
        }
        const storedSrv = localStorage.getItem(STORAGE_KEYS.SERVICES);
        if (storedSrv) setServices(JSON.parse(storedSrv));
        const storedSkills = localStorage.getItem(STORAGE_KEYS.SKILLS);
        if (storedSkills) setSkills(JSON.parse(storedSkills));
        const storedSocials = localStorage.getItem(STORAGE_KEYS.SOCIALS);
        if (storedSocials) setSocialLinks(JSON.parse(storedSocials));
        const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (storedSettings) setSettings(JSON.parse(storedSettings));
      } catch (e) {
        console.error("LocalStorage load error:", e);
      }
    }

    loadData();
  }, []);

  // Cross-tab sync
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleSync = (key: string, data: any) => {
      if (!data) return;
      setLastSaved(Date.now());
      switch (key) {
        case STORAGE_KEYS.HERO: setHero(data); break;
        case STORAGE_KEYS.PROJECTS: setProjects(data); break;
        case STORAGE_KEYS.EXPERIENCES: setExperiences(data); break;
        case STORAGE_KEYS.EDUCATION: setEducation(data); break;
        case STORAGE_KEYS.SERVICES: setServices(data); break;
        case STORAGE_KEYS.SKILLS: setSkills(data); break;
        case STORAGE_KEYS.SOCIALS: setSocialLinks(data); break;
        case STORAGE_KEYS.SETTINGS: setSettings(data); break;
      }
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key && e.newValue) {
        try { handleSync(e.key, JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener("storage", onStorage);

    const onLocal = (e: Event) => {
      const custom = e as CustomEvent<{ key: string; data: any }>;
      if (custom.detail) handleSync(custom.detail.key, custom.detail.data);
    };
    window.addEventListener("swapnil_local_sync", onLocal);

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("swapnil_portfolio_channel_v4");
      channel.onmessage = (e) => {
        if (e.data?.key) handleSync(e.data.key, e.data.data);
      };
    } catch {}

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("swapnil_local_sync", onLocal);
      if (channel) channel.close();
    };
  }, []);

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const updateHero = async (data: Partial<HeroConfig>) => {
    const updated = { ...hero, ...data };
    setHero(updated);
    setLastSaved(Date.now());
    try { localStorage.setItem(STORAGE_KEYS.HERO, JSON.stringify(updated)); } catch {}
    broadcastDataChange(STORAGE_KEYS.HERO, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("hero_config")
          .upsert(heroToDb(updated), { onConflict: "id" });
        if (error) {
          console.error("Supabase hero update error:", error.message, error.details);
          throw new Error(error.message || "Failed to update hero config");
        }
      } catch (err) {
        console.error("Supabase hero update error:", err);
        throw err;
      }
    }
  };

  const addProject = async (projectData: Omit<Project, "id">) => {
    const newProject: Project = { ...projectData, id: "proj-" + Date.now() };
    const updated = [newProject, ...projects];
    setProjects(updated);
    setLastSaved(Date.now());
    try { localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated)); } catch {}
    broadcastDataChange(STORAGE_KEYS.PROJECTS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("projects").insert(projectToDb(newProject));
      } catch (err) { console.error("Supabase add project error:", err); }
    }
  };

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    const updated = projects.map((p) => (p.id === id ? { ...p, ...projectData } : p));
    setProjects(updated);
    setLastSaved(Date.now());
    try { localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated)); } catch {}
    broadcastDataChange(STORAGE_KEYS.PROJECTS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("projects").update(projectToDb({ ...projectData, id })).eq("id", id);
      } catch (err) { console.error("Supabase update project error:", err); }
    }
  };

  const deleteProject = async (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    setLastSaved(Date.now());
    try { localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated)); } catch {}
    broadcastDataChange(STORAGE_KEYS.PROJECTS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("projects").delete().eq("id", id);
      } catch (err) { console.error("Supabase delete project error:", err); }
    }
  };

  const updateExperiences = async (updated: Experience[]) => {
    setExperiences(updated);
    setLastSaved(Date.now());
    try { localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(updated)); } catch {}
    broadcastDataChange(STORAGE_KEYS.EXPERIENCES, updated);

    if (isSupabaseConfigured && supabase) {
      try { await supabase.from("experiences").upsert(updated); } catch (err) { console.error(err); }
    }
  };

  const updateEducation = async (updated: Education) => {
    setEducation(updated);
    setLastSaved(Date.now());
    try { localStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(updated)); } catch {}
    broadcastDataChange(STORAGE_KEYS.EDUCATION, updated);

    if (isSupabaseConfigured && supabase) {
      try { await supabase.from("education").upsert({ ...updated, id: "default_education" }); } catch (err) { console.error(err); }
    }
  };

  const updateServices = async (updated: Service[]) => {
    setServices(updated);
    setLastSaved(Date.now());
    try { localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated)); } catch {}
    broadcastDataChange(STORAGE_KEYS.SERVICES, updated);

    if (isSupabaseConfigured && supabase) {
      try { await supabase.from("services").upsert(updated); } catch (err) { console.error(err); }
    }
  };

  const updateSkills = async (updated: SkillCategory[]) => {
    setSkills(updated);
    setLastSaved(Date.now());
    try { localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(updated)); } catch {}
    broadcastDataChange(STORAGE_KEYS.SKILLS, updated);

    if (isSupabaseConfigured && supabase) {
      try { await supabase.from("skills").upsert(updated); } catch (err) { console.error(err); }
    }
  };

  const updateSocialLinks = async (updated: SocialLink[]) => {
    setSocialLinks(updated);
    setLastSaved(Date.now());
    try { localStorage.setItem(STORAGE_KEYS.SOCIALS, JSON.stringify(updated)); } catch {}
    broadcastDataChange(STORAGE_KEYS.SOCIALS, updated);

    if (isSupabaseConfigured && supabase) {
      try { await supabase.from("social_links").upsert(updated); } catch (err) { console.error(err); }
    }
  };

  const updateSettings = async (data: Partial<SiteSettings>) => {
    const updated = { ...settings, ...data };
    setSettings(updated);
    setLastSaved(Date.now());
    try { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated)); } catch {}
    broadcastDataChange(STORAGE_KEYS.SETTINGS, updated);

    if (isSupabaseConfigured && supabase) {
      try { await supabase.from("site_settings").upsert(settingsToDb(updated)); } catch (err) { console.error(err); }
    }
  };

  const resetToDefaults = () => {
    setHero(INITIAL_HERO);
    setProjects(INITIAL_PROJECTS);
    setExperiences(INITIAL_EXPERIENCES);
    setEducation(INITIAL_EDUCATION);
    setServices(INITIAL_SERVICES);
    setSkills(INITIAL_SKILL_CATEGORIES);
    setSocialLinks(INITIAL_SOCIAL_LINKS);
    setSettings(INITIAL_SETTINGS);
    setLastSaved(Date.now());
    Object.values(STORAGE_KEYS).forEach((k) => { try { localStorage.removeItem(k); } catch {} });
  };

  return (
    <DataContext.Provider
      value={{
        hero, updateHero,
        projects, addProject, updateProject, deleteProject,
        experiences, updateExperiences,
        education, updateEducation,
        services, updateServices,
        skills, updateSkills,
        socialLinks, updateSocialLinks,
        settings, updateSettings,
        resetToDefaults,
        isLiveDb,
        lastSaved,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
