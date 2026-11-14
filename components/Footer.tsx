"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Profile } from "@/types/portfolio";
import { Github, ShieldCheck } from "lucide-react";

interface FooterProps {
  profile: Profile;
}

export default function Footer({ profile }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#030405] border-t border-white/10 py-20 text-center text-gray-400 relative">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 flex flex-col items-center">
        {/* Back to top button */}
        <button
          onClick={scrollToTop}
          className="group flex flex-col items-center gap-2.5 mb-12 text-[11px] font-black uppercase tracking-[0.25em] text-gray-400 hover:text-white transition-colors"
        >
          <div className="w-11 h-11 border border-white/20 group-hover:border-[#C5A880] group-hover:bg-[#C5A880]/10 flex items-center justify-center transition-all transform group-hover:-translate-y-1 shadow-md">
            <Image
              src="/assets/template/ic_baseline-double-arrow.svg"
              alt="Back to top"
              width={14}
              height={14}
              className="filter invert opacity-75 group-hover:opacity-100"
            />
          </div>
          <span>Back to Top</span>
        </button>

        {/* Social Icons (Tomasz Gajda signature square dark buttons) */}
        <div className="flex items-center gap-4 mb-10">
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="w-10 h-10 bg-[#0E1017] border border-white/15 hover:border-white flex items-center justify-center transition-all hover:-translate-y-0.5"
              aria-label="Email"
            >
              <Image
                src="/assets/template/Vector-4.svg"
                alt="Email"
                width={16}
                height={16}
                className="opacity-80 hover:opacity-100"
              />
            </a>
          )}
          {profile.github && (
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-[#0E1017] border border-white/15 hover:border-white flex items-center justify-center text-white/80 hover:text-white transition-all hover:-translate-y-0.5"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-[#0E1017] border border-white/15 hover:border-white flex items-center justify-center transition-all hover:-translate-y-0.5"
              aria-label="LinkedIn"
            >
              <Image
                src="/assets/template/Vector-2.svg"
                alt="LinkedIn"
                width={15}
                height={15}
                className="opacity-80 hover:opacity-100"
              />
            </a>
          )}
        </div>

        {/* Copyright & CMS Access */}
        <div className="space-y-3 text-xs font-light text-gray-500">
          <p className="tracking-wider">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-3 pt-1">
            <span>Tomasz Gajda Portfolio System</span>
            <span>•</span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C5A880] hover:text-white transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
