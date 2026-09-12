import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export interface UploadOptions {
  folder?: "videos" | "images" | "resumes" | "projects" | "backgrounds" | string;
  name?: string;
}

export interface UploadResult {
  success: boolean;
  url: string;
  filename: string;
  storage: "supabase" | "local";
  size?: number;
}

/**
 * Uploads a file directly to Supabase Storage if configured (bypassing Vercel's 4.5MB serverless limit),
 * with a fallback to the /api/upload route handler.
 */
export async function uploadFile(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const folder = options.folder || "uploads";
  const bucketName = folder === "videos" ? "videos" : "portfolio-media";

  // Sanitize filename
  const originalName = file.name || "file.bin";
  const dotIndex = originalName.lastIndexOf(".");
  const ext = dotIndex !== -1 ? originalName.slice(dotIndex).toLowerCase() : "";
  const rawBase =
    options.name || (dotIndex !== -1 ? originalName.slice(0, dotIndex) : originalName);
  const cleanBase = rawBase.replace(/[^a-zA-Z0-9_-]/g, "_");
  const timestamp = Date.now();
  const sanitizedFilename = `${cleanBase}_${timestamp}${ext}`;
  const storagePath = `${folder}/${sanitizedFilename}`;

  // 1. Direct browser-to-Supabase upload (bypasses Vercel 4.5MB payload limit)
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(storagePath, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type || "application/octet-stream",
        });

      if (error) {
        console.warn(
          `Direct Supabase upload to '${bucketName}' returned error:`,
          error.message,
          "- trying fallback..."
        );
      } else if (data) {
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(storagePath);

        if (urlData?.publicUrl) {
          return {
            success: true,
            url: urlData.publicUrl,
            filename: sanitizedFilename,
            storage: "supabase",
            size: file.size,
          };
        }
      }
    } catch (directErr: any) {
      console.warn("Direct upload exception:", directErr?.message);
    }
  }

  // 2. Server API fallback
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  if (options.name) {
    formData.append("name", options.name);
  }

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const rawText = await res.text();
  let json: any = null;

  try {
    json = JSON.parse(rawText);
  } catch {
    if (
      res.status === 413 ||
      rawText.toLowerCase().includes("entity too large") ||
      rawText.toLowerCase().includes("payload too large")
    ) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      throw new Error(
        `File size (${sizeMb} MB) exceeds server limit. Please check Supabase Storage connection in .env.local to enable direct cloud uploads.`
      );
    }
    throw new Error(
      `Upload failed (HTTP ${res.status}): ${rawText.slice(0, 150)}`
    );
  }

  if (!res.ok || !json?.success) {
    throw new Error(json?.error || `Upload failed with status ${res.status}`);
  }

  return {
    success: true,
    url: json.url,
    filename: json.filename || sanitizedFilename,
    storage: json.storage || "local",
    size: file.size,
  };
}
