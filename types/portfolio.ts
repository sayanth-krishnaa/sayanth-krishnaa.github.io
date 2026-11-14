import { z } from "zod";

export const ProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  tagline: z.string().min(1, "Tagline is required"),
  aboutShort: z.string(),
  aboutFull: z.string(),
  email: z.string().email("Invalid email address"),
  phone: z.string(),
  location: z.string(),
  resumeUrl: z.string(),
  github: z.string(),
  linkedin: z.string(),
  twitter: z.string(),
  heroImage: z.string(),
});

export type Profile = z.infer<typeof ProfileSchema>;

export const ExploreServiceSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string(),
});

export type ExploreService = z.infer<typeof ExploreServiceSchema>;

export const SkillCategorySchema = z.enum(["using-now", "learning", "other"]);
export type SkillCategory = z.infer<typeof SkillCategorySchema>;

export const SkillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Skill name is required"),
  category: SkillCategorySchema,
  icon: z.string(),
  proficiency: z.string().optional(),
});

export type Skill = z.infer<typeof SkillSchema>;

export const ProjectCategorySchema = z.enum(["coded", "designed"]);
export type ProjectCategory = z.infer<typeof ProjectCategorySchema>;

export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Project title is required"),
  category: ProjectCategorySchema,
  description: z.string().min(1, "Description is required"),
  image: z.string(),
  demoUrl: z.string(),
  githubUrl: z.string(),
  tags: z.array(z.string()),
  featured: z.boolean().default(false),
});

export type Project = z.infer<typeof ProjectSchema>;

export const ContactMessageSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  message: z.string().min(5, "Message must be at least 5 characters"),
  createdAt: z.string(),
  read: z.boolean().default(false),
});

export type ContactMessage = z.infer<typeof ContactMessageSchema>;

export interface PortfolioData {
  profile: Profile;
  services: ExploreService[];
  skills: Skill[];
  projects: Project[];
  admin: {
    username: string;
    passwordHash: string;
  };
}
