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
  HERO: "swapnil_hero_data_v6",
  PROJECTS: "swapnil_projects_data_v5",
  EXPERIENCES: "swapnil_experiences_data_v3",
  EDUCATION: "swapnil_education_data_v3",
  SERVICES: "swapnil_services_data_v3",
  SKILLS: "swapnil_skills_data_v3",
  SOCIALS: "swapnil_socials_data_v4",
  SETTINGS: "swapnil_settings_data_v4",
};

// Helper to broadcast changes immediately to all open tabs and components
function broadcastDataChange(key: string, data: any) {
  if (typeof window !== "undefined") {
    // 1. Same-window custom event
    try {
      window.dispatchEvent(new CustomEvent("swapnil_local_sync", { detail: { key, data } }));
    } catch {}

    // 2. Cross-tab BroadcastChannel
    try {
      const channel = new BroadcastChannel("swapnil_portfolio_channel_v4");
      channel.postMessage({ key, data });
      channel.close();
    } catch {}
  }
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [hero, setHero] = useState<HeroConfig>(INITIAL_HERO);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [experiences, setExperiences] = useState<Experience[]>(INITIAL_EXPERIENCES);
  const [education, setEducation] = useState<Education>(INITIAL_EDUCATION);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [skills, setSkills] = useState<SkillCategory[]>(INITIAL_SKILL_CATEGORIES);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(INITIAL_SOCIAL_LINKS);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [isLiveDb, setIsLiveDb] = useState<boolean>(isSupabaseConfigured);
  const [lastSaved, setLastSaved] = useState<number>(Date.now());

  // Load initial data from Supabase or localStorage
  useEffect(() => {
    async function loadData() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: heroData } = await supabase.from("hero_config").select("*").single();
          if (heroData) {
            setHero({
              ...INITIAL_HERO,
              ...heroData,
              staticDesktopBg: heroData.staticDesktopBg || INITIAL_HERO.staticDesktopBg,
              staticMobileBg: heroData.staticMobileBg || INITIAL_HERO.staticMobileBg,
              mobileVideoUrl: heroData.mobileVideoUrl || INITIAL_HERO.mobileVideoUrl,
              mobileBackgroundVideos: heroData.mobileBackgroundVideos || INITIAL_HERO.mobileBackgroundVideos,
              selectedMobileVideoId: heroData.selectedMobileVideoId || INITIAL_HERO.selectedMobileVideoId,
            });
          }

          const { data: projData } = await supabase.from("projects").select("*").order("displayOrder", { ascending: true });
          if (projData && projData.length > 0) setProjects(projData);

          const { data: expData } = await supabase.from("experiences").select("*");
          if (expData && expData.length > 0) setExperiences(expData);

          const { data: eduData } = await supabase.from("education").select("*").single();
          if (eduData) setEducation(eduData);

          const { data: srvData } = await supabase.from("services").select("*");
          if (srvData && srvData.length > 0) setServices(srvData);

          const { data: sklData } = await supabase.from("skills").select("*");
          if (sklData && sklData.length > 0) setSkills(sklData);

          const { data: socData } = await supabase.from("social_links").select("*");
          if (socData && socData.length > 0) setSocialLinks(socData);

          const { data: settsData } = await supabase.from("site_settings").select("*").single();
          if (settsData) setSettings(settsData);

          setIsLiveDb(true);
          return;
        } catch (err) {
          console.warn("Supabase fetch failed, falling back to local store:", err);
          setIsLiveDb(false);
        }
      }

      // Local storage fallback
      try {
        const storedHero = localStorage.getItem(STORAGE_KEYS.HERO);
        if (storedHero) {
          const parsed = JSON.parse(storedHero);
          setHero({
            ...INITIAL_HERO,
            ...parsed,
            staticDesktopBg: parsed.staticDesktopBg || INITIAL_HERO.staticDesktopBg,
            staticMobileBg: parsed.staticMobileBg || INITIAL_HERO.staticMobileBg,
            mobileVideoUrl: parsed.mobileVideoUrl || INITIAL_HERO.mobileVideoUrl,
            mobileBackgroundVideos: parsed.mobileBackgroundVideos || INITIAL_HERO.mobileBackgroundVideos,
            selectedMobileVideoId: parsed.selectedMobileVideoId || INITIAL_HERO.selectedMobileVideoId,
          });
        }

        const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
        if (storedProjects) setProjects(JSON.parse(storedProjects));

        const storedExp = localStorage.getItem(STORAGE_KEYS.EXPERIENCES);
        if (storedExp) setExperiences(JSON.parse(storedExp));

        const storedEdu = localStorage.getItem(STORAGE_KEYS.EDUCATION);
        if (storedEdu) setEducation(JSON.parse(storedEdu));

        const storedSrv = localStorage.getItem(STORAGE_KEYS.SERVICES);
        if (storedSrv) setServices(JSON.parse(storedSrv));

        const storedSkills = localStorage.getItem(STORAGE_KEYS.SKILLS);
        if (storedSkills) setSkills(JSON.parse(storedSkills));

        const storedSocials = localStorage.getItem(STORAGE_KEYS.SOCIALS);
        if (storedSocials) setSocialLinks(JSON.parse(storedSocials));

        const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (storedSettings) setSettings(JSON.parse(storedSettings));
      } catch (e) {
        console.error("Local storage load error:", e);
      }
    }

    loadData();
  }, []);

  // Real-time inter-tab & cross-window synchronization listener
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleSync = (key: string, data: any) => {
      if (!data) return;
      setLastSaved(Date.now());
      switch (key) {
        case STORAGE_KEYS.HERO:
          setHero(data);
          break;
        case STORAGE_KEYS.PROJECTS:
          setProjects(data);
          break;
        case STORAGE_KEYS.EXPERIENCES:
          setExperiences(data);
          break;
        case STORAGE_KEYS.EDUCATION:
          setEducation(data);
          break;
        case STORAGE_KEYS.SERVICES:
          setServices(data);
          break;
        case STORAGE_KEYS.SKILLS:
          setSkills(data);
          break;
        case STORAGE_KEYS.SOCIALS:
          setSocialLinks(data);
          break;
        case STORAGE_KEYS.SETTINGS:
          setSettings(data);
          break;
      }
    };

    // 1. Storage event listener (across browser tabs)
    const onStorage = (e: StorageEvent) => {
      if (e.key && e.newValue) {
        try {
          handleSync(e.key, JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);

    // 2. Custom local event listener (same-window instant update)
    const onLocal = (e: Event) => {
      const custom = e as CustomEvent<{ key: string; data: any }>;
      if (custom.detail) {
        handleSync(custom.detail.key, custom.detail.data);
      }
    };
    window.addEventListener("swapnil_local_sync", onLocal);

    // 3. BroadcastChannel listener (inter-tab zero-latency messaging)
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("swapnil_portfolio_channel_v4");
      channel.onmessage = (e) => {
        if (e.data && e.data.key) {
          handleSync(e.data.key, e.data.data);
        }
      };
    } catch {}

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("swapnil_local_sync", onLocal);
      if (channel) channel.close();
    };
  }, []);

  const updateHero = async (data: Partial<HeroConfig>) => {
    const updated = { ...hero, ...data };
    setHero(updated);
    setLastSaved(Date.now());
    localStorage.setItem(STORAGE_KEYS.HERO, JSON.stringify(updated));
    broadcastDataChange(STORAGE_KEYS.HERO, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("hero_config").upsert(updated);
      } catch (err) {
        console.error("Supabase hero update error:", err);
      }
    }
  };

  const addProject = async (projectData: Omit<Project, "id">) => {
    const newProject: Project = {
      ...projectData,
      id: "proj-" + Date.now(),
    };
    const updated = [newProject, ...projects];
    setProjects(updated);
    setLastSaved(Date.now());
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
    broadcastDataChange(STORAGE_KEYS.PROJECTS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("projects").insert(newProject);
      } catch (err) {
        console.error("Supabase add project error:", err);
      }
    }
  };

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    const updated = projects.map((p) => (p.id === id ? { ...p, ...projectData } : p));
    setProjects(updated);
    setLastSaved(Date.now());
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
    broadcastDataChange(STORAGE_KEYS.PROJECTS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("projects").update(projectData).eq("id", id);
      } catch (err) {
        console.error("Supabase update project error:", err);
      }
    }
  };

  const deleteProject = async (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    setLastSaved(Date.now());
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
    broadcastDataChange(STORAGE_KEYS.PROJECTS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("projects").delete().eq("id", id);
      } catch (err) {
        console.error("Supabase delete project error:", err);
      }
    }
  };

  const updateExperiences = async (updated: Experience[]) => {
    setExperiences(updated);
    setLastSaved(Date.now());
    localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(updated));
    broadcastDataChange(STORAGE_KEYS.EXPERIENCES, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("experiences").upsert(updated);
      } catch (err) {
        console.error("Supabase experiences update error:", err);
      }
    }
  };

  const updateEducation = async (updated: Education) => {
    setEducation(updated);
    setLastSaved(Date.now());
    localStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(updated));
    broadcastDataChange(STORAGE_KEYS.EDUCATION, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("education").upsert({ ...updated, id: "default_education" });
      } catch (err) {
        console.error("Supabase education update error:", err);
      }
    }
  };

  const updateServices = async (updated: Service[]) => {
    setServices(updated);
    setLastSaved(Date.now());
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated));
    broadcastDataChange(STORAGE_KEYS.SERVICES, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("services").upsert(updated);
      } catch (err) {
        console.error("Supabase services update error:", err);
      }
    }
  };

  const updateSkills = async (updated: SkillCategory[]) => {
    setSkills(updated);
    setLastSaved(Date.now());
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(updated));
    broadcastDataChange(STORAGE_KEYS.SKILLS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("skills").upsert(updated);
      } catch (err) {
        console.error("Supabase skills update error:", err);
      }
    }
  };

  const updateSocialLinks = async (updated: SocialLink[]) => {
    setSocialLinks(updated);
    setLastSaved(Date.now());
    localStorage.setItem(STORAGE_KEYS.SOCIALS, JSON.stringify(updated));
    broadcastDataChange(STORAGE_KEYS.SOCIALS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("social_links").upsert(updated);
      } catch (err) {
        console.error("Supabase social links update error:", err);
      }
    }
  };

  const updateSettings = async (data: Partial<SiteSettings>) => {
    const updated = { ...settings, ...data };
    setSettings(updated);
    setLastSaved(Date.now());
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    broadcastDataChange(STORAGE_KEYS.SETTINGS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("site_settings").upsert({ ...updated, id: "default_settings" });
      } catch (err) {
        console.error("Supabase settings update error:", err);
      }
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

    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    Object.keys(STORAGE_KEYS).forEach((k) => broadcastDataChange(STORAGE_KEYS[k as keyof typeof STORAGE_KEYS], null));
  };

  return (
    <DataContext.Provider
      value={{
        hero,
        updateHero,
        projects,
        addProject,
        updateProject,
        deleteProject,
        experiences,
        updateExperiences,
        education,
        updateEducation,
        services,
        updateServices,
        skills,
        updateSkills,
        socialLinks,
        updateSocialLinks,
        settings,
        updateSettings,
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
