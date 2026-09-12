"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { ShieldAlert, ShieldCheck, Lock, ArrowLeft, KeyRound, Mail, AlertTriangle } from "lucide-react";

const AUTHORIZED_EMAIL = "miftahurr503@gmail.com";
const MASTER_KEY = "swapnil@2026";
const AUTH_STORAGE_KEY = "swapnil_admin_auth_session_v1";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  adminEmail: string;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAuthenticated: false,
  adminEmail: "",
  logout: () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [emailInput, setEmailInput] = useState<string>("");
  const [passkeyInput, setPasskeyInput] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const session = JSON.parse(stored);
        if (
          session &&
          session.email &&
          session.email.trim().toLowerCase() === AUTHORIZED_EMAIL.toLowerCase() &&
          session.authenticated
        ) {
          setIsAuthenticated(true);
        }
      }
    } catch (e) {
      console.error("Auth check error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passkeyInput.trim();

    // Verification 1: Email must strictly match the authorized mail
    if (cleanEmail !== AUTHORIZED_EMAIL.toLowerCase()) {
      setErrorMsg(
        `ACCESS DENIED: Unauthorized identity "${cleanEmail}". Admin panel is strictly restricted to ${AUTHORIZED_EMAIL}.`
      );
      return;
    }

    // Verification 2: Security Passkey validation
    if (cleanPass !== MASTER_KEY) {
      setErrorMsg("INVALID SECURITY KEY: Access denied. Please enter the correct passkey.");
      return;
    }

    // Grant access
    const sessionData = {
      email: cleanEmail,
      authenticated: true,
      timestamp: Date.now(),
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
    setSuccessMsg("IDENTITY CONFIRMED // ACCESS GRANTED");
    setTimeout(() => {
      setIsAuthenticated(true);
    }, 400);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    setEmailInput("");
    setPasskeyInput("");
    setErrorMsg("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06080d] flex items-center justify-center text-slate-400 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
          <span>VERIFYING SECURITY CREDENTIALS...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-[#07090e] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
        {/* Ambient Dark Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#07090e_80%)] pointer-events-none" />

        {/* Security Gate Card */}
        <div className="relative z-10 w-full max-w-md bg-[#10141d]/90 backdrop-blur-2xl border border-red-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-red-950/40 space-y-6">
          {/* Header Icon */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-600/15 border border-red-500/40 flex items-center justify-center text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide uppercase">
                Restricted Admin Command
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Level-5 Clearance Required
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-900/60 text-[11px] font-mono text-red-300">
              Authorized Identity: <strong className="text-white">{AUTHORIZED_EMAIL}</strong>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 font-mono text-xs">
            {errorMsg && (
              <div className="p-3 bg-red-950/80 border border-red-500/60 rounded-lg text-red-300 text-[11px] flex items-start gap-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-lg text-emerald-300 text-[11px] flex items-center gap-2 animate-in fade-in">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-red-400" />
                <span>Admin Email Address</span>
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="miftahurr503@gmail.com"
                className="w-full px-3.5 py-2.5 bg-[#0a0c12] border border-slate-700/80 rounded-lg text-white placeholder-slate-600 focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-red-400" />
                <span>Security Access Key</span>
              </label>
              <input
                type="password"
                required
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full px-3.5 py-2.5 bg-[#0a0c12] border border-slate-700/80 rounded-lg text-white placeholder-slate-600 focus:border-red-500 focus:outline-none transition-colors"
              />
              <div className="text-[10px] text-slate-500 text-right">
                Contact admin for access key
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-500 active:scale-[0.99] text-white font-bold rounded-lg tracking-wider uppercase transition-all shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 text-xs"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock Admin Console</span>
            </button>
          </form>

          {/* Public Return Link */}
          <div className="pt-2 border-t border-slate-800 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 font-mono transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Portfolio</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, adminEmail: AUTHORIZED_EMAIL, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
