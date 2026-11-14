"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Profile } from "@/types/portfolio";
import { Mail, MapPin, Phone, Send, CheckCircle2, AlertCircle, Loader2, Copy, Check } from "lucide-react";

interface ContactSectionProps {
  profile: Profile;
}

export default function ContactSection({ profile }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit message");
      }

      setStatus("success");
      setFeedback("Thank you! Your message has been sent successfully.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err: unknown) {
      setStatus("error");
      setFeedback(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <section id="contact" className="py-32 bg-[#050608] relative border-t border-white/10">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center">
        {/* Tomasz Gajda Framed Box Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[2px] w-16 sm:w-28 bg-white/20" />
            <div className="w-5 h-5 flex items-center justify-center">
              <Image
                src="/assets/template/ic_baseline-double-arrow.svg"
                alt="separator"
                width={16}
                height={16}
                className="opacity-70 rotate-180"
              />
            </div>
            <div className="h-[2px] w-16 sm:w-28 bg-white/20" />
          </div>

          <div className="tomasz-badge">CONTACT</div>

          <div className="flex items-center gap-4 mt-4">
            <div className="h-[2px] w-16 sm:w-28 bg-white/20" />
            <div className="w-5 h-5 flex items-center justify-center">
              <Image
                src="/assets/template/ic_baseline-double-arrow.svg"
                alt="separator"
                width={16}
                height={16}
                className="opacity-70"
              />
            </div>
            <div className="h-[2px] w-16 sm:w-28 bg-white/20" />
          </div>
        </div>

        <p className="text-gray-400 text-sm sm:text-base font-light max-w-xl mx-auto mb-20 leading-relaxed">
          Submit the form below or reach out directly for collaborations, inquiries, and consulting.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 text-left">
          {/* Direct Details Card */}
          <div className="md:col-span-5 bg-[#0E1017] p-8 border border-white/15 shadow-xl flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-black uppercase tracking-[0.2em] text-white mb-2">
                  Direct Inquiries
                </h3>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  Available for freelance projects, full-time engineering roles, and system architecture.
                </p>
              </div>

              {/* Email with copy button */}
              <div className="p-4 bg-[#050608] border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <Mail className="w-4 h-4 text-[#C5A880] shrink-0" />
                  <span className="text-xs text-gray-200 font-medium truncate">
                    {profile.email}
                  </span>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="p-1.5 border border-white/10 hover:border-white text-gray-400 hover:text-white transition-colors shrink-0"
                  title="Copy email to clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Phone */}
              {profile.phone && (
                <div className="p-4 bg-[#050608] border border-white/10 flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#C5A880] shrink-0" />
                  <span className="text-xs text-gray-200 font-medium">
                    {profile.phone}
                  </span>
                </div>
              )}

              {/* Location */}
              <div className="p-4 bg-[#050608] border border-white/10 flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span className="text-xs text-gray-200 font-medium">
                  {profile.location}
                </span>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 text-xs text-gray-500 font-light">
              Response time: typically within 24 hours.
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-7 bg-[#0E1017] p-8 sm:p-10 border border-white/15 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] font-extrabold text-gray-300 mb-2">
                  ENTER YOUR NAME*
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full tomasz-input"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] font-extrabold text-gray-300 mb-2">
                  ENTER YOUR EMAIL*
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full tomasz-input"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] font-extrabold text-gray-300 mb-2">
                  PHONE NUMBER (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 555 123 4567"
                  className="w-full tomasz-input"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] font-extrabold text-gray-300 mb-2">
                  YOUR MESSAGE*
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your project, timeline, and goals..."
                  className="w-full tomasz-input resize-none"
                />
              </div>

              {/* Status Alert */}
              {status === "success" && (
                <div className="flex items-center gap-2.5 p-3.5 bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{feedback}</span>
                </div>
              )}

              {status === "error" && (
                <div className="flex items-center gap-2.5 p-3.5 bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{feedback}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 bg-white hover:bg-[#C5A880] text-black font-black text-xs uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-[#C5A880]/20 disabled:opacity-50"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>TRANSMITTING...</span>
                  </>
                ) : (
                  <>
                    <span>SUBMIT MESSAGE</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
