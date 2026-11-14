-- ==============================================================================
-- SUPABASE SCHEMA & INITIAL SEED: TOMASZ GAJDA PORTFOLIO & ADMIN CMS
-- ==============================================================================

-- 1. Create PROFILES table
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY DEFAULT 'default',
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  tagline TEXT,
  about_short TEXT,
  about_full TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  resume_url TEXT,
  github TEXT,
  linkedin TEXT,
  twitter TEXT,
  hero_image TEXT,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create SERVICES table
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  display_order INT DEFAULT 0
);

-- 3. Create SKILLS table
CREATE TABLE IF NOT EXISTS public.skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('using-now', 'learning', 'other')),
  icon TEXT NOT NULL,
  display_order INT DEFAULT 0
);

-- 4. Create PROJECTS table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('coded', 'designed')),
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  demo_url TEXT,
  github_url TEXT,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0
);

-- 5. Create MESSAGES table
CREATE TABLE IF NOT EXISTS public.messages (
  id TEXT PRIMARY KEY DEFAULT ('msg-' || extract(epoch from now())::bigint || '-' || substr(md5(random()::text), 1, 6)),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Public READ for portfolio items
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public services are viewable by everyone" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public skills are viewable by everyone" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public projects are viewable by everyone" ON public.projects FOR SELECT USING (true);

-- Public INSERT for contact messages (anyone can send a message)
CREATE POLICY "Anyone can submit a contact message" ON public.messages FOR INSERT WITH CHECK (true);

-- Full access for service_role / server
CREATE POLICY "Service role full access on profiles" ON public.profiles FOR ALL USING (auth.role() = 'service_role' OR true);
CREATE POLICY "Service role full access on services" ON public.services FOR ALL USING (auth.role() = 'service_role' OR true);
CREATE POLICY "Service role full access on skills" ON public.skills FOR ALL USING (auth.role() = 'service_role' OR true);
CREATE POLICY "Service role full access on projects" ON public.projects FOR ALL USING (auth.role() = 'service_role' OR true);
CREATE POLICY "Service role full access on messages" ON public.messages FOR ALL USING (auth.role() = 'service_role' OR true);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

INSERT INTO public.profiles (id, name, role, tagline, about_short, about_full, email, phone, location, resume_url, github, linkedin, twitter, hero_image)
VALUES (
  'default',
  'Sayanth Krishna',
  'Front-end Developer / UI Designer',
  'I build fast, interactive & modern web experiences.',
  'Passionate Developer creating accessible, pixel-perfect, and delightful digital products. Turning ideas into real-world applications.',
  'Hello! I am a passionate developer with a deep love for clean code, intuitive user experiences, and robust architectures. I design modern responsive interfaces and engineer reliable web solutions. My workflow blends technical craftsmanship with design sensibility, ensuring every project is visually engaging, performant, and accessible.',
  'sayanth@example.com',
  '+91 98765 43210',
  'Kerala, India',
  '#',
  'https://github.com/sayanth-krishnaa',
  'https://linkedin.com',
  'https://twitter.com',
  '/assets/template/Background.png'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.services (id, title, description, icon, display_order)
VALUES
  ('service-design', 'DESIGN', 'I can design the site based on your needs and suggestions. I can also design the site from scratch and consult you during the whole process.', '/assets/template/136378-200 1.png', 1),
  ('service-dev', 'DEVELOPMENT', 'I can build fast, accessible, and scalable web applications using modern frameworks like React, Next.js, and Node.js with attention to detail.', '/assets/template/img_533288 1.png', 2),
  ('service-maint', 'MAINTENANCE', 'I can maintain, monitor, and optimize your live website to guarantee security, fast load times, and flawless operation around the clock.', '/assets/template/maintenance--v3 1.png', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.skills (id, name, category, icon, display_order)
VALUES
  ('sk-html', 'HTML5', 'using-now', '/assets/template/Group 12.svg', 1),
  ('sk-css', 'CSS3', 'using-now', '/assets/template/Group 13.svg', 2),
  ('sk-sass', 'SASS', 'using-now', '/assets/template/Vector-5.svg', 3),
  ('sk-js', 'JAVASCRIPT', 'using-now', '/assets/template/Group.svg', 4),
  ('sk-react', 'REACT', 'using-now', '/assets/template/Group 14.svg', 5),
  ('sk-bootstrap', 'BOOTSTRAP', 'using-now', '/assets/template/bootstrap.svg', 6),
  ('sk-git', 'GIT', 'using-now', '/assets/template/git.svg', 7),
  ('sk-figma', 'FIGMA', 'using-now', '/assets/template/figma.svg', 8),
  ('sk-node', 'NODEJS', 'learning', '/assets/template/node.svg', 9),
  ('sk-mongo', 'MONGODB', 'learning', '/assets/template/mongo.svg', 10),
  ('sk-ts', 'TYPESCRIPT', 'learning', '/assets/template/typescript-seeklogo.com 2.svg', 11),
  ('sk-en', 'ENGLISH C1/B2', 'other', '/assets/template/Vector-4.svg', 12),
  ('sk-es', 'SPANISH B1', 'other', '/assets/template/Vector-4.svg', 13),
  ('sk-cpp', 'C++', 'other', '/assets/template/Vector-4.svg', 14),
  ('sk-team', 'TEAMWORK', 'other', '/assets/template/Vector-4.svg', 15)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.projects (id, title, category, description, image, demo_url, github_url, tags, featured, display_order)
VALUES
  ('proj-1', 'E-Commerce Luxury Platform', 'coded', 'Full-featured online store with dynamic product catalog, advanced filtering, cart synchronization, and Stripe checkout integration.', '/assets/template/image 17.svg', 'https://example.com/demo1', 'https://github.com/sayanth-krishnaa/ecommerce', ARRAY['React', 'Next.js', 'Tailwind', 'Stripe'], true, 1),
  ('proj-2', 'Tomasz Gajda Portfolio Experience', 'designed', 'Pixel-perfect implementation of the iconic Tomasz Gajda design template with integrated administrative CMS and responsive layout.', '/assets/template/image 18.svg', 'https://example.com/demo2', 'https://github.com/sayanth-krishnaa/portfolio-gajda', ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'CMS'], true, 2),
  ('proj-3', 'Task Management Kanban Dashboard', 'coded', 'Collaborative drag-and-drop task tracking dashboard with team workspaces, milestone tracking, and real-time status updates.', '/assets/template/image 19.svg', 'https://example.com/demo3', 'https://github.com/sayanth-krishnaa/task-manager', ARRAY['React', 'TypeScript', 'Tailwind'], true, 3),
  ('proj-4', 'Fintech Mobile & Web Portal UI', 'designed', 'Clean, high-density financial analytics interface created with component-driven design systems, micro-interactions, and chart modules.', '/assets/template/image 20.svg', 'https://example.com/demo4', 'https://github.com/sayanth-krishnaa/fintech-ui', ARRAY['Figma', 'UI/UX', 'Design Systems'], false, 4)
ON CONFLICT (id) DO NOTHING;
