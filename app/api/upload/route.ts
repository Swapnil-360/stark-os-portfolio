import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";
    const customName = formData.get("name") as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const originalName = file.name || "upload.bin";
    const ext = path.extname(originalName).toLowerCase();
    const baseName = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    const timestamp = Date.now();
    const sanitizedFilename = customName
      ? `${customName.replace(/[^a-zA-Z0-9_-]/g, "_")}${ext}`
      : `${baseName}_${timestamp}${ext}`;

    let publicUrl = `/uploads/${folder}/${sanitizedFilename}`;

    // Optional local storage fallback (for local development)
    try {
      const targetDir = path.join(process.cwd(), "public", "uploads", folder);
      await mkdir(targetDir, { recursive: true });
      const filePath = path.join(targetDir, sanitizedFilename);
      await writeFile(filePath, buffer);

      // If uploading a resume/CV, also save a copy to public/resume.pdf so /resume.pdf is always active locally
      if (folder === "resumes" && (ext === ".pdf" || file.type === "application/pdf")) {
        try {
          const defaultResumePath = path.join(process.cwd(), "public", "resume.pdf");
          await writeFile(defaultResumePath, buffer);
        } catch {}
      }
    } catch (fsErr) {
      // Running in Vercel serverless environment where filesystem is read-only
      console.log("Local filesystem write bypassed in serverless environment:", fsErr);
    }

    // Try Supabase Storage if configured
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

        if (!uploadError) {
          const { data } = supabase.storage.from(bucketName).getPublicUrl(storagePath);
          if (data?.publicUrl) {
            publicUrl = data.publicUrl;
          }
        }
      } catch (storageErr) {
        console.warn("Supabase storage upload skipped or failed, using local public URL:", storageErr);
      }
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: sanitizedFilename,
      originalName,
      size: file.size,
      type: file.type,
    });
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process file upload",
      },
      { status: 500 }
    );
  }
}
