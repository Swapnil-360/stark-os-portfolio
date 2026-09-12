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
    text.includes("opusgen")
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
      text.includes("creative tech")
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
