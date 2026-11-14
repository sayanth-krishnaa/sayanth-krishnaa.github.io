import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { PortfolioData, ContactMessage, Skill, Project, ExploreService, Profile } from "@/types/portfolio";
import { isSupabaseConfigured, getSupabaseAdmin } from "./supabase";

const DATA_DIR = path.join(process.cwd(), "data");
const PORTFOLIO_FILE = path.join(DATA_DIR, "portfolio.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

function ensureDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

const DEFAULT_PROFILE: Profile = {
  name: "Sayanth Krishna",
  role: "Front-end Developer / UI Designer",
  tagline: "I build fast, interactive & modern web experiences.",
  aboutShort: "Passionate Developer creating accessible, pixel-perfect, and delightful digital products. Turning ideas into real-world applications.",
  aboutFull: "Hello! I am a passionate developer with a deep love for clean code, intuitive user experiences, and robust architectures. I design modern responsive interfaces and engineer reliable web solutions. My workflow blends technical craftsmanship with design sensibility, ensuring every project is visually engaging, performant, and accessible.",
  email: "sayanth@example.com",
  phone: "+91 98765 43210",
  location: "Kerala, India",
  resumeUrl: "#",
  github: "https://github.com/sayanth-krishnaa",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
  heroImage: "/assets/template/Background.png",
};

const DEFAULT_SERVICES: ExploreService[] = [
  {
    id: "service-design",
    title: "DESIGN",
    description: "I can design the site based on your needs and suggestions. I can also design the site from scratch and consult you during the whole process.",
    icon: "/assets/template/136378-200 1.png",
  },
  {
    id: "service-dev",
    title: "DEVELOPMENT",
    description: "I can build fast, accessible, and scalable web applications using modern frameworks like React, Next.js, and Node.js with attention to detail.",
    icon: "/assets/template/img_533288 1.png",
  },
  {
    id: "service-maint",
    title: "MAINTENANCE",
    description: "I can maintain, monitor, and optimize your live website to guarantee security, fast load times, and flawless operation around the clock.",
    icon: "/assets/template/maintenance--v3 1.png",
  },
];

const DEFAULT_SKILLS: Skill[] = [
  { id: "sk-html", name: "HTML5", category: "using-now", icon: "/assets/template/Group 12.svg" },
  { id: "sk-css", name: "CSS3", category: "using-now", icon: "/assets/template/Group 13.svg" },
  { id: "sk-sass", name: "SASS", category: "using-now", icon: "/assets/template/Vector-5.svg" },
  { id: "sk-js", name: "JAVASCRIPT", category: "using-now", icon: "/assets/template/Group.svg" },
  { id: "sk-react", name: "REACT", category: "using-now", icon: "/assets/template/Group 14.svg" },
  { id: "sk-bootstrap", name: "BOOTSTRAP", category: "using-now", icon: "/assets/template/bootstrap.svg" },
  { id: "sk-git", name: "GIT", category: "using-now", icon: "/assets/template/git.svg" },
  { id: "sk-figma", name: "FIGMA", category: "using-now", icon: "/assets/template/figma.svg" },
  { id: "sk-node", name: "NODEJS", category: "learning", icon: "/assets/template/node.svg" },
  { id: "sk-mongo", name: "MONGODB", category: "learning", icon: "/assets/template/mongo.svg" },
  { id: "sk-ts", name: "TYPESCRIPT", category: "learning", icon: "/assets/template/typescript-seeklogo.com 2.svg" },
  { id: "sk-en", name: "ENGLISH C1/B2", category: "other", icon: "/assets/template/Vector-4.svg" },
  { id: "sk-es", name: "SPANISH B1", category: "other", icon: "/assets/template/Vector-4.svg" },
  { id: "sk-cpp", name: "C++", category: "other", icon: "/assets/template/Vector-4.svg" },
  { id: "sk-team", name: "TEAMWORK", category: "other", icon: "/assets/template/Vector-4.svg" },
];

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "E-Commerce Luxury Platform",
    category: "coded",
    description: "Full-featured online store with dynamic product catalog, advanced filtering, cart synchronization, and Stripe checkout integration.",
    image: "/assets/template/image 17.svg",
    demoUrl: "https://example.com/demo1",
    githubUrl: "https://github.com/sayanth-krishnaa/ecommerce",
    tags: ["React", "Next.js", "Tailwind", "Stripe"],
    featured: true,
  },
  {
    id: "proj-2",
    title: "Tomasz Gajda Portfolio Experience",
    category: "designed",
    description: "Pixel-perfect implementation of the iconic Tomasz Gajda design template with integrated administrative CMS and responsive layout.",
    image: "/assets/template/image 18.svg",
    demoUrl: "https://example.com/demo2",
    githubUrl: "https://github.com/sayanth-krishnaa/portfolio-gajda",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "CMS"],
    featured: true,
  },
  {
    id: "proj-3",
    title: "Task Management Kanban Dashboard",
    category: "coded",
    description: "Collaborative drag-and-drop task tracking dashboard with team workspaces, milestone tracking, and real-time status updates.",
    image: "/assets/template/image 19.svg",
    demoUrl: "https://example.com/demo3",
    githubUrl: "https://github.com/sayanth-krishnaa/task-manager",
    tags: ["React", "TypeScript", "Tailwind"],
    featured: true,
  },
  {
    id: "proj-4",
    title: "Fintech Mobile & Web Portal UI",
    category: "designed",
    description: "Clean, high-density financial analytics interface created with component-driven design systems, micro-interactions, and chart modules.",
    image: "/assets/template/image 20.svg",
    demoUrl: "https://example.com/demo4",
    githubUrl: "https://github.com/sayanth-krishnaa/fintech-ui",
    tags: ["Figma", "UI/UX", "Design Systems"],
    featured: false,
  },
];

export async function getPortfolioData(): Promise<PortfolioData> {
  const sb = getSupabaseAdmin();

  // If Supabase is configured, fetch directly from Supabase tables
  if (sb) {
    try {
      const [profileRes, servicesRes, skillsRes, projectsRes] = await Promise.all([
        sb.from("profiles").select("*").eq("id", "default").maybeSingle(),
        sb.from("services").select("*").order("display_order", { ascending: true }),
        sb.from("skills").select("*").order("display_order", { ascending: true }),
        sb.from("projects").select("*").order("display_order", { ascending: true }),
      ]);

      const profile: Profile = profileRes.data
        ? {
            name: profileRes.data.name,
            role: profileRes.data.role,
            tagline: profileRes.data.tagline || "",
            aboutShort: profileRes.data.about_short || "",
            aboutFull: profileRes.data.about_full || "",
            email: profileRes.data.email,
            phone: profileRes.data.phone || "",
            location: profileRes.data.location || "",
            resumeUrl: profileRes.data.resume_url || "#",
            github: profileRes.data.github || "",
            linkedin: profileRes.data.linkedin || "",
            twitter: profileRes.data.twitter || "",
            heroImage: profileRes.data.hero_image || "/assets/template/Background.png",
          }
        : DEFAULT_PROFILE;

      const services: ExploreService[] =
        servicesRes.data && servicesRes.data.length > 0
          ? servicesRes.data.map((s) => ({
              id: s.id,
              title: s.title,
              description: s.description,
              icon: s.icon,
            }))
          : DEFAULT_SERVICES;

      const skills: Skill[] =
        skillsRes.data && skillsRes.data.length > 0
          ? skillsRes.data.map((s) => ({
              id: s.id,
              name: s.name,
              category: s.category,
              icon: s.icon,
            }))
          : DEFAULT_SKILLS;

      const projects: Project[] =
        projectsRes.data && projectsRes.data.length > 0
          ? projectsRes.data.map((p) => ({
              id: p.id,
              title: p.title,
              category: p.category,
              description: p.description,
              image: p.image,
              demoUrl: p.demo_url || "",
              githubUrl: p.github_url || "",
              tags: p.tags || [],
              featured: !!p.featured,
            }))
          : DEFAULT_PROJECTS;

      return {
        profile,
        services,
        skills,
        projects,
        admin: {
          username: "admin@portfolio.local",
          passwordHash: bcrypt.hashSync("admin12345", 10),
        },
      };
    } catch (err) {
      console.warn("Supabase query error, falling back to local file store:", err);
    }
  }

  // Fallback to local atomic file store
  ensureDirectoryExists();
  if (!fs.existsSync(PORTFOLIO_FILE)) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync("admin12345", salt);

    const initialData: PortfolioData = {
      profile: DEFAULT_PROFILE,
      services: DEFAULT_SERVICES,
      skills: DEFAULT_SKILLS,
      projects: DEFAULT_PROJECTS,
      admin: {
        username: "admin@portfolio.local",
        passwordHash,
      },
    };
    fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(initialData, null, 2), "utf8");
    return initialData;
  }

  const raw = fs.readFileSync(PORTFOLIO_FILE, "utf8");
  return JSON.parse(raw) as PortfolioData;
}

export async function savePortfolioData(data: PortfolioData): Promise<void> {
  const sb = getSupabaseAdmin();

  // If Supabase is configured, sync directly to Supabase tables
  if (sb) {
    try {
      await Promise.all([
        sb.from("profiles").upsert({
          id: "default",
          name: data.profile.name,
          role: data.profile.role,
          tagline: data.profile.tagline,
          about_short: data.profile.aboutShort,
          about_full: data.profile.aboutFull,
          email: data.profile.email,
          phone: data.profile.phone,
          location: data.profile.location,
          resume_url: data.profile.resumeUrl,
          github: data.profile.github,
          linkedin: data.profile.linkedin,
          twitter: data.profile.twitter,
          hero_image: data.profile.heroImage,
          updated_at: new Date().toISOString(),
        }),
        sb.from("services").upsert(
          data.services.map((s, index) => ({
            id: s.id,
            title: s.title,
            description: s.description,
            icon: s.icon,
            display_order: index + 1,
          }))
        ),
        sb.from("skills").upsert(
          data.skills.map((s, index) => ({
            id: s.id,
            name: s.name,
            category: s.category,
            icon: s.icon,
            display_order: index + 1,
          }))
        ),
        sb.from("projects").upsert(
          data.projects.map((p, index) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            description: p.description,
            image: p.image,
            demo_url: p.demoUrl,
            github_url: p.githubUrl,
            tags: p.tags,
            featured: p.featured,
            display_order: index + 1,
          }))
        ),
      ]);
    } catch (err) {
      console.warn("Supabase upsert error, syncing to local file store:", err);
    }
  }

  // Always keep local file store in sync as well
  ensureDirectoryExists();
  const tempPath = `${PORTFOLIO_FILE}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tempPath, PORTFOLIO_FILE);
}

export async function getMessages(): Promise<ContactMessage[]> {
  const sb = getSupabaseAdmin();
  if (sb) {
    try {
      const { data, error } = await sb
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map((m) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          phone: m.phone || undefined,
          message: m.message,
          read: !!m.read,
          createdAt: m.created_at,
        }));
      }
    } catch (err) {
      console.warn("Supabase messages query error:", err);
    }
  }

  ensureDirectoryExists();
  if (!fs.existsSync(MESSAGES_FILE)) {
    return [];
  }
  const raw = fs.readFileSync(MESSAGES_FILE, "utf8");
  return JSON.parse(raw) as ContactMessage[];
}

export async function addMessage(data: { name: string; email: string; phone?: string; message: string }): Promise<ContactMessage> {
  const newMsg: ContactMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    createdAt: new Date().toISOString(),
    read: false,
  };

  const sb = getSupabaseAdmin();
  if (sb) {
    try {
      await sb.from("messages").insert({
        id: newMsg.id,
        name: newMsg.name,
        email: newMsg.email,
        phone: newMsg.phone,
        message: newMsg.message,
        read: false,
        created_at: newMsg.createdAt,
      });
    } catch (err) {
      console.warn("Supabase message insert error:", err);
    }
  }

  const current = await getMessages();
  current.unshift(newMsg);
  
  ensureDirectoryExists();
  const tempPath = `${MESSAGES_FILE}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(current, null, 2), "utf8");
  fs.renameSync(tempPath, MESSAGES_FILE);
  return newMsg;
}

export async function markMessageRead(id: string): Promise<void> {
  const sb = getSupabaseAdmin();
  if (sb) {
    try {
      await sb.from("messages").update({ read: true }).eq("id", id);
    } catch (err) {
      console.warn("Supabase message update error:", err);
    }
  }

  const messages = await getMessages();
  const updated = messages.map(m => m.id === id ? { ...m, read: true } : m);
  ensureDirectoryExists();
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(updated, null, 2), "utf8");
}

export async function deleteMessage(id: string): Promise<void> {
  const sb = getSupabaseAdmin();
  if (sb) {
    try {
      await sb.from("messages").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase message delete error:", err);
    }
  }

  const messages = await getMessages();
  const updated = messages.filter(m => m.id !== id);
  ensureDirectoryExists();
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(updated, null, 2), "utf8");
}
