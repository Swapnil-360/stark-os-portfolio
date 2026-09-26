"use client";

import React, { useState } from "react";
import HudCard from "../ui/HudCard";
import HudBadge from "../ui/HudBadge";
import HudButton from "../ui/HudButton";
import { useData } from "@/context/DataContext";
import confetti from "canvas-confetti";
import {
  Mail,
  MessageSquare,
  Linkedin,
  Github,
  Twitter,
  Send,
  CheckCircle2,
  AlertCircle,
  Terminal,
} from "lucide-react";

export default function ContactSection() {
  const { settings, socialLinks } = useData();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ["#ff1e38", "#ffffff", "#ff4d61"],
          });
        } catch {
          // ignore
        }
      } else {
        setStatus("error");
        setErrorMessage("Transmission failed. Please dispatch directly to email or WhatsApp.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network anomaly. Please reach out via direct channels.");
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-surface/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-[1px] bg-accent" />
            <HudBadge variant="accent">TRANSMISSION // UPLINK</HudBadge>
            <span className="w-6 h-[1px] bg-accent" />
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground uppercase">
            LET&apos;S BUILD <span className="text-accent">//</span> COMMENCE DIALOGUE
          </h2>
          <p className="font-mono text-xs sm:text-sm text-muted tracking-widest uppercase mt-2 max-w-xl">
            HAVE A PROJECT, CLIENT COMMISSION, OR ENGINEERING OPPORTUNITY?
          </p>
        </div>

        {/* 2-Column Grid: Form + Quick Channels */}
        <div className="grid lg:grid-cols-12 gap-10 items-start max-w-6xl mx-auto">
          {/* LEFT: Quick Uplink Channels (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <HudCard chamfer="tl" className="bg-surface-elevated space-y-5">
              <div className="flex items-center justify-between border-b border-hud pb-3">
                <span className="font-mono text-xs text-accent uppercase tracking-wider font-bold">
                  DIRECT CHANNELS
                </span>
                <HudBadge variant="success">READY</HudBadge>
              </div>

              <div className="space-y-3">
                {/* Email Chip (Opens Gmail Inbox Compose) */}
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(settings.email || "miftahurr503@gmail.com")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 bg-background border border-hud hover:border-red-500 rounded-sm flex items-center justify-between group transition-all cursor-pointer"
                  title="Open Gmail Inbox to compose message"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400 group-hover:bg-red-500 group-hover:text-white transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-muted uppercase">GMAIL INBOX</div>
                      <div className="font-display font-semibold text-xs sm:text-sm text-foreground group-hover:text-red-400 transition-colors">
                        Open Gmail Inbox
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-muted group-hover:text-red-400 transition-colors">&gt;&gt;</span>
                </a>

                {/* WhatsApp Chip (Opens WhatsApp Inbox) */}
                <a
                  href={`https://wa.me/${(settings.whatsapp || "8801318090383").replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 bg-background border border-hud hover:border-emerald-500 rounded-sm flex items-center justify-between group transition-all cursor-pointer"
                  title="Open WhatsApp Inbox to chat directly"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-sm text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-muted uppercase">WHATSAPP DIRECT</div>
                      <div className="font-display font-semibold text-xs sm:text-sm text-foreground group-hover:text-emerald-400 transition-colors">
                        Open WhatsApp Inbox
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-muted group-hover:text-emerald-400 transition-colors">&gt;&gt;</span>
                </a>

                {/* LinkedIn Chip */}
                <a
                  href="https://www.linkedin.com/in/mr-swapnil/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 bg-background border border-hud hover:border-accent rounded-sm flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 border border-accent/30 rounded-sm text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-muted uppercase">LINKEDIN NETWORK</div>
                      <div className="font-display font-semibold text-xs sm:text-sm text-foreground group-hover:text-accent transition-colors">
                        mr-swapnil
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-accent">&gt;&gt;</span>
                </a>

                {/* GitHub Chip */}
                <a
                  href="https://github.com/Swapnil-360"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 bg-background border border-hud hover:border-accent rounded-sm flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 border border-accent/30 rounded-sm text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                      <Github className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-muted uppercase">GITHUB REPOSITORIES</div>
                      <div className="font-display font-semibold text-xs sm:text-sm text-foreground group-hover:text-accent transition-colors">
                        Swapnil-360
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-accent">&gt;&gt;</span>
                </a>
              </div>

              {/* Social Channels Network */}
              <div className="pt-4 border-t border-white/5">
                <div className="text-[10px] font-mono text-muted uppercase mb-3 tracking-wider">
                  ALL CONNECTED RADIAL LINKS
                </div>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((soc) => (
                    <a
                      key={soc.id}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-background border border-white/10 hover:border-accent text-xs font-mono text-muted hover:text-foreground rounded-sm transition-all"
                    >
                      {soc.platform}
                    </a>
                  ))}
                </div>
              </div>
            </HudCard>
          </div>

          {/* RIGHT: Transmission Form (7 Cols) */}
          <div className="lg:col-span-7">
            <HudCard chamfer="both" glow className="bg-surface-elevated p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-hud pb-4 mb-6">
                <div className="flex items-center gap-2 font-mono text-xs text-accent uppercase font-bold">
                  <Terminal className="w-4 h-4" />
                  <span>TRANSMISSION TERMINAL</span>
                </div>
                <span className="font-mono text-[10px] text-muted">PORT: 443 // ENCRYPTED</span>
              </div>

              {status === "success" ? (
                <div className="py-12 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center text-accent shadow-hud-glow">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-black text-2xl text-foreground uppercase">
                    TRANSMISSION DISPATCHED
                  </h3>
                  <p className="font-mono text-xs text-muted max-w-md leading-relaxed">
                    Message received and queued in Swapnil&apos;s command dispatch. Expect response within 24 operational hours.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-6 py-2 bg-surface border border-hud hover:border-accent text-accent font-mono text-xs uppercase rounded-sm mt-4 transition-all"
                  >
                    DISPATCH ANOTHER TRANSMISSION
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block font-mono text-[11px] text-muted uppercase">
                        Operator Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Elena Rostova"
                        className="w-full px-3.5 py-2.5 bg-background border border-hud focus:border-accent focus:ring-1 focus:ring-accent rounded-sm font-mono text-xs text-foreground placeholder-muted-dark focus:outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-mono text-[11px] text-muted uppercase">
                        Return Frequency (Email) *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="operator@domain.com"
                        className="w-full px-3.5 py-2.5 bg-background border border-hud focus:border-accent focus:ring-1 focus:ring-accent rounded-sm font-mono text-xs text-foreground placeholder-muted-dark focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-mono text-[11px] text-muted uppercase">
                      Transmission Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Project Opportunity / Product Consultation / Hiring"
                      className="w-full px-3.5 py-2.5 bg-background border border-hud focus:border-accent focus:ring-1 focus:ring-accent rounded-sm font-mono text-xs text-foreground placeholder-muted-dark focus:outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-mono text-[11px] text-muted uppercase">
                      Payload Specifications (Message) *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Detail project specifications, timeline objectives, or collaboration parameters..."
                      className="w-full px-3.5 py-2.5 bg-background border border-hud focus:border-accent focus:ring-1 focus:ring-accent rounded-sm font-mono text-xs text-foreground placeholder-muted-dark focus:outline-none transition-all resize-none"
                    />
                  </div>

                  {status === "error" && (
                    <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-sm flex items-center gap-2 font-mono text-xs text-red-400">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <HudButton
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      disabled={status === "submitting"}
                      icon={<Send className="w-4 h-4" />}
                    >
                      {status === "submitting" ? "DISPATCHING PAYLOAD..." : "TRANSMIT MESSAGE"}
                    </HudButton>
                                    </div>

                  {/* LinkedIn Professional Connection Callout */}
                  <div className="pt-3 border-t border-hud/40 flex items-center justify-between text-xs font-mono text-muted">
                    <span className="flex items-center gap-1.5">
                      <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                      <span>Prefer professional messaging?</span>
                    </span>
                    <a
                      href="https://www.linkedin.com/in/mr-swapnil/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2 flex items-center gap-1 transition-colors"
                    >
                      <span>Connect on LinkedIn</span>
                      <span>&gt;&gt;</span>
                    </a>
                  </div>
                </form>
              )}
            </HudCard>
          </div>
        </div>
      </div>
    </section>
  );
}
