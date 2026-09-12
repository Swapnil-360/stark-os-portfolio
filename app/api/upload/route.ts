import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";
    const customName = formData.get("name") as string | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Build sanitized filename
    const { extname, basename } = await import("path").then((m) => ({
      extname: m.extname,
      basename: m.basename,
    }));
    const originalName = file.name || "upload.bin";
    const ext = extname(originalName).toLowerCase();
    const baseName = basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const timestamp = Date.now();
    const sanitizedFilename = customName
      ? `${customName.replace(/[^a-zA-Z0-9_-]/g, "_")}${ext}`
      : `${baseName}_${timestamp}${ext}`;

    // ── 1. Try Supabase Storage first (works on Vercel serverless) ──────────
    if (isSupabaseConfigured && supabase) {
      try {
        const bucketName = folder === "videos" ? "videos" : "portfolio-media";
        const storagePath = `${folder}/${sanitizedFilename}`;

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(storagePath, buffer, {
            contentType: file.type || "application/octet-stream",
            upsert: true,
          });

        if (uploadError) {
          console.error("Supabase storage upload error:", uploadError.message);
          throw new Error(uploadError.message);
        }

        const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(storagePath);
        if (!urlData?.publicUrl) throw new Error("Could not get public URL from Supabase");

        return NextResponse.json({
          success: true,
          url: urlData.publicUrl,
          filename: sanitizedFilename,
          originalName,
          size: file.size,
          type: file.type,
          storage: "supabase",
        });
      } catch (storageErr: any) {
        console.error("Supabase storage failed, trying local fallback:", storageErr.message);
      }
    }

    // ── 2. Local filesystem fallback (dev only — read-only on Vercel) ────────
    try {
      const { writeFile, mkdir } = await import("fs/promises");
      const path = await import("path");
      const targetDir = path.join(process.cwd(), "public", "uploads", folder);
      await mkdir(targetDir, { recursive: true });
      const filePath = path.join(targetDir, sanitizedFilename);
      await writeFile(filePath, buffer);

      // Mirror resume.pdf for direct /resume.pdf access
      if (folder === "resumes" && (ext === ".pdf" || file.type === "application/pdf")) {
        try {
          const defaultResumePath = path.join(process.cwd(), "public", "resume.pdf");
          await writeFile(defaultResumePath, buffer);
        } catch {}
      }

      const publicUrl = `/uploads/${folder}/${sanitizedFilename}`;
      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename: sanitizedFilename,
        originalName,
        size: file.size,
        type: file.type,
        storage: "local",
      });
    } catch (fsErr: any) {
      console.error("Local filesystem write failed (expected on Vercel):", fsErr.message);
    }

    // ── 3. If both fail, return error ────────────────────────────────────────
    return NextResponse.json(
      {
        success: false,
        error:
          "Upload failed: Supabase Storage is not configured or unavailable. " +
          "Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set, " +
          "and run the schema SQL to create storage buckets.",
      },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process file upload" },
      { status: 500 }
    );
  }
}
