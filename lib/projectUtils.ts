export type ProjectCategoryKey = 'web' | 'mobile' | 'ai' | 'design' | 'game';

export function getProjectThumbnail(
  project?: {
    heroImage?: string;
    thumbnailUrl?: string;
    slug?: string;
    id?: string;
    title?: string;
  } | null
): string {
  if (!project) return "/images/projects/edu51_real.jpeg";

  const raw = (project.heroImage || project.thumbnailUrl || "").trim();

  // If it's a valid custom URL that is not a placeholder
  if (
    raw &&
    raw !== "/images/background_ref.png" &&
    raw !== "/images/pfp.png" &&
    raw !== "/images/bg_static_desktop.jpg"
  ) {
    return raw;
  }

  // Intelligently map by slug, id, or title keywords
  const text = `${project.slug || ""} ${project.id || ""} ${project.title || ""}`.toLowerCase();

  if (text.includes("mikasa")) return "/images/projects/mikasa.jpg";
  if (text.includes("opusgen")) return "/images/projects/opusgen.jpg";
  if (text.includes("mutebd")) return "/images/projects/mutebd.jpg";
  if (text.includes("escape")) return "/images/projects/escaperoom.jpg";
  if (text.includes("prince")) return "/images/projects/prince.jpg";
  if (text.includes("pawfect")) return "/images/projects/pawfect.jpg";
  if (text.includes("edu51portal") || text.includes("bubt")) return "/images/projects/edu51_bubt_real.png";
  if (text.includes("edu51")) return "/images/projects/edu51_real.jpeg";

  return raw || "/images/projects/edu51_real.jpeg";
}

export function normalizeProjectCategory(
  rawCategory?: string,
  slug?: string,
  title?: string
): { category: ProjectCategoryKey; categoryLabel: string } {
  const text = `${rawCategory || ""} ${slug || ""} ${title || ""}`.toLowerCase();

  let category: ProjectCategoryKey = "web";

  if (
    text.includes("ai") ||
    text.includes("diffusion") ||
    text.includes("audio") ||
    text.includes("spectrogram") ||
    text.includes("opusgen") ||
    text.includes("mikasa") ||
    text.includes("n8n")
  ) {
    category = "ai";
  } else if (
    text.includes("game") ||
    text.includes("graphics") ||
    text.includes("opengl") ||
    text.includes("escape")
  ) {
    category = "game";
  } else if (
    text.includes("mobile") ||
    text.includes("android") ||
    text.includes("kotlin") ||
    text.includes("pawfect")
  ) {
    category = "mobile";
  } else if (text.includes("design") || text.includes("figma") || text.includes("ui/ux")) {
    category = "design";
  } else {
    category = "web";
  }

  // If rawCategory was already one of the short keys
  if (
    rawCategory === "web" ||
    rawCategory === "mobile" ||
    rawCategory === "ai" ||
    rawCategory === "game" ||
    rawCategory === "design"
  ) {
    category = rawCategory as ProjectCategoryKey;
  }

  // Preserve human readable label
  let categoryLabel = rawCategory && rawCategory.length > 3 ? rawCategory : "";
  if (!categoryLabel) {
    switch (category) {
      case "web":
        categoryLabel = "Web Application";
        break;
      case "mobile":
        categoryLabel = "Mobile App";
        break;
      case "ai":
        categoryLabel = "AI & Tools";
        break;
      case "game":
        categoryLabel = "Graphics / C";
        break;
      case "design":
        categoryLabel = "UI/UX Design";
        break;
      default:
        categoryLabel = "Web Application";
    }
  }

  return { category, categoryLabel };
}

export function matchProjectCategory(
  project: { category?: string; categoryLabel?: string; slug?: string; title?: string },
  catId: string
): boolean {
  if (catId === "all") return true;

  const normalized = normalizeProjectCategory(project.category, project.slug, project.title);
  if (normalized.category === catId) return true;

  const text = `${project.category || ""} ${project.categoryLabel || ""} ${project.slug || ""} ${project.title || ""}`.toLowerCase();

  if (catId === "web") {
    return (
      text.includes("web") ||
      text.includes("academic") ||
      text.includes("edu51") ||
      text.includes("portfolio") ||
      text.includes("commerce") ||
      text.includes("full-stack")
    );
  }
  if (catId === "mobile") {
    return (
      text.includes("mobile") ||
      text.includes("android") ||
      text.includes("kotlin") ||
      text.includes("pawfect") ||
      text.includes("mutebd")
    );
  }
  if (catId === "ai") {
    return (
      text.includes("ai") ||
      text.includes("opusgen") ||
      text.includes("audio") ||
      text.includes("creative tech") ||
      text.includes("mikasa") ||
      text.includes("n8n") ||
      text.includes("automation")
    );
  }
  if (catId === "game") {
    return (
      text.includes("game") ||
      text.includes("graphics") ||
      text.includes("opengl") ||
      text.includes("escape")
    );
  }

  return false;
}

export function normalizeProjectLiveUrl(
  url?: string | null,
  slug?: string,
  title?: string
): string | undefined {
  const raw = (url || "").trim();
  const text = `${raw} ${slug || ""} ${title || ""}`.toLowerCase();

  // If this is Mikasa, ensure canonical domain is https://mikasa.mrswapnil.me/
  if (text.includes("mikasa")) {
    return "https://mikasa.mrswapnil.me/";
  }

  // If this is OpusGen, ensure canonical domain is https://www.opusgenai.com/
  if (text.includes("opusgen")) {
    if (!raw || raw.includes("opusgen.ai") || raw.includes("opusgenai.com")) {
      return "https://www.opusgenai.com/";
    }
  }

  // If this is Prince, ensure canonical domain is https://www.sbprince.com/
  if (text.includes("prince")) {
    if (!raw || raw.includes("princeagrotech") || raw.includes("sbprince.com") || raw.includes("prince")) {
      return "https://www.sbprince.com/";
    }
  }

  return raw || undefined;
}

export function sanitizeProjectData<T extends {
  title?: string;
  subtitle?: string;
  shortDescription?: string;
  fullDescription?: string;
  liveUrl?: string;
  githubUrl?: string;
  category?: any;
  categoryLabel?: string;
  technologies?: string[];
  heroImage?: string;
  gallery?: string[];
  slug?: string;
  id?: string;
}>(proj: T): T {
  const text = `${proj.slug || ""} ${proj.title || ""} ${proj.id || ""}`.toLowerCase();

  if (text.includes("mikasa")) {
    return {
      ...proj,
      liveUrl: "https://mikasa.mrswapnil.me/",
      githubUrl: "https://github.com/Swapnil-360/personal-ai-assistant",
      heroImage: "/images/projects/mikasa.jpg",
      gallery: ["/images/projects/mikasa.jpg", "/images/projects/mikasa_logo.jpg"],
    };
  }

  if (text.includes("prince")) {
    const isStaleAgro =
      text.includes("agro") ||
      (proj.liveUrl && proj.liveUrl.includes("princeagrotech")) ||
      (proj.fullDescription && proj.fullDescription.toLowerCase().includes("agritech"));

    return {
      ...proj,
      title: isStaleAgro || proj.title === "Portfolio for Prince" || !proj.title
        ? "Prince - Digital Marketing & Web Expert Portfolio"
        : proj.title,
      subtitle: isStaleAgro || !proj.subtitle
        ? "High-Conversion Client Portfolio & Personal Branding Platform"
        : proj.subtitle,
      shortDescription: isStaleAgro || !proj.shortDescription
        ? "Prince Varman - Expert in crypto project support, digital marketing, web development, and creative design. Professional bespoke client portfolio engineered with high-conversion visual design."
        : proj.shortDescription,
      fullDescription: isStaleAgro || !proj.fullDescription
        ? "Prince Varman - Expert in crypto project support, digital marketing, web development, and creative design. Professional portfolio showcasing premium services, marketing funnels, and successful client projects. Engineered with precision micro-interactions, responsive typography, and blazing fast performance to drive client conversions."
        : proj.fullDescription,
      liveUrl: "https://www.sbprince.com/",
      githubUrl: !proj.githubUrl || proj.githubUrl === "https://github.com/Swapnil-360"
        ? "https://github.com/Swapnil-360/Myself_Prince.git"
        : proj.githubUrl,
      category: "web",
      categoryLabel: "Client Web Experience",
      heroImage: "/images/projects/prince.jpg",
      technologies: isStaleAgro || !proj.technologies || proj.technologies.includes("MQTT")
        ? ["React", "JavaScript", "Tailwind CSS", "Web Development", "Crypto Marketing"]
        : proj.technologies,
      gallery: isStaleAgro || !proj.gallery || proj.gallery.length === 0
        ? ["/images/projects/prince.jpg", "/images/projects/prince_real.png"]
        : proj.gallery,
    };
  }

  if (text.includes("opusgen")) {
    return {
      ...proj,
      liveUrl: "https://www.opusgenai.com/",
      heroImage: "/images/projects/opusgen.jpg",
    };
  }

  return proj;
}
