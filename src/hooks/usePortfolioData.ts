import { useEffect, useState } from 'react';
import type {
  About,
  Category,
  Project,
  Service,
  SiteSettings,
} from '@/types';
import {
  fetchAbout,
  fetchCategories,
  fetchProjects,
  fetchServices,
  fetchSiteSettings,
} from '@/lib/data';

interface PortfolioData {
  categories: Category[];
  projects: Project[];
  services: Service[];
  settings: SiteSettings;
  about: About | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const emptySettings: SiteSettings = {
  hero_label: 'INDEPENDENT GRAPHIC DESIGNER',
  hero_heading: 'Turning Ideas Into Visual Experiences.',
  hero_description:
    'I create bold visual identities, digital experiences, and creative designs that make brands stand out.',
  designer_name: 'Beshoy Fady',
  contact_email: 'hello@beshoyfady.design',
  whatsapp_link: 'https://wa.me/10000000000',
  behance_link: 'https://behance.net/beshoyfady',
  instagram_link: 'https://instagram.com/beshoyfady.design',
  linkedin_link: 'https://linkedin.com/in/beshoyfady',
  show_selected_works: 'true',
  show_categories: 'true',
  show_about: 'true',
  show_services: 'true',
  show_contact: 'true',
  featured_project_ids: '[]',
};

export function usePortfolioData(): PortfolioData {
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(emptySettings);
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const [cats, projs, servs, sett, abt] = await Promise.all([
        fetchCategories(),
        fetchProjects(),
        fetchServices(),
        fetchSiteSettings(),
        fetchAbout(),
      ]);
      setCategories(cats);
      setProjects(projs);
      setServices(servs);
      setSettings({ ...emptySettings, ...sett });
      setAbout(abt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return {
    categories,
    projects,
    services,
    settings,
    about,
    loading,
    error,
    refresh,
  };
}
