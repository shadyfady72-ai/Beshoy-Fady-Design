
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  sort_order: number;
  created_at: string;
  name_ar?: string | null;
}

export interface Project {
  id: string;
  title: string;
  title_ar?: string | null;
  slug: string;
  description: string | null;
  description_ar?: string | null;
  long_description: string | null;
  long_description_ar?: string | null;
  category_id: string | null;
  cover_image: string | null;
  tools: string[];
  project_date: string | null;
  goals: string | null;
  goals_ar?: string | null;
  process: string | null;
  process_ar?: string | null;
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
  bio_ar?: string | null;
  philosophy: string | null;
  philosophy_ar?: string | null;
  years_experience: number;
  profile_image: string | null;
  skills: string[];
  social_links: Record<string, string>;
  updated_at: string;
}
