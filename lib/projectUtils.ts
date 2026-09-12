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
