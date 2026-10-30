import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProjectsPage() {
  const { projects, categories, settings, loading } = usePortfolioData();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') ?? 'all';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return projects;
    return projects.filter((p) => p.category?.slug === activeCategory);
  }, [projects, activeCategory]);

  const setCategory = (slug: string) => {
    if (slug === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: slug });
    }
  };

  return (
    <>
      <Navbar designerName={settings['designer_name'] ?? 'Beshoy Fady'} />
      <main className="min-h-screen pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <span className="text-xs font-semibold tracking-[0.3em] text-purple-light uppercase mb-4 block">
              All Projects
            </span>
            <h1 className="font-display font-bold text-4xl md:text-6xl text-white leading-tight">
              The Full Collection
            </h1>
          </motion.div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-3 mb-12">
            <FilterButton
              active={activeCategory === 'all'}
              onClick={() => setCategory('all')}
              label="All"
            />
            {categories.map((cat) => (
              <FilterButton
                key={cat.id}
                active={activeCategory === cat.slug}
                onClick={() => setCategory(cat.slug)}
                label={cat.name}
              />
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 rounded-full border-2 border-purple/20 border-t-purple-light animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted text-sm">
                No projects in this category yet.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: index * 0.06 }}
                  >
                    <Link
                      to={`/project/${project.slug}`}
                      className="group block relative aspect-[3/4] rounded-2xl overflow-hidden glass-card hover:border-purple/30 transition-all"
                    >
                      <img
                        src={project.cover_image ?? ''}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-1.08"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <span className="text-xs font-medium text-purple-light tracking-wide uppercase mb-2 block">
                          {project.category?.name ?? 'Design'}
                        </span>
                        <div className="flex items-end justify-between">
                          <h3 className="font-display font-semibold text-xl text-white leading-tight">
                            {project.title}
                          </h3>
                          <ArrowUpRight
                            size={20}
                            className="text-white/70 group-hover:text-purple-light transition-all group-hover:translate-x-1 group-hover:-translate-y-1 flex-shrink-0 ml-2"
                          />
                        </div>
                        {project.description && (
                          <p className="text-sm text-muted mt-2 line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
      <Footer
        designerName={settings['designer_name'] ?? 'Beshoy Fady'}
        email={settings['contact_email'] ?? ''}
      />
    </>
  );
}

function FilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        active
          ? 'bg-gradient-to-r from-purple to-purple-dark text-white glow-soft'
          : 'glass text-muted hover:text-white hover:border-purple/30'
      }`}
    >
      {label}
    </button>
  );
}
