"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PortfolioData,
  ContactMessage,
  Skill,
  Project,
  ExploreService,
  Profile,
} from "@/types/portfolio";
import {
  LayoutDashboard,
  User,
  Wrench,
  Cpu,
  FolderGit2,
  Mail,
  Lock,
  ExternalLink,
  LogOut,
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  Check,
} from "lucide-react";

interface AdminDashboardProps {
  initialData: PortfolioData;
  initialMessages: ContactMessage[];
}

export default function AdminDashboard({
  initialData,
  initialMessages,
}: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "profile" | "services" | "skills" | "projects" | "messages" | "security"
  >("overview");

  // Local state for live mutations
  const [profile, setProfile] = useState<Profile>(initialData.profile);
  const [services, setServices] = useState<ExploreService[]>(initialData.services);
  const [skills, setSkills] = useState<Skill[]>(initialData.skills);
  const [projects, setProjects] = useState<Project[]>(initialData.projects);
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);

  // Status message notification
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const [saving, setSaving] = useState(false);

  // Skill editing state
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [newSkillModal, setNewSkillModal] = useState(false);
  const [skillForm, setSkillForm] = useState<Partial<Skill>>({
    name: "",
    category: "using-now",
    icon: "code2",
  });

  // Project editing state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProjectModal, setNewProjectModal] = useState(false);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: "",
    category: "coded",
    description: "",
    image: "/assets/template/image 17.svg",
    demoUrl: "",
    githubUrl: "",
    tags: ["React", "TypeScript"],
    featured: false,
  });

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const showNotification = (type: "success" | "error", text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  // Save Content API helper
  const saveContent = async (
    type: "profile" | "services" | "skills" | "projects",
    data: unknown
  ) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, data }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Save failed");
      showNotification("success", `${type.charAt(0).toUpperCase() + type.slice(1)} saved successfully!`);
      router.refresh();
    } catch (err: unknown) {
      showNotification("error", err instanceof Error ? err.message : "Error saving data");
    } finally {
      setSaving(false);
    }
  };

  // Skill handlers
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.name) return;

    let updated: Skill[];
    if (editingSkill) {
      updated = skills.map((s) =>
        s.id === editingSkill.id ? ({ ...s, ...skillForm } as Skill) : s
      );
    } else {
      const newSk: Skill = {
        id: `sk-${Date.now()}`,
        name: skillForm.name,
        category: skillForm.category || "using-now",
        icon: skillForm.icon || "code2",
      };
      updated = [...skills, newSk];
    }
    setSkills(updated);
    await saveContent("skills", updated);
    setNewSkillModal(false);
    setEditingSkill(null);
    setSkillForm({ name: "", category: "using-now", icon: "code2" });
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    const updated = skills.filter((s) => s.id !== id);
    setSkills(updated);
    await saveContent("skills", updated);
  };

  // Project handlers
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title) return;

    let updated: Project[];
    if (editingProject) {
      updated = projects.map((p) =>
        p.id === editingProject.id ? ({ ...p, ...projectForm } as Project) : p
      );
    } else {
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        title: projectForm.title,
        category: projectForm.category || "coded",
        description: projectForm.description || "",
        image: projectForm.image || "/assets/template/image 17.svg",
        demoUrl: projectForm.demoUrl || "",
        githubUrl: projectForm.githubUrl || "",
        tags: Array.isArray(projectForm.tags)
          ? projectForm.tags
          : String(projectForm.tags)
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
        featured: !!projectForm.featured,
      };
      updated = [...projects, newProj];
    }
    setProjects(updated);
    await saveContent("projects", updated);
    setNewProjectModal(false);
    setEditingProject(null);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    await saveContent("projects", updated);
  };

  // Message handlers
  const handleMarkMessageRead = async (id: string) => {
    try {
      await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m)));
    } catch {
      showNotification("error", "Failed to mark message read");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
      setMessages(messages.filter((m) => m.id !== id));
      showNotification("success", "Message deleted");
    } catch {
      showNotification("error", "Failed to delete message");
    }
  };

  // Password update handler
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification("error", "New passwords do not match!");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Password change failed");
      showNotification("success", "Password updated successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
      showNotification("error", err instanceof Error ? err.message : "Password change failed");
    } finally {
      setSaving(false);
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="min-h-screen bg-[#0A0C0E] text-white flex flex-col">
      {/* Top Bar */}
      <header className="bg-[#12151B] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 border border-[#C5A880] bg-[#C5A880]/10 flex items-center justify-center font-bold text-sm text-[#C5A880]">
            CMS
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-wider text-white">
              Portfolio Admin Portal
            </h1>
            <p className="text-[11px] text-gray-400">
              Live Editing & Content Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/20 hover:border-white text-xs font-semibold uppercase tracking-wider text-gray-300 hover:text-white transition-colors"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-[#0D0F13] border-r border-white/10 p-4 space-y-1 shrink-0">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-semibold transition-all ${
              activeTab === "overview"
                ? "bg-[#C5A880] text-black font-extrabold"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-semibold transition-all ${
              activeTab === "profile"
                ? "bg-[#C5A880] text-black font-extrabold"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Hero</span>
          </button>

          <button
            onClick={() => setActiveTab("services")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-semibold transition-all ${
              activeTab === "services"
                ? "bg-[#C5A880] text-black font-extrabold"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Explore Services</span>
          </button>

          <button
            onClick={() => setActiveTab("skills")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-semibold transition-all ${
              activeTab === "skills"
                ? "bg-[#C5A880] text-black font-extrabold"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Skills Manager</span>
            <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-white/10">
              {skills.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-semibold transition-all ${
              activeTab === "projects"
                ? "bg-[#C5A880] text-black font-extrabold"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Projects Manager</span>
            <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-white/10">
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("messages")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-semibold transition-all ${
              activeTab === "messages"
                ? "bg-[#C5A880] text-black font-extrabold"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Inquiries</span>
            {unreadCount > 0 && (
              <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-black">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-semibold transition-all ${
              activeTab === "security"
                ? "bg-[#C5A880] text-black font-extrabold"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Security & Pass</span>
          </button>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 p-6 md:p-10 max-w-5xl">
          {/* Status Alert Banner */}
          {statusMsg && (
            <div
              className={`flex items-center gap-2 p-4 mb-6 text-xs font-semibold border ${
                statusMsg.type === "success"
                  ? "bg-emerald-950/70 border-emerald-500/50 text-emerald-300"
                  : "bg-rose-950/70 border-rose-500/50 text-rose-300"
              }`}
            >
              {statusMsg.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wider text-white">
                  Dashboard Overview
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Manage your portfolio presentation and track incoming inquiries.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#16191F] border border-white/10 p-5">
                  <p className="text-xs uppercase tracking-widest text-gray-400">Total Projects</p>
                  <p className="text-3xl font-extrabold text-[#C5A880] mt-2">{projects.length}</p>
                </div>
                <div className="bg-[#16191F] border border-white/10 p-5">
                  <p className="text-xs uppercase tracking-widest text-gray-400">Skills Listed</p>
                  <p className="text-3xl font-extrabold text-[#C5A880] mt-2">{skills.length}</p>
                </div>
                <div className="bg-[#16191F] border border-white/10 p-5">
                  <p className="text-xs uppercase tracking-widest text-gray-400">Services</p>
                  <p className="text-3xl font-extrabold text-[#C5A880] mt-2">{services.length}</p>
                </div>
                <div className="bg-[#16191F] border border-white/10 p-5">
                  <p className="text-xs uppercase tracking-widest text-gray-400">Unread Messages</p>
                  <p className="text-3xl font-extrabold text-emerald-400 mt-2">{unreadCount}</p>
                </div>
              </div>

              {/* Recent Inquiries preview */}
              <div className="bg-[#16191F] border border-white/10 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-white">
                    Recent Contact Inquiries
                  </h3>
                  <button
                    onClick={() => setActiveTab("messages")}
                    className="text-xs text-[#C5A880] hover:underline"
                  >
                    View All ({messages.length})
                  </button>
                </div>

                {messages.length === 0 ? (
                  <p className="text-xs text-gray-500 py-4">No contact messages received yet.</p>
                ) : (
                  <div className="divide-y divide-white/5">
                    {messages.slice(0, 3).map((m) => (
                      <div key={m.id} className="py-3 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {m.name} <span className="text-xs text-gray-400">({m.email})</span>
                          </p>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-1">{m.message}</p>
                        </div>
                        <span className="text-[10px] text-gray-500 shrink-0">
                          {new Date(m.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE & HERO */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-wider text-white">
                    Profile & Hero Settings
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Edit your primary personal identity, headlines, and contact links.
                  </p>
                </div>
                <button
                  onClick={() => saveContent("profile", profile)}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C5A880] hover:bg-[#B3956D] text-black font-extrabold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Profile</span>
                </button>
              </div>

              <div className="bg-[#16191F] border border-white/10 p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full bg-[#0D0F12] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-2">
                      Role / Subtitle
                    </label>
                    <input
                      type="text"
                      value={profile.role}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                      className="w-full bg-[#0D0F12] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-2">
                    Hero Tagline
                  </label>
                  <input
                    type="text"
                    value={profile.tagline}
                    onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                    className="w-full bg-[#0D0F12] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-2">
                    Short Bio (Hero)
                  </label>
                  <textarea
                    rows={2}
                    value={profile.aboutShort}
                    onChange={(e) => setProfile({ ...profile, aboutShort: e.target.value })}
                    className="w-full bg-[#0D0F12] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-2">
                    Full About Bio (About Section)
                  </label>
                  <textarea
                    rows={4}
                    value={profile.aboutFull}
                    onChange={(e) => setProfile({ ...profile, aboutFull: e.target.value })}
                    className="w-full bg-[#0D0F12] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full bg-[#0D0F12] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full bg-[#0D0F12] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full bg-[#0D0F12] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-2">
                      GitHub URL
                    </label>
                    <input
                      type="text"
                      value={profile.github}
                      onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                      className="w-full bg-[#0D0F12] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-2">
                      LinkedIn URL
                    </label>
                    <input
                      type="text"
                      value={profile.linkedin}
                      onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                      className="w-full bg-[#0D0F12] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-2">
                      Hero Image Path / URL
                    </label>
                    <input
                      type="text"
                      value={profile.heroImage}
                      onChange={(e) => setProfile({ ...profile, heroImage: e.target.value })}
                      className="w-full bg-[#0D0F12] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-2">
                      Resume Link / File URL
                    </label>
                    <input
                      type="text"
                      value={profile.resumeUrl}
                      onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
                      className="w-full bg-[#0D0F12] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EXPLORE SERVICES */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-wider text-white">
                    Explore Services (3 Cards)
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Customize the Design, Development, and Maintenance service pillars.
                  </p>
                </div>
                <button
                  onClick={() => saveContent("services", services)}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C5A880] hover:bg-[#B3956D] text-black font-extrabold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Services</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {services.map((service, index) => (
                  <div key={service.id} className="bg-[#16191F] border border-white/10 p-5 space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) => {
                          const updated = [...services];
                          updated[index].title = e.target.value;
                          setServices(updated);
                        }}
                        className="w-full bg-[#0D0F12] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={4}
                        value={service.description}
                        onChange={(e) => {
                          const updated = [...services];
                          updated[index].description = e.target.value;
                          setServices(updated);
                        }}
                        className="w-full bg-[#0D0F12] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1">
                        Icon Path
                      </label>
                      <input
                        type="text"
                        value={service.icon}
                        onChange={(e) => {
                          const updated = [...services];
                          updated[index].icon = e.target.value;
                          setServices(updated);
                        }}
                        className="w-full bg-[#0D0F12] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SKILLS MANAGER */}
          {activeTab === "skills" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-wider text-white">
                    Skills Manager ({skills.length})
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Manage technologies categorized across Using Now, Learning, and Other Skills.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingSkill(null);
                    setSkillForm({ name: "", category: "using-now", icon: "code2" });
                    setNewSkillModal(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#C5A880] text-black font-extrabold text-xs uppercase tracking-wider transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Skill</span>
                </button>
              </div>

              {/* Skills list grouped */}
              {(["using-now", "learning", "other"] as const).map((cat) => {
                const group = skills.filter((s) => s.category === cat);
                return (
                  <div key={cat} className="bg-[#16191F] border border-white/10 p-5 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#C5A880]">
                      {cat === "using-now" ? "USING NOW" : cat === "learning" ? "LEARNING" : "OTHER SKILLS"} ({group.length})
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {group.map((skill) => (
                        <div
                          key={skill.id}
                          className="bg-[#0D0F12] border border-white/10 p-3 flex items-center justify-between gap-2"
                        >
                          <span className="text-xs font-bold uppercase tracking-wider truncate">
                            {skill.name}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingSkill(skill);
                                setSkillForm(skill);
                                setNewSkillModal(true);
                              }}
                              className="p-1 text-gray-400 hover:text-white"
                              title="Edit"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteSkill(skill.id)}
                              className="p-1 text-gray-400 hover:text-rose-400"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Add/Edit Skill Modal */}
              {newSkillModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                  <div className="bg-[#16191F] border border-white/20 p-6 max-w-md w-full space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      {editingSkill ? "Edit Skill" : "Add New Skill"}
                    </h3>

                    <form onSubmit={handleSaveSkill} className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1">
                          Skill Name
                        </label>
                        <input
                          type="text"
                          required
                          value={skillForm.name || ""}
                          onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                          placeholder="e.g. DOCKER"
                          className="w-full bg-[#0D0F12] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1">
                          Category
                        </label>
                        <select
                          value={skillForm.category}
                          onChange={(e) =>
                            setSkillForm({
                              ...skillForm,
                              category: e.target.value as "using-now" | "learning" | "other",
                            })
                          }
                          className="w-full bg-[#0D0F12] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                        >
                          <option value="using-now">USING NOW</option>
                          <option value="learning">LEARNING</option>
                          <option value="other">OTHER SKILLS</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1">
                          Icon identifier or file path
                        </label>
                        <input
                          type="text"
                          value={skillForm.icon || ""}
                          onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
                          placeholder="e.g. react, tailwind, /assets/template/git.svg"
                          className="w-full bg-[#0D0F12] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setNewSkillModal(false)}
                          className="px-4 py-2 border border-white/20 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#C5A880] text-black text-xs font-extrabold uppercase tracking-wider hover:bg-[#B3956D]"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PROJECTS MANAGER */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-wider text-white">
                    Projects Showcase ({projects.length})
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Add, edit, or delete portfolio projects and manage preview links.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setProjectForm({
                      title: "",
                      category: "coded",
                      description: "",
                      image: "/assets/template/image 17.svg",
                      demoUrl: "",
                      githubUrl: "",
                      tags: ["React"],
                      featured: false,
                    });
                    setNewProjectModal(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#C5A880] text-black font-extrabold text-xs uppercase tracking-wider transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-[#16191F] border border-white/10 p-5 space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-base font-bold uppercase text-white">
                          {project.title}
                        </h3>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border border-white/10 text-[#C5A880]">
                          {project.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 text-[10px] bg-white/5 border border-white/10 text-gray-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="flex gap-2">
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#C5A880] hover:underline"
                          >
                            Demo
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-400 hover:text-white"
                          >
                            Code
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProject(project);
                            setProjectForm(project);
                            setNewProjectModal(true);
                          }}
                          className="p-1.5 border border-white/10 hover:border-white text-gray-300 hover:text-white"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-1.5 border border-rose-500/30 hover:border-rose-500 text-rose-400 hover:text-rose-300"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Project Modal */}
              {newProjectModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
                  <div className="bg-[#16191F] border border-white/20 p-6 max-w-lg w-full space-y-4 my-8">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      {editingProject ? "Edit Project" : "Add New Project"}
                    </h3>

                    <form onSubmit={handleSaveProject} className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1">
                          Project Title*
                        </label>
                        <input
                          type="text"
                          required
                          value={projectForm.title || ""}
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          className="w-full bg-[#0D0F12] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1">
                          Category*
                        </label>
                        <select
                          value={projectForm.category}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              category: e.target.value as "coded" | "designed",
                            })
                          }
                          className="w-full bg-[#0D0F12] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                        >
                          <option value="coded">CODED</option>
                          <option value="designed">DESIGNED</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          value={projectForm.description || ""}
                          onChange={(e) =>
                            setProjectForm({ ...projectForm, description: e.target.value })
                          }
                          className="w-full bg-[#0D0F12] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1">
                            Live Demo URL
                          </label>
                          <input
                            type="text"
                            value={projectForm.demoUrl || ""}
                            onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                            placeholder="https://..."
                            className="w-full bg-[#0D0F12] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1">
                            GitHub Repository URL
                          </label>
                          <input
                            type="text"
                            value={projectForm.githubUrl || ""}
                            onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                            placeholder="https://github.com/..."
                            className="w-full bg-[#0D0F12] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1">
                          Preview Image Path or URL
                        </label>
                        <input
                          type="text"
                          value={projectForm.image || ""}
                          onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                          placeholder="/assets/template/image 17.svg"
                          className="w-full bg-[#0D0F12] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          value={
                            Array.isArray(projectForm.tags)
                              ? projectForm.tags.join(", ")
                              : projectForm.tags || ""
                          }
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              tags: e.target.value.split(",").map((t) => t.trim()),
                            })
                          }
                          placeholder="React, Next.js, Tailwind"
                          className="w-full bg-[#0D0F12] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-3">
                        <button
                          type="button"
                          onClick={() => setNewProjectModal(false)}
                          className="px-4 py-2 border border-white/20 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#C5A880] text-black text-xs font-extrabold uppercase tracking-wider hover:bg-[#B3956D]"
                        >
                          Save Project
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: INQUIRIES INBOX */}
          {activeTab === "messages" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wider text-white">
                  Contact Inquiries ({messages.length})
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Messages submitted by visitors through your contact form.
                </p>
              </div>

              {messages.length === 0 ? (
                <div className="bg-[#16191F] border border-white/10 p-12 text-center text-gray-400">
                  <Mail className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm font-semibold text-white">No inquiries yet</p>
                  <p className="text-xs text-gray-500 mt-1">
                    When visitors submit the contact form, their inquiries will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`bg-[#16191F] border p-5 space-y-3 transition-colors ${
                        msg.read ? "border-white/10 opacity-75" : "border-[#C5A880]/50 bg-[#1A1E26]"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{msg.name}</span>
                            {!msg.read && (
                              <span className="px-2 py-0.5 text-[9px] uppercase font-bold bg-emerald-500 text-black">
                                New
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 flex flex-wrap gap-4 mt-1">
                            <a href={`mailto:${msg.email}`} className="text-[#C5A880] hover:underline">
                              {msg.email}
                            </a>
                            {msg.phone && <span>Tel: {msg.phone}</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <span className="text-[11px] text-gray-500">
                            {new Date(msg.createdAt).toLocaleString()}
                          </span>
                          {!msg.read && (
                            <button
                              onClick={() => handleMarkMessageRead(msg.id)}
                              className="p-1.5 border border-white/10 hover:border-emerald-500 text-gray-400 hover:text-emerald-400"
                              title="Mark as read"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="p-1.5 border border-white/10 hover:border-rose-500 text-gray-400 hover:text-rose-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-gray-200 leading-relaxed font-light whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: SECURITY */}
          {activeTab === "security" && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wider text-white">
                  Security & Admin Password
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Change the password used to access this Admin Portal.
                </p>
              </div>

              <div className="bg-[#16191F] border border-white/10 p-6">
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                      }
                      className="w-full bg-[#0D0F12] border border-white/15 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1">
                      New Password (min 6 characters)
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                      }
                      className="w-full bg-[#0D0F12] border border-white/15 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                      }
                      className="w-full bg-[#0D0F12] border border-white/15 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3 bg-[#C5A880] hover:bg-[#B3956D] text-black font-extrabold text-xs uppercase tracking-widest transition-colors mt-2"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
