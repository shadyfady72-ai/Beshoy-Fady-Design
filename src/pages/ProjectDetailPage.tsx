import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Wrench,
  Target,
  GitBranch,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { fetchProjectBySlug, fetchProjects } from '@/lib/data';
import type { Project } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { usePortfolioData } from '@/hooks/usePortfolioData';

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { settings } = usePortfolioData();
  const [project, setProject] = useState<Project | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    Promise.all([fetchProjectBySlug(slug), fetchProjects()])
      .then(([proj, projs]) => {
        if (!proj) {
          setError('Project not found');
          setProject(null);
        } else {
          setProject(proj);
        }
        setAllProjects(projs);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject =
    currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  if (loading) {
    return (
      <>
        <Navbar designerName={settings['designer_name'] ?? 'Beshoy Fady'} />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="w-12 h-12 rounded-full border-2 border-purple/20 border-t-purple-light animate-spin" />
        </div>
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <Navbar designerName={settings['designer_name'] ?? 'Beshoy Fady'} />
        <div className="min-h-screen flex items-center justify-center pt-20 px-6">
          <div className="text-center">
            <p className="text-red-400 text-sm mb-4">{error ?? 'Project not found'}</p>
            <Link
              to="/projects"
              className="text-purple-light hover:text-white transition-colors text-sm"
            >
              Back to all projects
            </Link>
          </div>
        </div>
      </>
    );
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <>
      <Navbar designerName={settings['designer_name'] ?? 'Beshoy Fady'} />
      <main className="min-h-screen pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          {/* Back link */}
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to All Projects
          </Link>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-12 glow-soft"
          >
            <img
              src={project.cover_image ?? ''}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
          </motion.div>

          {/* Title + meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <span className="text-xs font-semibold tracking-[0.3em] text-purple-light uppercase mb-3 block">
              {project.category?.name ?? 'Design'}
            </span>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-white leading-tight mb-6">
              {project.title}
            </h1>
            {project.description && (
              <p className="text-lg text-muted leading-relaxed max-w-3xl">
                {project.description}
              </p>
            )}
          </motion.div>

          {/* Meta grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {formatDate(project.project_date) && (
              <MetaCard
                icon={<Calendar size={18} className="text-purple-light" />}
                label="Project Date"
                value={formatDate(project.project_date)!}
              />
            )}
            {project.tools.length > 0 && (
              <MetaCard
                icon={<Wrench size={18} className="text-purple-light" />}
                label="Tools Used"
                value={project.tools.join(', ')}
              />
            )}
            {project.category?.name && (
              <MetaCard
                icon={<Target size={18} className="text-purple-light" />}
                label="Category"
                value={project.category.name}
              />
            )}
          </div>

          {/* Description */}
          {project.long_description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="font-display font-semibold text-2xl text-white mb-5">
                About the Project
              </h2>
              <p className="text-base text-muted leading-relaxed whitespace-pre-line">
                {project.long_description}
              </p>
            </motion.div>
          )}

          {/* Goals */}
          {project.goals && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="flex items-center gap-2 mb-5">
                <Target size={20} className="text-purple-light" />
                <h2 className="font-display font-semibold text-2xl text-white">
                  Project Goals
                </h2>
              </div>
              <p className="text-base text-muted leading-relaxed bg-ink-soft/50 rounded-2xl p-6 border border-white/[0.04]">
                {project.goals}
              </p>
            </motion.div>
          )}

          {/* Process */}
          {project.process && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="flex items-center gap-2 mb-5">
                <GitBranch size={20} className="text-purple-light" />
                <h2 className="font-display font-semibold text-2xl text-white">
                  Design Process
                </h2>
              </div>
              <p className="text-base text-muted leading-relaxed bg-ink-soft/50 rounded-2xl p-6 border border-white/[0.04]">
                {project.process}
              </p>
            </motion.div>
          )}

          {/* Gallery images */}
          {project.project_images && project.project_images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="font-display font-semibold text-2xl text-white mb-6">
                Gallery
              </h2>
              <div className="space-y-6">
                {project.project_images.map((img, i) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="relative w-full rounded-2xl overflow-hidden glass-card"
                  >
                    <img
                      src={img.image_url}
                      alt={`${project.title} - Image ${i + 1}`}
                      className="w-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Prev / Next navigation */}
          <div className="border-t border-white/[0.06] pt-10 grid sm:grid-cols-2 gap-4">
            {prevProject ? (
              <Link
                to={`/project/${prevProject.slug}`}
                className="group glass-card rounded-2xl p-6 flex items-center gap-4 hover:border-purple/30 transition-all"
              >
                <ChevronLeft
                  size={24}
                  className="text-muted group-hover:text-purple-light transition-colors flex-shrink-0"
                />
                <div className="min-w-0">
                  <span className="block text-xs text-muted uppercase tracking-wide mb-1">
                    Previous
                  </span>
                  <span className="text-sm text-white truncate block">
                    {prevProject.title}
                  </span>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextProject ? (
              <Link
                to={`/project/${nextProject.slug}`}
                className="group glass-card rounded-2xl p-6 flex items-center justify-end gap-4 text-right hover:border-purple/30 transition-all"
              >
                <div className="min-w-0">
                  <span className="block text-xs text-muted uppercase tracking-wide mb-1">
                    Next
                  </span>
                  <span className="text-sm text-white truncate block">
                    {nextProject.title}
                  </span>
                </div>
                <ChevronRight
                  size={24}
                  className="text-muted group-hover:text-purple-light transition-colors flex-shrink-0"
                />
              </Link>
            ) : (
              <div />
            )}
          </div>

          {/* Back to all */}
          <div className="text-center mt-10">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-white text-sm font-medium hover:bg-white/[0.06] transition-all"
            >
              View All Projects
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
      <Footer
        designerName={settings['designer_name'] ?? 'Beshoy Fady'}
        email={settings['contact_email'] ?? ''}
      />
    </>
  );
}

function MetaCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-medium text-muted uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-sm text-white">{value}</p>
    </div>
  );
}
