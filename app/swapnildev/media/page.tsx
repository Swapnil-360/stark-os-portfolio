"use client";

import React, { useState } from "react";
import {
  Image as ImageIcon,
  Video,
  Copy,
  Check,
  Upload,
  Trash2,
  Search,
  Filter,
} from "lucide-react";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: "image" | "video";
  category: "backgrounds" | "projects" | "profile" | "videos";
  size: string;
}

const INITIAL_MEDIA: MediaItem[] = [
  {
    id: "m-1",
    name: "bg_video.mp4",
    url: "/videos/bg_video.mp4",
    type: "video",
    category: "videos",
    size: "3.9 MB",
  },
  {
    id: "m-2",
    name: "background_ref.png",
    url: "/images/background_ref.png",
    type: "image",
    category: "backgrounds",
    size: "1.7 MB",
  },
  {
    id: "m-3",
    name: "theme.png",
    url: "/images/theme.png",
    type: "image",
    category: "projects",
    size: "1.9 MB",
  },
];

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState("");
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"image" | "video">("image");
  const [newCategory, setNewCategory] = useState<"backgrounds" | "projects" | "profile" | "videos">("projects");

  const filteredMedia = mediaList.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl || !newName) return;

    const newItem: MediaItem = {
      id: "m-" + Date.now(),
      name: newName,
      url: newUrl,
      type: newType,
      category: newCategory,
      size: "Custom",
    };

    setMediaList([newItem, ...mediaList]);
    setNewUrl("");
    setNewName("");
  };

  const handleDelete = (id: string) => {
    setMediaList(mediaList.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Media Library & Storage
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Store, inspect, copy URLs, and categorize visual assets and video files.
          </p>
        </div>
      </div>

      {/* Add New Asset Quick Bar */}
      <form onSubmit={handleAddMedia} className="p-4 bg-[#11141c] border border-slate-800 rounded-lg space-y-4">
        <div className="text-xs font-mono uppercase text-slate-400 font-semibold">
          Register New Media Link / Asset
        </div>
        <div className="grid sm:grid-cols-4 gap-3 text-xs font-mono">
          <input
            type="text"
            required
            placeholder="Asset Name (e.g. hero-alt.jpg)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
          />
          <input
            type="text"
            required
            placeholder="Media File URL (/images/... or https://...)"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as any)}
            className="px-3 py-2 bg-[#0a0c10] border border-slate-800 rounded text-slate-200 focus:border-red-500 focus:outline-none"
          >
            <option value="projects">Projects</option>
            <option value="backgrounds">Backgrounds</option>
            <option value="profile">Profile</option>
            <option value="videos">Videos</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-semibold transition-all"
          >
            Add to Library
          </button>
        </div>
      </form>

      {/* Search & Category Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5 font-mono text-xs">
          {["all", "backgrounds", "projects", "profile", "videos"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded uppercase transition-colors ${
                activeCategory === cat
                  ? "bg-red-600 text-white font-semibold"
                  : "bg-[#11141c] text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-1.5 bg-[#11141c] border border-slate-800 rounded text-xs font-mono text-slate-200 focus:border-red-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className="bg-[#11141c] border border-slate-800 rounded-lg overflow-hidden group hover:border-slate-700 transition-colors flex flex-col justify-between"
          >
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              {item.type === "video" ? (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Video className="w-8 h-8 text-red-500" />
                  <span className="text-[10px] font-mono uppercase">MP4 Video Stream</span>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 border border-slate-700 text-[9px] font-mono text-slate-300 rounded uppercase">
                {item.category}
              </span>
            </div>

            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white truncate max-w-[140px]" title={item.name}>
                  {item.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{item.size}</span>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
                <button
                  onClick={() => handleCopyUrl(item.id, item.url)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-mono transition-colors"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === item.id ? "Copied" : "Copy URL"}</span>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 text-slate-400 hover:text-red-400 rounded transition-colors"
                  title="Remove from Media List"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
