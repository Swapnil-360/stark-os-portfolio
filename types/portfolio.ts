export type ThemeId = 'obsidian-red' | 'arctic' | 'stealth' | 'void' | 'monochrome';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  subtitle: string;
  accent: string;
  accentHover: string;
  accentGlow: string;
  accentSecondary: string;
  accentSubtle: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceGlass: string;
  foreground: string;
  muted: string;
  borderHud: string;
  borderHudBright: string;
  gridHud: string;
}

export interface BackgroundVideo {
  id: string;
  name: string;
  url: string;
  poster?: string;
  deviceType?: 'desktop' | 'mobile' | 'all';
}

export interface HeroConfig {
  label: string;
  name: string;
  fullName?: string;
  roleHeadline?: string;
  subtitle: string;
  description: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
  portraitUrl: string;
  videoUrl: string;
  posterUrl: string;
  mobileFallbackUrl: string;
  videoEnabled: boolean;
  videoSpeed: number;
  overlayOpacity: number;
  blurAmount: number;
  locationLabel: string;
  statusBadge: string;
  backgroundVideos?: BackgroundVideo[];
  selectedVideoId?: string;
  resumeUrl?: string;
  staticDesktopBg?: string;
  staticMobileBg?: string;
  mobileVideoUrl?: string;
  mobileBackgroundVideos?: BackgroundVideo[];
  selectedMobileVideoId?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: 'web' | 'mobile' | 'ai' | 'design' | 'game';
  categoryLabel: string;
  shortDescription: string;
  fullDescription: string;
  problem?: string;
  solution?: string;
  role: string;
  status: 'Live' | 'In Development' | 'Completed' | 'Concept';
  heroImage: string;
  gallery: string[];
  technologies: string[];
  liveUrl?: string;
  secondaryLiveUrl?: string;
  secondaryLiveLabel?: string;
  githubUrl?: string;
  featured: boolean;
  displayOrder: number;
  year: string;
  keyFeatures?: string[];
  challenges?: string;
  outcome?: string;
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  period: string;
  startDate: string;
  endDate: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  isCurrent: boolean;
  badge?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  location: string;
  description: string;
  coursework: string[];
  researchInterests: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: string;
  tags: string[];
}

export interface SkillCategory {
  category: string;
  skills: {
    name: string;
    level?: string;
    icon?: string;
    highlight?: boolean;
  }[];
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  label: string;
  highlight?: boolean;
}

export interface SiteSettings {
  title: string;
  description: string;
  author: string;
  availability: string;
  email: string;
  whatsapp: string;
  location: string;
  systemVersion: string;
  buildYear: string;
  coordinates: string;
  adminEmail?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  resumeUrl?: string;
}
