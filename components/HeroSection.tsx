import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Profile } from "@/types/portfolio";
import { Github, ArrowRight, Download, Sparkles } from "lucide-react";

interface HeroSectionProps {
  profile: Profile;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen bg-[#050608] flex items-center pt-28 pb-16 overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="glow-accent w-[500px] h-[500px] bg-[#C5A880] top-1/4 -left-48" />
      <div className="glow-accent w-[400px] h-[400px] bg-blue-500/10 top-1/2 -right-40" />

      {/* Subtle grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Headlines & Actions */}
        <div className="lg:col-span-7 space-y-7 text-left">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/[0.04] border border-white/15 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-300">
              Available For New Projects & Roles
            </span>
          </div>

          {/* Typography */}
          <div className="space-y-3">
            <p className="text-lg sm:text-xl font-bold uppercase tracking-[0.25em] text-gray-400">
              Hi, I am
            </p>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[1.05]">
              {profile.name}
            </h1>

            <div className="flex items-center gap-3 pt-1">
              <div className="h-[2px] w-8 bg-[#C5A880]" />
              <p className="text-sm sm:text-base font-extrabold text-[#C5A880] tracking-[0.2em] uppercase">
                {profile.role}
              </p>
            </div>
          </div>

          <p className="text-gray-400 text-sm sm:text-base max-w-xl leading-relaxed font-light">
            {profile.tagline || profile.aboutShort}
          </p>

          {/* Social Badges in Tomasz Gajda template style */}
          <div className="flex items-center gap-3 pt-2">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email"
                className="w-12 h-12 bg-[#0F1117] border border-white/15 hover:border-[#C5A880] flex items-center justify-center transition-all hover:-translate-y-1 shadow-md hover:shadow-lg group"
                title="Send Email"
              >
                <Image
                  src="/assets/template/Vector-4.svg"
                  alt="Email"
                  width={20}
                  height={18}
                  className="opacity-80 group-hover:opacity-100 filter group-hover:drop-shadow-[0_0_8px_rgba(197,168,128,0.5)]"
                />
              </a>
            )}

            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-12 h-12 bg-[#0F1117] border border-white/15 hover:border-white flex items-center justify-center transition-all hover:-translate-y-1 shadow-md text-white/80 hover:text-white"
                title="GitHub Profile"
              >
                <Github className="w-5 h-5" />
              </a>
            )}

            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-12 h-12 bg-[#0F1117] border border-white/15 hover:border-[#C5A880] flex items-center justify-center transition-all hover:-translate-y-1 shadow-md group"
                title="LinkedIn Profile"
              >
                <Image
                  src="/assets/template/Vector-2.svg"
                  alt="LinkedIn"
                  width={18}
                  height={18}
                  className="opacity-80 group-hover:opacity-100"
                />
              </a>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="#portfolio"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-[#C5A880] transition-all shadow-xl hover:shadow-[#C5A880]/20 transform hover:-translate-y-0.5"
            >
              <span>View Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/40 hover:border-white text-white font-extrabold uppercase tracking-[0.2em] text-xs transition-all hover:bg-white/5"
            >
              <span>Get in touch</span>
            </Link>

            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-4 text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Resume</span>
              </a>
            )}
          </div>
        </div>

        {/* Right Column: High-Impact Portrait Frame */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-sm sm:max-w-md group">
            {/* Geometric Offset Frame */}
            <div className="absolute -inset-3.5 border-2 border-white/20 transform translate-x-3 translate-y-3 -z-10 group-hover:border-[#C5A880]/50 transition-colors duration-500" />

            {/* Portrait Image Container */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0D0F14] border border-white/15 shadow-2xl">
              <Image
                src={profile.heroImage || "/assets/template/pexels-photo 2.png"}
                alt={profile.name}
                fill
                priority
                className="object-cover object-top filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                sizes="(max-width: 768px) 100vw, 420px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-transparent to-transparent opacity-80" />

              {/* Floating Glass Tag */}
              <div className="absolute bottom-5 left-5 right-5 p-4 bg-[#050608]/85 backdrop-blur-xl border border-white/15 shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C5A880]">
                    {profile.location}
                  </p>
                  <p className="text-xs font-extrabold uppercase tracking-wider text-white mt-0.5">
                    Full-Stack & UI Architecture
                  </p>
                </div>
                <Sparkles className="w-5 h-5 text-[#C5A880] shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
