import type {
  About,
  Category,
  Project,
  ProjectImage,
  Service,
  SiteSettings,
} from '@/types';
import { isSupabaseConfigured, supabase } from './supabase.ts';

export async function fetchCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchProjects(options?: {
  featuredOnly?: boolean;
  categorySlug?: string;
}): Promise<Project[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  let query = supabase
    .from('projects')
    .select('*, category:categories(*)')
    .eq('is_published', true)
    .order('sort_order', { ascending: true });
  if (options?.featuredOnly) {
    query = query.eq('is_featured', true);
  }
  const { data, error } = await query;
  if (error) throw error;
  if (!data) return [];
  if (options?.categorySlug) {
    return data.filter((p) => p.category?.slug === options.categorySlug);
  }
  return data;
}

export async function fetchAllProjectsAdmin(): Promise<Project[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase
    .from('projects')
    .select('*, category:categories(*)')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase
    .from('projects')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const { data: images } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', data.id)
    .order('sort_order', { ascending: true });
  return { ...data, project_images: (images as ProjectImage[]) ?? [] };
}

export async function fetchServices(): Promise<Service[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchAllServicesAdmin(): Promise<Service[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured || !supabase) return {};
  const { data, error } = await supabase.from('site_settings').select('*');
  if (error) throw error;
  if (!data) return {};
  const settings: SiteSettings = {};
  for (const row of data) {
    settings[row.setting_key] = row.setting_value ?? '';
  }
  return settings;
}

export async function fetchAbout(): Promise<About | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase
    .from('about')
    .select('*')
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}
