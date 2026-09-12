"use client";

import React, { useState, useEffect, useRef } from "react";
import { useData } from "@/context/DataContext";
import { SiteSettings } from "@/types/portfolio";
import {
  Settings,
  Check,
  AlertTriangle,
  RotateCcw,
  FileText,
  Upload,
  Download,
  CheckCircle2,
  ExternalLink,
  Shield,
} from "lucide-react";

export default function AdminSettingsPage() {
  const { settings, updateSettings, hero, updateHero, resetToDefaults } = useData();
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [saved, setSaved] = useState(false);

  // Resume / CV upload state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [cvStatus, setCvStatus] = useState<string>("");
  const cvInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    setFormData(updated);
    updateSettings(updated); // IMMEDIATE AUTO-SAVE
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // CV / Resume File Upload Handler
  const handleCvUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      setCvStatus("Please select a CV or resume file (.pdf, .doc, .docx)");
      return;
    }

    setUploadingCv(true);
    setCvStatus("Uploading CV to cloud & portfolio directory...");

    try {
      const data = new FormData();
      data.append("file", resumeFile);
      data.append("folder", "resumes");
      data.append("name", "swapnil_resume");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "CV upload failed");
      }

      const newResumeUrl = json.url || "/resume.pdf";

      // Update both settings and hero resumeUrl
      const updatedSettings = { ...formData, resumeUrl: newResumeUrl };
      setFormData(updatedSettings);
      await updateSettings(updatedSettings);
      await updateHero({ resumeUrl: newResumeUrl });

      setResumeFile(null);
      if (cvInputRef.current) cvInputRef.current.value = "";
      setCvStatus("CV successfully uploaded! 'Download Resume' on landing page now serves this file.");
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setCvStatus("");
      }, 5000);
    } catch (err: any) {
      console.error("CV upload error:", err);
      setCvStatus("Upload error: " + (err.message || "Failed to upload CV"));
    } finally {
      setUploadingCv(false);
    }
  };

  const handleReset = () => {
    if (confirm("Reset all customizations back to factory portfolio defaults?")) {
      resetToDefaults();
    }
  };

  const activeResumeUrl = formData.resumeUrl || hero.resumeUrl || "/resume.pdf";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            System Settings, Access & CV Deployment
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your downloadable resume, global telemetry coordinates, security email, and contact endpoints.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-semibold shadow transition-all cursor-pointer"
        >
          {saved ? <Check className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
          <span>{saved ? "Settings Saved!" : "Save System Config"}</span>
        </button>
      </div>

      {/* CV / Resume Upload Section */}
      <div className="p-6 bg-[#11141c] border border-slate-800 rounded-lg space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <FileText className="w-4 h-4 text-red-500" />
            <span>CV / Resume Live Deployment Manager</span>
          </div>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active on Landing Page</span>
          </span>
        </div>

        <p className="text-xs text-slate-400 font-mono">
          Upload your latest PDF CV/resume here. When visitors click <strong>&quot;Download Resume ↓&quot;</strong> on the landing page, they will automatically download this file.
        </p>

        <div className="grid md:grid-cols-12 gap-6 items-center">
          {/* Upload Form (7 Cols) */}
          <form onSubmit={handleCvUpload} className="md:col-span-7 p-4 bg-[#0a0c10] border border-slate-800 rounded-lg space-y-3">
            <div className="space-y-1 text-xs font-mono">
              <label className="text-slate-400 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-red-400" />
                <span>Select New CV Document (.pdf, .doc, .docx)</span>
              </label>
              <input
                type="file"
                ref={cvInputRef}
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setResumeFile(e.target.files[0]);
                  }
                }}
                className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-500 cursor-pointer"
              />
            </div>

            {cvStatus && (
              <div className={`p-2.5 rounded text-xs font-mono flex items-center gap-2 ${
                cvStatus.includes("error") || cvStatus.includes("Error")
                  ? "bg-red-950/80 border border-red-800 text-red-300"
                  : "bg-emerald-950/80 border border-emerald-800 text-emerald-300"
              }`}>
                {cvStatus.includes("error") ? (
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>{cvStatus}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={uploadingCv || !resumeFile}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition shadow cursor-pointer disabled:cursor-not-allowed"
            >
              {uploadingCv ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Uploading & Syncing CV...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload & Publish CV</span>
                </>
              )}
            </button>
          </form>

          {/* Current Active File Info (5 Cols) */}
          <div className="md:col-span-5 p-4 bg-[#0a0c10] border border-slate-800 rounded-lg space-y-3 font-mono text-xs">
            <div className="text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
              Current Live Resume Link:
            </div>
            <div className="p-2.5 bg-[#11141c] border border-slate-800 rounded text-slate-300 break-all text-[11px]">
              {activeResumeUrl}
            </div>
            <div className="pt-1 flex gap-2">
              <a
                href={activeResumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded text-center text-xs flex items-center justify-center gap-1.5 transition"
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                <span>Test Live CV</span>
              </a>
              <a
                href={activeResumeUrl}
                download="Swapnil_Resume.pdf"
                className="py-2 px-3 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 rounded text-xs flex items-center justify-center gap-1 transition"
                title="Download file"
              >
                <Download className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-6 text-xs font-mono">
        <div className="p-6 bg-[#11141c] border border-slate-800 rounded-lg space-y-4">
          <div className="text-sm font-bold text-white font-sans border-b border-slate-800 pb-2">
            Identity & Telemetry
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400">Author Name</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400">Availability Indicator</label>
            <input
              type="text"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400">Base Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400">HUD Coordinates</label>
            <input
              type="text"
              name="coordinates"
              value={formData.coordinates}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="p-6 bg-[#11141c] border border-slate-800 rounded-lg space-y-4">
          <div className="text-sm font-bold text-white font-sans border-b border-slate-800 pb-2">
            Inbound Transmission & Security Clearance
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-red-400" />
              <span>Authorized Admin Email (Restricted to this email)</span>
            </label>
            <input
              type="email"
              name="adminEmail"
              value={formData.adminEmail || "miftahurr503@gmail.com"}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#0a0c10] border border-red-900/50 rounded text-red-200 focus:border-red-500 focus:outline-none font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400">Public Inbound Contact Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400">WhatsApp Dispatch Number</label>
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400">System Version Tag</label>
            <input
              type="text"
              name="systemVersion"
              value={formData.systemVersion}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="p-6 bg-red-950/20 border border-red-900/40 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-bold text-white">Reset Local Customizations</div>
            <div className="text-xs text-slate-400 mt-0.5">
              Restores original pre-seeded data from Swapnil&apos;s verified portfolio.
            </div>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-red-900/40 hover:bg-red-800/60 border border-red-700 text-red-300 rounded text-xs font-mono transition-colors self-start sm:self-center cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Defaults</span>
        </button>
      </div>
    </div>
  );
}
