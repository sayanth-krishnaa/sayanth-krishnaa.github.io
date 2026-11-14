"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Menu, X, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  name: string;
}

export default function Navbar({ name }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "About me", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#050608]/85 backdrop-blur-xl border-b border-white/10 py-3.5 shadow-2xl shadow-black/80"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand / ITB Logo */}
        <Link href="#hero" className="flex items-center gap-3.5 group">
          <div className="relative w-11 h-9 flex items-center justify-center p-1 bg-white/5 border border-white/10 group-hover:border-white/40 transition-colors">
            <Image
              src="/assets/template/Logo ITB.png"
              alt="Logo"
              width={38}
              height={32}
              className="object-contain filter invert contrast-200 group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-black tracking-[0.2em] text-xs uppercase text-white group-hover:text-[#C5A880] transition-colors">
              {name}
            </span>
            <span className="text-[10px] tracking-widest uppercase text-gray-500">
              Portfolio
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs uppercase tracking-[0.22em] font-bold text-gray-300 hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#C5A880] hover:after:w-full after:transition-all duration-300"
            >
              {link.label}
            </Link>
          ))}

          {/* Quick CTA */}
          <Link
            href="#contact"
            className="group relative inline-flex items-center gap-1.5 px-5 py-2.5 bg-white text-black font-extrabold text-xs uppercase tracking-[0.2em] hover:bg-[#C5A880] transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-[#C5A880]/15"
          >
            <span>Contact Me</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          {/* Admin shortcut */}
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-white/15 hover:border-white/50 text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-all bg-white/[0.02]"
            title="Admin CMS Portal"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Admin</span>
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-white border border-white/20 bg-white/5 hover:bg-white/10"
          aria-label="Open menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0A0C10] border-b border-white/15 px-8 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-xs uppercase tracking-[0.2em] font-bold text-gray-300 hover:text-[#C5A880] py-2"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <Link
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="px-5 py-2.5 bg-white text-black font-black text-xs uppercase tracking-widest"
            >
              Contact Me
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-[#C5A880]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
