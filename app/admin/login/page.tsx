"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, User, AlertCircle, ArrowLeft, Loader2, Eye, EyeOff, Check, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("KITHUKRISHNA");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filled, setFilled] = useState(false);

  const handleQuickFill = () => {
    setUsername("admin");
    setPassword("KITHUKRISHNA");
    setFilled(true);
    setTimeout(() => setFilled(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0C0E] flex flex-col justify-center items-center px-4 sm:px-6 relative">
      {/* Decorative background glow */}
      <div className="absolute top-1/3 w-96 h-96 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>

        <div className="bg-[#16191F] border border-white/10 p-8 shadow-2xl">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 border border-[#C5A880]/50 bg-[#C5A880]/10 flex items-center justify-center text-[#C5A880] mb-4">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold uppercase tracking-wider text-white">
              Admin Portal
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Sign in to manage portfolio content and inquiries
            </p>
          </div>

          {/* Credentials Display Box */}
          <div className="mb-6 p-4 bg-[#0D0F12] border border-[#C5A880]/30 rounded-none space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C5A880]">
                <KeyRound className="w-3.5 h-3.5" />
                Login Credentials
              </span>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 bg-[#C5A880] hover:bg-[#B3956D] text-black transition-colors flex items-center gap-1"
              >
                {filled ? <Check className="w-3 h-3" /> : null}
                <span>{filled ? "Filled!" : "Auto-Fill"}</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-white/[0.03] p-2 border border-white/10">
                <span className="text-[10px] uppercase text-gray-400 block tracking-wider">Admin ID</span>
                <span className="font-mono font-bold text-white text-xs">admin</span>
              </div>
              <div className="bg-white/[0.03] p-2 border border-white/10">
                <span className="text-[10px] uppercase text-gray-400 block tracking-wider">Password</span>
                <span className="font-mono font-bold text-[#C5A880] text-xs">KITHUKRISHNA</span>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-950/60 border border-rose-500/40 text-rose-400 text-xs mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-2">
                Admin ID / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-[#0D0F12] border border-white/15 pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#C5A880] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="KITHUKRISHNA"
                  className="w-full bg-[#0D0F12] border border-white/15 pl-10 pr-11 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#C5A880] transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-white hover:bg-[#C5A880] text-black font-extrabold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In as Admin</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
