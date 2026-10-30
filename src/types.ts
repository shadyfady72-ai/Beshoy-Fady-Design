export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  sort_order: number;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  category_id: string | null;
  cover_image: string | null;
  tools: string[];
  project_date: string | null;
  goals: string | null;
  process: string | null;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  category?: Category | null;
  project_images?: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  updated_at: string;
}

export type SiteSettings = Record<string, string>;

export interface About {
  id: string;
  full_name: string;
  bio: string | null;
  philosophy: string | null;
  years_experience: number;
  profile_image: string | null;
  skills: string[];
  social_links: Record<string, string>;
  updated_at: string;
}
