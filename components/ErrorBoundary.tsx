"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-8">
          <div className="max-w-lg w-full bg-[#11141c] border border-red-800/60 rounded-xl p-8 shadow-2xl space-y-5 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-red-950/50 border border-red-700/50 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                STARK-OS :: SYSTEM EXCEPTION
              </h2>
              <p className="text-sm text-slate-400 mt-2 font-mono">
                A runtime error occurred. This is usually caused by missing Supabase tables.
              </p>
            </div>
            <div className="p-3 bg-[#0a0c10] border border-slate-800 rounded text-left text-xs font-mono text-red-300 break-all max-h-32 overflow-y-auto">
              {this.state.error?.message || "Unknown error"}
            </div>
            <div className="text-xs text-slate-500 font-mono space-y-1">
              <p>
                → Make sure your Supabase schema SQL has been run at:
              </p>
              <a
                href="https://supabase.com/dashboard/project/sfrnetfnsojmwnqrfxjz/sql/new"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                supabase.com/dashboard → SQL Editor
              </a>
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="flex items-center gap-2 mx-auto px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded text-sm font-semibold transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload System</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
