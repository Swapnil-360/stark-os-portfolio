"use client";

import React, { useState, useEffect, useRef } from "react";
import { useData } from "@/context/DataContext";
import { HeroConfig, BackgroundVideo } from "@/types/portfolio";
import { uploadFile } from "@/lib/upload";
import {
  Video,
  Check,
  Eye,
  Sliders,
  Image as ImageIcon,
  Sparkles,
  Upload,
  Trash2,
  Play,
  CheckCircle2,
  AlertCircle,
  FileVideo,
  Smartphone,
} from "lucide-react";

export default function AdminHeroPage() {
  const { hero, updateHero, lastSaved } = useData();
  const [formData, setFormData] = useState<HeroConfig>(hero);
  const [isSavedRecently, setIsSavedRecently] = useState(false);
  const [previewMode, setPreviewMode] = useState<"video" | "mobile-video" | "desktop-static" | "mobile-static">("video");

  // Desktop Video upload states
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoName, setVideoName] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Mobile Video upload states (9:16 Vertical Ratio)
  const [mobileVideoFile, setMobileVideoFile] = useState<File | null>(null);
  const [mobileVideoName, setMobileVideoName] = useState<string>("");
  const [mobileUploading, setMobileUploading] = useState<boolean>(false);
  const [mobileUploadStatus, setMobileUploadStatus] = useState<string>("");
  const mobileFileInputRef = useRef<HTMLInputElement | null>(null);

  // Synchronize local form with context data
  useEffect(() => {
    setFormData(hero);
  }, [hero]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let val: any = value;
    if (type === "checkbox") {
      val = (e.target as HTMLInputElement).checked;
    } else if (type === "number" || type === "range") {
      val = parseFloat(value);
    }
    const updated = { ...formData, [name]: val };
    setFormData(updated);
    updateHero(updated); // IMMEDIATE AUTO-SAVE
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2000);
  };

  const handleBlurPreset = (amount: number) => {
    const updated = { ...formData, blurAmount: amount };
    setFormData(updated);
    updateHero(updated); // IMMEDIATE AUTO-SAVE
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2000);
  };

  // Video Upload Handler
  const handleVideoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) {
      setUploadStatus("Please select a video file first (.mp4, .webm)");
      return;
    }

    setUploading(true);
    setUploadStatus("Uploading video to command storage...");

    try {
      const uploadResult = await uploadFile(videoFile, {
        folder: "videos",
        name: videoName.trim() ? videoName.trim().toLowerCase().replace(/\s+/g, "_") : undefined,
      });

      // Add to backgroundVideos array
      const newVideo: BackgroundVideo = {
        id: "vid-" + Date.now(),
        name: videoName.trim() || uploadResult.filename || "Uploaded Background Video",
        url: uploadResult.url,
        poster: formData.posterUrl || "/images/background_ref.png",
      };

      const currentVideos = formData.backgroundVideos || [
        {
          id: "vid-default",
          name: "Obsidian Cyber Horizon (Default)",
          url: "/videos/bg_video.mp4",
          poster: "/images/background_ref.png",
        },
      ];

      const updatedVideos = [...currentVideos, newVideo];
      const updated = {
        ...formData,
        backgroundVideos: updatedVideos,
        videoUrl: newVideo.url,
        selectedVideoId: newVideo.id,
        videoEnabled: true,
      };

      setFormData(updated);
      await updateHero(updated);

      setVideoFile(null);
      setVideoName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setUploadStatus("Video successfully uploaded and set as active background!");
      setIsSavedRecently(true);
      setTimeout(() => setUploadStatus(""), 4000);
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadStatus("Error uploading video: " + (err.message || "Unknown error"));
    } finally {
      setUploading(false);
    }
  };

  // Set active video
  const handleSelectVideo = (video: BackgroundVideo) => {
    const updated = {
      ...formData,
      videoUrl: video.url,
      selectedVideoId: video.id,
      videoEnabled: true,
    };
    setFormData(updated);
    updateHero(updated);
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2000);
  };

  // Delete uploaded video
  const handleDeleteVideo = (id: string) => {
    const currentVideos = formData.backgroundVideos || [];
    if (currentVideos.length <= 1) {
      alert("At least one background video must remain in the library.");
      return;
    }
    if (!confirm("Are you sure you want to remove this video from your background options?")) {
      return;
    }

    const updatedVideos = currentVideos.filter((v) => v.id !== id);
    const fallbackVideo = updatedVideos[0];
    const isDeletingActive = formData.selectedVideoId === id;

    const updated = {
      ...formData,
      backgroundVideos: updatedVideos,
      ...(isDeletingActive && {
        videoUrl: fallbackVideo.url,
        selectedVideoId: fallbackVideo.id,
      }),
    };

    setFormData(updated);
    updateHero(updated);
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2000);
  };

  const videosList = formData.backgroundVideos && formData.backgroundVideos.length > 0
    ? formData.backgroundVideos
    : [
        {
          id: "vid-default",
          name: "Obsidian Cyber Horizon (Default)",
          url: "/videos/bg_video.mp4",
          poster: "/images/bg_static_desktop.jpg",
        },
      ];

  // Mobile Video Upload Handler
  const handleMobileVideoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileVideoFile) {
      setMobileUploadStatus("Please select a vertical video file first (.mp4, .webm)");
      return;
    }

    setMobileUploading(true);
    setMobileUploadStatus("Uploading mobile video to command storage...");

    try {
      const uploadResult = await uploadFile(mobileVideoFile, {
        folder: "videos",
        name: mobileVideoName.trim() ? "mobile_" + mobileVideoName.trim().toLowerCase().replace(/\s+/g, "_") : undefined,
      });

      const newVideo: BackgroundVideo = {
        id: "vid-mob-" + Date.now(),
        name: mobileVideoName.trim() || uploadResult.filename || "Uploaded Mobile Background Video",
        url: uploadResult.url,
        poster: formData.mobileFallbackUrl || formData.staticMobileBg || "/images/bg_static_mobile.jpg",
        deviceType: "mobile",
      };

      const currentVideos = formData.mobileBackgroundVideos || [
        {
          id: "vid-mobile-default",
          name: "Cyber Horizon Vertical (Default Mobile)",
          url: formData.mobileVideoUrl || "/videos/bg_video.mp4",
          poster: "/images/bg_static_mobile.jpg",
          deviceType: "mobile",
        },
      ];

      const updatedVideos = [...currentVideos, newVideo];
      const updated = {
        ...formData,
        mobileBackgroundVideos: updatedVideos,
        mobileVideoUrl: newVideo.url,
        selectedMobileVideoId: newVideo.id,
      };

      setFormData(updated);
      await updateHero(updated);

      setMobileVideoFile(null);
      setMobileVideoName("");
      if (mobileFileInputRef.current) mobileFileInputRef.current.value = "";
      setMobileUploadStatus("Mobile video successfully uploaded and set as active mobile background!");
      setIsSavedRecently(true);
      setTimeout(() => setMobileUploadStatus(""), 4000);
    } catch (err: any) {
      console.error("Upload error:", err);
      setMobileUploadStatus("Error uploading mobile video: " + (err.message || "Unknown error"));
    } finally {
      setMobileUploading(false);
    }
  };

  const handleSelectMobileVideo = (video: BackgroundVideo) => {
    const updated = {
      ...formData,
      mobileVideoUrl: video.url,
      selectedMobileVideoId: video.id,
    };
    setFormData(updated);
    updateHero(updated);
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2000);
  };

  const handleDeleteMobileVideo = (id: string) => {
    const currentVideos = formData.mobileBackgroundVideos || [];
    if (currentVideos.length <= 1) {
      alert("At least one mobile background video option must remain in the library.");
      return;
    }
    if (!confirm("Remove this mobile video from your mobile background options?")) {
      return;
    }

    const updatedVideos = currentVideos.filter((v) => v.id !== id);
    const fallbackVideo = updatedVideos[0];
    const isDeletingActive = formData.selectedMobileVideoId === id;

    const updated = {
      ...formData,
      mobileBackgroundVideos: updatedVideos,
      ...(isDeletingActive && {
        mobileVideoUrl: fallbackVideo.url,
        selectedMobileVideoId: fallbackVideo.id,
      }),
    };

    setFormData(updated);
    updateHero(updated);
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2000);
  };

  const mobileVideosList = formData.mobileBackgroundVideos && formData.mobileBackgroundVideos.length > 0
    ? formData.mobileBackgroundVideos
    : [
        {
          id: "vid-mobile-default",
          name: "Cyber Horizon Vertical (Default Mobile)",
          url: formData.mobileVideoUrl || "/videos/bg_video.mp4",
          poster: formData.mobileFallbackUrl || "/images/bg_static_mobile.jpg",
          deviceType: "mobile" as const,
        },
      ];

  return (
    <div className="space-y-8">
      {/* Header with Real-time Auto-Save Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Hero, Multi-Video & Background Blur System
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload new background videos, manage video options for landing page switcher, configure blur, and sync live to Supabase.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-emerald-950/40 border border-emerald-800/80 text-emerald-400 rounded-full text-xs font-mono flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Auto-Save Active // Instant Sync</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Form Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Background Video Uploader & Multi-Video Switcher Library */}
          <div className="p-6 bg-[#11141c] border border-slate-800 rounded-lg space-y-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <FileVideo className="w-4 h-4 text-red-500" />
                <span>Background Video Upload & Multi-Option Library</span>
              </div>
              <span className="text-xs font-mono text-red-400 font-bold">
                {videosList.length} Option{videosList.length !== 1 ? "s" : ""} Available
              </span>
            </div>

            <p className="text-xs text-slate-400 font-mono">
              Upload video clips (.mp4, .webm) here. All uploaded videos will appear in the landing page video menu so visitors can switch between multiple backgrounds or switch to static mode!
            </p>

            {/* Video Upload Form */}
            <form onSubmit={handleVideoUpload} className="p-4 bg-[#0a0c10] border border-slate-800/80 rounded-lg space-y-3">
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-red-400" />
                <span>Upload New Background Video</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-slate-400">Select Video File (.mp4, .webm)</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="video/mp4,video/webm"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setVideoFile(e.target.files[0]);
                        if (!videoName) {
                          setVideoName(
                            e.target.files[0].name.replace(/\.[^/.]+$/, "").replace(/_/g, " ")
                          );
                        }
                      }
                    }}
                    className="w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Video Display Label</label>
                  <input
                    type="text"
                    value={videoName}
                    onChange={(e) => setVideoName(e.target.value)}
                    placeholder="e.g. Cyber Matrix Stream"
                    className="w-full px-3 py-1.5 bg-[#11141c] border border-slate-700 rounded text-slate-200 focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {uploadStatus && (
                <div className={`p-2.5 rounded text-xs font-mono flex items-center gap-2 ${
                  uploadStatus.includes("Error")
                    ? "bg-red-950/80 border border-red-800 text-red-300"
                    : "bg-emerald-950/80 border border-emerald-800 text-emerald-300"
                }`}>
                  {uploadStatus.includes("Error") ? (
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>{uploadStatus}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={uploading || !videoFile}
                className="w-full py-2 px-4 bg-red-600 hover:bg-red-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition shadow cursor-pointer disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Uploading Video to Cloud & Disk...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload & Add Video to Landing Switcher</span>
                  </>
                )}
              </button>
            </form>

            {/* Existing Video Options List */}
            <div className="space-y-2 pt-2">
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Active Video Options in Landing Page Switcher ({videosList.length})
              </label>

              <div className="space-y-2">
                {videosList.map((vid) => {
                  const isActive =
                    formData.selectedVideoId === vid.id ||
                    formData.videoUrl === vid.url;

                  return (
                    <div
                      key={vid.id}
                      className={`p-3 rounded-lg border flex items-center justify-between gap-3 transition-all ${
                        isActive
                          ? "bg-red-950/20 border-red-500/60 shadow-md shadow-red-950/30"
                          : "bg-[#0a0c10] border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-16 h-10 rounded overflow-hidden bg-black shrink-0 relative border border-slate-700">
                          <video
                            src={vid.url}
                            muted
                            loop
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white truncate font-mono">
                              {vid.name}
                            </span>
                            {isActive && (
                              <span className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[9px] font-mono font-bold tracking-wider uppercase">
                                Active Live
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 block truncate">
                            {vid.url}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!isActive && (
                          <button
                            type="button"
                            onClick={() => handleSelectVideo(vid)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1"
                          >
                            <Play className="w-3 h-3" />
                            <span>Set Active</span>
                          </button>
                        )}

                        {videosList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteVideo(vid.id)}
                            className="p-1.5 rounded hover:bg-red-950/50 text-slate-500 hover:text-red-400 transition-colors"
                            title="Delete this video"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section: Mobile-Only Video Background (9:16 Ratio) */}
          <div className="p-6 bg-[#11141c] border border-slate-800 rounded-lg space-y-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-purple-600/20 border-b border-l border-purple-500/40 text-purple-300 font-mono text-[10px] font-bold uppercase rounded-bl">
              Mobile Visitors Only
            </div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Smartphone className="w-4 h-4 text-purple-400" />
                <span>Mobile Video Background (9:16 Vertical Ratio)</span>
              </div>
              <span className="text-xs font-mono text-purple-400 font-bold mr-24 sm:mr-0">
                {mobileVideosList.length} Option{mobileVideosList.length !== 1 ? "s" : ""}
              </span>
            </div>

            <p className="text-xs text-slate-400 font-mono">
              Upload 9:16 vertical portrait video clips here (.mp4, .webm). <strong className="text-white">These videos will only be displayed to smartphone/mobile visitors</strong>, providing native full-screen vertical framing with zero horizontal cropping!
            </p>

            {/* Mobile Video Upload Form */}
            <form onSubmit={handleMobileVideoUpload} className="p-4 bg-[#0a0c10] border border-slate-800/80 rounded-lg space-y-3">
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-purple-400" />
                <span>Upload Mobile-Ratio Video</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-slate-400">Select Vertical Video (.mp4, .webm)</label>
                  <input
                    type="file"
                    ref={mobileFileInputRef}
                    accept="video/mp4,video/webm"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setMobileVideoFile(e.target.files[0]);
                        if (!mobileVideoName) {
                          setMobileVideoName(
                            e.target.files[0].name.replace(/\.[^/.]+$/, "").replace(/_/g, " ")
                          );
                        }
                      }
                    }}
                    className="w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Mobile Video Label</label>
                  <input
                    type="text"
                    value={mobileVideoName}
                    onChange={(e) => setMobileVideoName(e.target.value)}
                    placeholder="e.g. Cyber Matrix Mobile Stream"
                    className="w-full px-3 py-1.5 bg-[#11141c] border border-slate-700 rounded text-slate-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {mobileUploadStatus && (
                <div className={`p-2.5 rounded text-xs font-mono flex items-center gap-2 ${
                  mobileUploadStatus.includes("Error")
                    ? "bg-red-950/80 border border-red-800 text-red-300"
                    : "bg-emerald-950/80 border border-emerald-800 text-emerald-300"
                }`}>
                  {mobileUploadStatus.includes("Error") ? (
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>{mobileUploadStatus}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={mobileUploading || !mobileVideoFile}
                className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition shadow cursor-pointer disabled:cursor-not-allowed"
              >
                {mobileUploading ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Uploading Mobile Video...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload & Set as Active Mobile Background</span>
                  </>
                )}
              </button>
            </form>

            {/* Mobile Video Options List */}
            <div className="space-y-2 pt-2">
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Active Mobile 9:16 Video Options ({mobileVideosList.length})
              </label>

              <div className="space-y-2">
                {mobileVideosList.map((vid) => {
                  const isActive =
                    formData.selectedMobileVideoId === vid.id ||
                    formData.mobileVideoUrl === vid.url;

                  return (
                    <div
                      key={vid.id}
                      className={`p-3 rounded-lg border flex items-center justify-between gap-3 transition-all ${
                        isActive
                          ? "bg-purple-950/20 border-purple-500/60 shadow-md shadow-purple-950/30"
                          : "bg-[#0a0c10] border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* 9:16 vertical ratio thumbnail */}
                        <div className="w-9 h-14 rounded overflow-hidden bg-black shrink-0 relative border border-slate-700">
                          <video
                            src={vid.url}
                            muted
                            loop
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white truncate font-mono">
                              {vid.name}
                            </span>
                            {isActive && (
                              <span className="px-1.5 py-0.5 rounded bg-purple-600 text-white text-[9px] font-mono font-bold tracking-wider uppercase">
                                Active Mobile
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 block truncate">
                            {vid.url}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!isActive && (
                          <button
                            type="button"
                            onClick={() => handleSelectMobileVideo(vid)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1"
                          >
                            <Play className="w-3 h-3" />
                            <span>Set Active</span>
                          </button>
                        )}

                        {mobileVideosList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteMobileVideo(vid.id)}
                            className="p-1.5 rounded hover:bg-red-950/50 text-slate-500 hover:text-red-400 transition-colors"
                            title="Delete this mobile video"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Background Blur & Cinematic Backdrop Configuration */}
          <div className="p-6 bg-[#11141c] border border-slate-800 rounded-lg space-y-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Background Blur & Backdrop Controller</span>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                {formData.blurAmount || 0}px Blur
              </span>
            </div>

            <p className="text-xs text-slate-400 font-mono">
              Adjust how sharp or blurred the background video and wallpaper appear. Blurring makes text and cards ultra-readable and cinematic!
            </p>

            {/* Range Slider for Blur */}
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Background Blur Radius</span>
                <span className="text-cyan-400 font-bold">{formData.blurAmount || 0}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                name="blurAmount"
                value={formData.blurAmount || 0}
                onChange={handleChange}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0px (Crystal Sharp)</span>
                <span>8px (Balanced)</span>
                <span>25px (Deep Focus)</span>
              </div>
            </div>

            {/* Quick Blur Preset Buttons */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Quick Blur Presets
              </label>
              <div className="grid grid-cols-5 gap-2 font-mono text-xs">
                {[
                  { label: "Sharp", amount: 0 },
                  { label: "Subtle (4px)", amount: 4 },
                  { label: "Medium (8px)", amount: 8 },
                  { label: "Cinematic (14px)", amount: 14 },
                  { label: "Heavy (20px)", amount: 20 },
                ].map((preset) => (
                  <button
                    key={preset.amount}
                    type="button"
                    onClick={() => handleBlurPreset(preset.amount)}
                    className={`py-1.5 px-2 rounded text-center transition-all ${
                      (formData.blurAmount || 0) === preset.amount
                        ? "bg-cyan-600 text-white font-bold border border-cyan-400 shadow-md"
                        : "bg-[#0a0c10] border border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Video Stream Fine-Tuning */}
          <div className="p-6 bg-[#11141c] border border-slate-800 rounded-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Video className="w-4 h-4 text-red-400" />
                <span>Cinematic Video Stream Parameters</span>
              </div>
              <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="videoEnabled"
                  checked={formData.videoEnabled}
                  onChange={(e) => {
                    const updated = { ...formData, videoEnabled: e.target.checked };
                    setFormData(updated);
                    updateHero(updated);
                  }}
                  className="rounded bg-slate-900 border-slate-700 text-red-600 focus:ring-red-500"
                />
                <span>Enable Video Background</span>
              </label>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-slate-400">Current Video Source URL</label>
                <input
                  type="text"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="/videos/bg_video.mp4"
                  className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">Desktop Static Wallpaper (16:9)</label>
                <input
                  type="text"
                  name="staticDesktopBg"
                  value={formData.staticDesktopBg || "/images/bg_static_desktop.jpg"}
                  onChange={handleChange}
                  placeholder="/images/bg_static_desktop.jpg"
                  className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">Mobile Static Wallpaper (9:16 Portrait)</label>
                <input
                  type="text"
                  name="staticMobileBg"
                  value={formData.staticMobileBg || "/images/bg_static_mobile.jpg"}
                  onChange={handleChange}
                  placeholder="/images/bg_static_mobile.jpg"
                  className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Sliders */}
            <div className="grid sm:grid-cols-2 gap-6 pt-2 font-mono text-xs">
              <div className="space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Overlay Darkness (Vignette)</span>
                  <span className="text-red-400">{Math.round(formData.overlayOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.95"
                  step="0.05"
                  name="overlayOpacity"
                  value={formData.overlayOpacity}
                  onChange={handleChange}
                  className="w-full accent-red-600"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Playback Velocity (Speed)</span>
                  <span className="text-red-400">{formData.videoSpeed}x</span>
                </div>
                <input
                  type="range"
                  min="0.25"
                  max="2.0"
                  step="0.25"
                  name="videoSpeed"
                  value={formData.videoSpeed}
                  onChange={handleChange}
                  className="w-full accent-red-600"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Portrait & Visual Assets */}
          <div className="p-6 bg-[#11141c] border border-slate-800 rounded-lg space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white border-b border-slate-800 pb-3">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              <span>Portrait & Visual Subject Layer</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-slate-400">Cinematic Subject Portrait URL</label>
                <input
                  type="text"
                  name="portraitUrl"
                  value={formData.portraitUrl}
                  onChange={handleChange}
                  placeholder="/images/pfp.png"
                  className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">Mobile Fallback Image URL</label>
                <input
                  type="text"
                  name="mobileFallbackUrl"
                  value={formData.mobileFallbackUrl}
                  onChange={handleChange}
                  placeholder="/images/pfp.png"
                  className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Hero Content & Typography */}
          <div className="p-6 bg-[#11141c] border border-slate-800 rounded-lg space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>Command Typography & Copy</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-slate-400">Small Label</label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">Large Name Display</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <label className="text-slate-400">Hero Subtitle / Descriptor</label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <label className="text-slate-400">Mission Description Narrative</label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none resize-none"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-slate-400">Primary CTA Text</label>
                <input
                  type="text"
                  name="ctaPrimaryText"
                  value={formData.ctaPrimaryText}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">Secondary CTA Text</label>
                <input
                  type="text"
                  name="ctaSecondaryText"
                  value={formData.ctaSecondaryText}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-[#11141c] border border-slate-800 rounded-lg space-y-4 sticky top-24 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>Live Hero Simulation</span>
              </div>
              <div className="flex flex-wrap items-center gap-1 bg-[#0a0c10] p-1 rounded border border-slate-800 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => setPreviewMode("video")}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    previewMode === "video" ? "bg-red-600 text-white font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Desktop Video
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("mobile-video")}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    previewMode === "mobile-video" ? "bg-purple-600 text-white font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Mobile Video (9:16)
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("desktop-static")}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    previewMode === "desktop-static" ? "bg-red-600 text-white font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Desktop Static
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("mobile-static")}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    previewMode === "mobile-static" ? "bg-purple-600 text-white font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Mobile Static
                </button>
              </div>
            </div>

            {/* Simulated Hero Frame with Active Video / Static Background & Dynamic Blur */}
            <div className={`relative rounded-lg overflow-hidden border border-slate-700 bg-black flex flex-col justify-end p-4 shadow-2xl transition-all ${
              previewMode === "mobile-static" || previewMode === "mobile-video"
                ? "aspect-[9/16] max-h-[420px] mx-auto w-64"
                : "aspect-video"
            }`}>
              {previewMode === "video" ? (
                <video
                  key="desktop-video"
                  src={formData.videoUrl || "/videos/bg_video.mp4"}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
                  style={{
                    filter: (formData.blurAmount || 0) > 0 ? `blur(${formData.blurAmount}px)` : undefined,
                    transform: (formData.blurAmount || 0) > 0 ? "scale(1.06)" : undefined,
                  }}
                />
              ) : previewMode === "mobile-video" ? (
                <video
                  key="mobile-video"
                  src={formData.mobileVideoUrl || formData.videoUrl || "/videos/bg_video.mp4"}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
                  style={{
                    filter: (formData.blurAmount || 0) > 0 ? `blur(${formData.blurAmount}px)` : undefined,
                    transform: (formData.blurAmount || 0) > 0 ? "scale(1.06)" : undefined,
                  }}
                />
              ) : previewMode === "desktop-static" ? (
                <img
                  key="desktop-static"
                  src={formData.staticDesktopBg || "/images/bg_static_desktop.jpg"}
                  alt="Desktop Static Preview"
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
                  style={{
                    filter: (formData.blurAmount || 0) > 0 ? `blur(${formData.blurAmount}px)` : undefined,
                    transform: (formData.blurAmount || 0) > 0 ? "scale(1.06)" : undefined,
                  }}
                />
              ) : (
                <img
                  key="mobile-static"
                  src={formData.staticMobileBg || "/images/bg_static_mobile.jpg"}
                  alt="Mobile Static Preview"
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
                  style={{
                    filter: (formData.blurAmount || 0) > 0 ? `blur(${formData.blurAmount}px)` : undefined,
                    transform: (formData.blurAmount || 0) > 0 ? "scale(1.06)" : undefined,
                  }}
                />
              )}

              <div
                className="absolute inset-0 bg-black transition-opacity duration-300"
                style={{ opacity: formData.overlayOpacity }}
              />

              {/* Text simulation */}
              <div className="relative z-10 space-y-1 max-w-[85%]">
                <div className="text-[9px] font-mono text-red-400 uppercase font-bold">
                  [ {formData.label} ]
                </div>
                <div className="text-2xl font-black text-white leading-none">
                  {formData.name}
                </div>
                <div className="text-[10px] font-mono text-red-300">
                  {formData.subtitle}
                </div>
                <div className="pt-2 flex gap-2">
                  <span className="px-2.5 py-1 bg-red-600 text-white text-[9px] font-mono rounded">
                    {formData.ctaPrimaryText}
                  </span>
                  <span className="px-2.5 py-1 bg-black/60 border border-slate-600 text-white text-[9px] font-mono rounded">
                    {formData.ctaSecondaryText}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded text-xs font-mono space-y-1.5 text-slate-400">
              <div className="flex justify-between">
                <span>DESKTOP VIDEO:</span>
                <span className="text-red-400 font-bold truncate max-w-[200px]">
                  {videosList.find((v) => v.url === formData.videoUrl)?.name || "Active Source"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>MOBILE VIDEO (9:16):</span>
                <span className="text-purple-400 font-bold truncate max-w-[200px]">
                  {mobileVideosList.find((v) => v.url === formData.mobileVideoUrl)?.name || "Active Mobile Source"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>ACTIVE BLUR:</span>
                <span className="text-cyan-400 font-bold">{formData.blurAmount || 0}px</span>
              </div>
              <div className="flex justify-between">
                <span>VIGNETTE:</span>
                <span className="text-red-400 font-bold">{Math.round(formData.overlayOpacity * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span>VELOCITY:</span>
                <span className="text-slate-200">{formData.videoSpeed}x</span>
              </div>
              <div className="text-[11px] text-emerald-400 pt-1 border-t border-slate-800 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>All changes broadcast live to public portfolio!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
