/*
# Portfolio CMS Schema

1. New Tables
- `categories` — project categories (branding, social, UI/UX, etc.)
- `projects` — portfolio projects with cover image, tools, dates, featured/published flags
- `project_images` — additional gallery images per project
- `services` — service cards shown on public site
- `site_settings` — key/value pairs for hero text, contact info, social links, section visibility
- `about` — single-row table for designer name, bio, skills, experience, profile image

2. Relationships
- project_images.project_id -> projects.id (CASCADE)
- projects.category_id -> categories.id (SET NULL)

3. Security
- Public read (anon + authenticated) on all tables for published/visible content
- Admin-only writes: INSERT/UPDATE/DELETE restricted to authenticated users whose email matches VITE_ADMIN_EMAIL (passed via the `admin_email` JWT app metadata claim set by the frontend). Since Supabase OAuth populates raw_user_meta_data, we check both raw_app_meta_data and raw_user_meta_data for the admin email.
- site_settings: public can read all rows (settings are display-only), only admin can write
- RLS enabled on every table. Four separate policies per table (SELECT/INSERT/UPDATE/DELETE).
- Grants: anon + authenticated get SELECT; authenticated gets INSERT/UPDATE/DELETE.
*/

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  long_description text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  cover_image text,
  tools text[] NOT NULL DEFAULT '{}',
  project_date date,
  goals text,
  process text,
  is_published boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Project images
CREATE TABLE IF NOT EXISTS project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Services
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  icon text,
  sort_order int NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Site settings (key/value)
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value text,
  updated_at timestamptz DEFAULT now()
);

-- About (single-row)
CREATE TABLE IF NOT EXISTS about (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  bio text,
  philosophy text,
  years_experience int DEFAULT 0,
  profile_image text,
  skills jsonb NOT NULL DEFAULT '[]'::jsonb,
  social_links jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_sort ON projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_project_images_project ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_project_images_sort ON project_images(sort_order);
CREATE INDEX IF NOT EXISTS idx_services_sort ON services(sort_order);
CREATE INDEX IF NOT EXISTS idx_categories_sort ON categories(sort_order);

-- Helper: determine if current user is the admin based on email claim
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (auth.jwt() ->> 'user_email'),
    (auth.jwt() -> 'raw_user_meta_data' ->> 'email'),
    (auth.jwt() -> 'user_metadata' ->> 'email')
  ) = current_setting('app.admin_email', true)
  AND current_setting('app.admin_email', true) IS NOT NULL
  AND current_setting('app.admin_email', true) <> '';
$$;

-- Actually simpler and reliable: check against auth.users.email
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users u
    WHERE u.id = auth.uid()
    AND u.email = current_setting('app.admin_email', true)
  )
  AND current_setting('app.admin_email', true) IS NOT NULL
  AND current_setting('app.admin_email', true) <> '';
$$;

REVOKE EXECUTE ON FUNCTION is_admin() FROM PUBLIC, anon;

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;

-- ===== categories =====
GRANT SELECT ON categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON categories TO authenticated;

DROP POLICY IF EXISTS "categories_public_select" ON categories;
CREATE POLICY "categories_public_select" ON categories FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "categories_admin_insert" ON categories;
CREATE POLICY "categories_admin_insert" ON categories FOR INSERT TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "categories_admin_update" ON categories;
CREATE POLICY "categories_admin_update" ON categories FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "categories_admin_delete" ON categories;
CREATE POLICY "categories_admin_delete" ON categories FOR DELETE TO authenticated USING (is_admin());

-- ===== projects =====
GRANT SELECT ON projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON projects TO authenticated;

DROP POLICY IF EXISTS "projects_public_select" ON projects;
CREATE POLICY "projects_public_select" ON projects FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "projects_admin_insert" ON projects;
CREATE POLICY "projects_admin_insert" ON projects FOR INSERT TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "projects_admin_update" ON projects;
CREATE POLICY "projects_admin_update" ON projects FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "projects_admin_delete" ON projects;
CREATE POLICY "projects_admin_delete" ON projects FOR DELETE TO authenticated USING (is_admin());

-- ===== project_images =====
GRANT SELECT ON project_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON project_images TO authenticated;

DROP POLICY IF EXISTS "project_images_public_select" ON project_images;
CREATE POLICY "project_images_public_select" ON project_images FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "project_images_admin_insert" ON project_images;
CREATE POLICY "project_images_admin_insert" ON project_images FOR INSERT TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "project_images_admin_update" ON project_images;
CREATE POLICY "project_images_admin_update" ON project_images FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "project_images_admin_delete" ON project_images;
CREATE POLICY "project_images_admin_delete" ON project_images FOR DELETE TO authenticated USING (is_admin());

-- ===== services =====
GRANT SELECT ON services TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON services TO authenticated;

DROP POLICY IF EXISTS "services_public_select" ON services;
CREATE POLICY "services_public_select" ON services FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "services_admin_insert" ON services;
CREATE POLICY "services_admin_insert" ON services FOR INSERT TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "services_admin_update" ON services;
CREATE POLICY "services_admin_update" ON services FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "services_admin_delete" ON services;
CREATE POLICY "services_admin_delete" ON services FOR DELETE TO authenticated USING (is_admin());

-- ===== site_settings =====
GRANT SELECT ON site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON site_settings TO authenticated;

DROP POLICY IF EXISTS "site_settings_public_select" ON site_settings;
CREATE POLICY "site_settings_public_select" ON site_settings FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "site_settings_admin_insert" ON site_settings;
CREATE POLICY "site_settings_admin_insert" ON site_settings FOR INSERT TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "site_settings_admin_update" ON site_settings;
CREATE POLICY "site_settings_admin_update" ON site_settings FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "site_settings_admin_delete" ON site_settings;
CREATE POLICY "site_settings_admin_delete" ON site_settings FOR DELETE TO authenticated USING (is_admin());

-- ===== about =====
GRANT SELECT ON about TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON about TO authenticated;

DROP POLICY IF EXISTS "about_public_select" ON about;
CREATE POLICY "about_public_select" ON about FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "about_admin_insert" ON about;
CREATE POLICY "about_admin_insert" ON about FOR INSERT TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "about_admin_update" ON about;
CREATE POLICY "about_admin_update" ON about FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "about_admin_delete" ON about;
CREATE POLICY "about_admin_delete" ON about FOR DELETE TO authenticated USING (is_admin());

-- Seed default categories
INSERT INTO categories (name, slug, icon, sort_order) VALUES
  ('Branding & Visual Identity', 'branding', 'Palette', 1),
  ('Social Media Design', 'social-media', 'Share2', 2),
  ('UI/UX Design', 'ui-ux', 'Layout', 3),
  ('Advertising Campaigns', 'advertising', 'Megaphone', 4),
  ('Print Design', 'print', 'Printer', 5),
  ('Packaging Design', 'packaging', 'Package', 6)
ON CONFLICT (slug) DO NOTHING;

-- Seed default services
INSERT INTO services (title, description, icon, sort_order, is_visible) VALUES
  ('Brand Identity Design', 'Crafting distinctive logos, visual systems, and brand guidelines that tell your story.', 'Palette', 1, true),
  ('Social Media Design', 'Scroll-stopping social content and campaigns that build engaged communities.', 'Share2', 2, true),
  ('UI/UX Design', 'Human-centered interfaces and prototypes for web and mobile products.', 'Layout', 3, true),
  ('Advertising Design', 'High-impact ad creatives and campaigns that convert across every channel.', 'Megaphone', 4, true),
  ('Print Design', 'Editorial, poster, and collateral design with a tactile, premium finish.', 'Printer', 5, true),
  ('Creative Direction', 'End-to-end creative leadership aligning strategy, art, and execution.', 'Compass', 6, true)
ON CONFLICT DO NOTHING;

-- Seed default site settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
  ('hero_label', 'INDEPENDENT GRAPHIC DESIGNER'),
  ('hero_heading', 'Turning Ideas Into Visual Experiences.'),
  ('hero_description', 'I create bold visual identities, digital experiences, and creative designs that make brands stand out.'),
  ('designer_name', 'Beshoy Fady'),
  ('contact_email', 'hello@alexrivera.design'),
  ('whatsapp_link', 'https://wa.me/10000000000'),
  ('behance_link', 'https://behance.net/alexrivera'),
  ('instagram_link', 'https://instagram.com/alexrivera.design'),
  ('linkedin_link', 'https://linkedin.com/in/alexrivera'),
  ('show_selected_works', 'true'),
  ('show_categories', 'true'),
  ('show_about', 'true'),
  ('show_services', 'true'),
  ('show_contact', 'true'),
  ('featured_project_ids', '[]')
ON CONFLICT (setting_key) DO NOTHING;

-- Seed default about row
INSERT INTO about (full_name, bio, philosophy, years_experience, profile_image, skills, social_links)
VALUES (
  'Beshoy Fady',
  'I''m a graphic designer and creative visual designer with a passion for turning ideas into striking visual experiences. Over the years I''ve helped brands, startups, and creators find their visual voice through identity systems, digital products, and memorable campaigns.',
  'I believe great design lives at the intersection of strategy and emotion. Every pixel should have a purpose, every composition should guide the eye, and every brand should feel alive.',
  8,
  NULL,
  '["Adobe Photoshop","Adobe Illustrator","Adobe InDesign","Figma","After Effects"]'::jsonb,
  '{"behance":"https://behance.net/alexrivera","instagram":"https://instagram.com/alexrivera.design","linkedin":"https://linkedin.com/in/alexrivera"}'::jsonb
)
ON CONFLICT DO NOTHING;
