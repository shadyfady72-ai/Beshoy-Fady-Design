import { usePortfolioData } from '@/hooks/usePortfolioData';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SelectedWorks from '@/components/SelectedWorks';
import Categories from '@/components/Categories';
import AboutSection from '@/components/AboutSection';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function HomePage() {
  const { projects, categories, settings, about, loading, error } =
    usePortfolioData();

  const designerName = settings['designer_name'] ?? 'Beshoy Fady';

  const projectCounts = categories.reduce<Record<string, number>>((acc, cat) => {
    acc[cat.slug] = projects.filter((p) => p.category?.slug === cat.slug).length;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-purple/20 border-t-purple-light animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-red-400 text-sm mb-2">Failed to load content</p>
          <p className="text-xs text-muted">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar designerName={designerName} />
      <main>
        <Hero
          label={settings['hero_label'] ?? 'INDEPENDENT GRAPHIC DESIGNER'}
          heading={settings['hero_heading'] ?? 'Turning Ideas Into Visual Experiences.'}
          description={
            settings['hero_description'] ??
            'I create bold visual identities, digital experiences, and creative designs that make brands stand out.'
          }
          designerName={designerName}
          socialLinks={{
            behance: settings['behance_link'],
            instagram: settings['instagram_link'],
            linkedin: settings['linkedin_link'],
          }}
        />

        {settings['show_about'] !== 'false' && <AboutSection about={about} />}

        {settings['show_selected_works'] !== 'false' && (
          <SelectedWorks projects={projects} />
        )}

        {settings['show_categories'] !== 'false' && (
          <Categories categories={categories} projectCounts={projectCounts} />
        )}

        {settings['show_contact'] !== 'false' && (
          <Contact
            email={settings['contact_email'] ?? ''}
            whatsapp={settings['whatsapp_link'] ?? ''}
            behance={settings['behance_link'] ?? ''}
            instagram={settings['instagram_link'] ?? ''}
            linkedin={settings['linkedin_link'] ?? ''}
          />
        )}
      </main>
      <Footer designerName={designerName} email={settings['contact_email'] ?? ''} />
    </>
  );
}
