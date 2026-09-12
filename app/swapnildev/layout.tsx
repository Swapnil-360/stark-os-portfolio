"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Video,
  FolderGit2,
  Image as ImageIcon,
  User,
  History,
  Cpu,
  Palette,
  Settings,
  ExternalLink,
  Shield,
  Menu,
  X,
  CheckCircle2,
  LogOut,
  Mail,
} from "lucide-react";
import { useData } from "@/context/DataContext";
import { useTheme } from "@/context/ThemeContext";
import AdminAuthGuard, { useAdminAuth } from "@/components/admin/AdminAuthGuard";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const ADMIN_NAV_ITEMS = [
  { href: "/swapnildev", label: "Dashboard", icon: LayoutDashboard },
  { href: "/swapnildev/hero", label: "Hero & Video", icon: Video },
  { href: "/swapnildev/projects", label: "Projects CRUD", icon: FolderGit2 },
  { href: "/swapnildev/media", label: "Media Library", icon: ImageIcon },
  { href: "/swapnildev/profile", label: "Profile & Bio", icon: User },
  { href: "/swapnildev/experience", label: "Experience", icon: History },
  { href: "/swapnildev/skills", label: "Tech Stack", icon: Cpu },
  { href: "/swapnildev/themes", label: "Themes Tuner", icon: Palette },
  { href: "/swapnildev/settings", label: "Site Settings & CV", icon: Settings },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { isLiveDb } = useData();
  const { currentTheme } = useTheme();
  const { adminEmail, logout } = useAdminAuth();

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="h-16 bg-[#11141c] border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
            aria-label="Toggle admin navigation"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-red-600/20 border border-red-500/50 flex items-center justify-center font-mono font-bold text-red-400 text-sm">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide text-white">SWAPNIL CMS</span>
              <span className="text-[10px] text-slate-400 ml-2 px-1.5 py-0.5 rounded bg-slate-800 font-mono">
                {isLiveDb ? "SUPABASE CONNECTED" : "LOCAL STORE READY"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Auto-Save Active</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
            <Mail className="w-3.5 h-3.5 text-red-400" />
            <span>{adminEmail || "miftahurr503@gmail.com"}</span>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-semibold tracking-wide transition-all shadow-sm"
          >
            <span>View Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-all border border-slate-700"
            title="Lock & Logout"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Navigation Backdrop Scrim */}
        {isMobileNavOpen && (
          <div
            className="fixed inset-0 z-25 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileNavOpen(false)}
          />
        )}

        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-16 left-0 z-30 w-64 bg-[#11141c] border-r border-slate-800 p-4 transition-transform duration-200 lg:static lg:translate-x-0 ${
            isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider px-3 mb-2">
            Command Modules
          </div>
          <nav className="space-y-1">
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-red-600/15 text-red-400 border-l-2 border-red-500 font-semibold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 pt-4 border-t border-slate-800 px-3 text-[11px] text-slate-400 space-y-2 font-mono">
            <div>CURRENT THEME: <span className="text-white">{currentTheme.name}</span></div>
            <div>VERCEL COMPLIANT: <span className="text-emerald-400">YES</span></div>
            <div className="text-[10px] text-slate-500">AUTHORIZED: miftahurr503@gmail.com</div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#0a0c10]">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <AdminAuthGuard>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </AdminAuthGuard>
    </ErrorBoundary>
  );
}
