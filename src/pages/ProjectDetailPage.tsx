
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Masonry from 'react-masonry-css';
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
import { useLanguage } from '@/context/LanguageContext';

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { settings } = usePortfolioData();
  const { language, t } = useLanguage();
  const isArabic = language === 'ar';

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

  const getProjectTitle = (item: Project) =>
    isArabic ? item.title_ar || item.title : item.title;

  const getProjectDescription = (item: Project) =>
    isArabic ? item.description_ar || item.description : item.description;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;

    return new Date(dateStr).toLocaleDateString(
      isArabic ? 'ar-EG' : 'en-US',
      {
        year: 'numeric',
        month: 'long',
      }
    );
  };

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
            <p className="text-red-400 text-sm mb-4">
              {t('projectNotFound')}
            </p>
            <Link
              to="/projects"
              className="text-purple-light hover:text-white transition-colors text-sm"
            >
              {t('backToProjects')}
            </Link>
          </div>
        </div>
      </>
    );
  }

  const displayedTitle = getProjectTitle(project);
  const displayedDescription = getProjectDescription(project);
  const displayedProcess = isArabic
    ? project.process_ar || project.process
    : project.process;
  const displayedLongDescription = isArabic
    ? project.long_description_ar || project.long_description
    : project.long_description;
  const displayedGoals = isArabic
    ? project.goals_ar || project.goals
    : project.goals;

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
            {isArabic ? (
              <ArrowRight size={16} />
            ) : (
              <ArrowLeft size={16} />
            )}
            {t('backToAllProjects')}
          </Link>

          {/* Cover with text overlay */}
          {project.cover_image && (
            <motion.section
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative w-full aspect-[16/7] min-h-[220px] sm:min-h-[280px] rounded-2xl overflow-hidden mb-12 group glow-soft"
            >
              <img
                src={project.cover_image}
                alt={displayedTitle}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="max-w-3xl"
                >
                  <span className="inline-block text-[10px] sm:text-xs font-bold tracking-[0.25em] text-purple-light uppercase mb-2">
                    {project.category?.name ?? 'Design'}
                  </span>

                  <h1 className="font-display font-bold text-2xl sm:text-4xl md:text-5xl text-white leading-tight mb-2 drop-shadow-lg">
                    {displayedTitle}
                  </h1>

                  {displayedDescription && (
                    <p className="text-xs sm:text-sm md:text-base text-white/85 leading-relaxed max-w-2xl">
                      {displayedDescription}
                    </p>
                  )}
                </motion.div>
              </div>
            </motion.section>
          )}

          {/* Design Process */}
          {displayedProcess && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="flex items-center gap-2 mb-5">
                <GitBranch size={20} className="text-purple-light" />
                <h2 className="font-display font-semibold text-2xl text-white">
                  {t('designProcess')}
                </h2>
              </div>

              <p className="text-base text-muted leading-relaxed whitespace-pre-line bg-ink-soft/50 rounded-2xl p-6 border border-white/[0.04]">
                {displayedProcess}
              </p>
            </motion.section>
          )}

          {/* Gallery - original Masonry design preserved */}
          {project.project_images && project.project_images.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="font-display font-semibold text-2xl text-white mb-6">
                {t('gallery')}
              </h2>

              <Masonry
                breakpointCols={{
                  default: 2,
                  640: 2,
                }}
                className="flex w-auto gap-4 md:gap-6"
                columnClassName="flex flex-col gap-4 md:gap-6"
              >
                {project.project_images.map((img, i) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="w-full rounded-2xl overflow-hidden glass-card"
                  >
                    <img
                      src={img.image_url}
                      alt={`${displayedTitle} - Image ${i + 1}`}
                      className="block w-full h-auto object-contain"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </Masonry>
            </motion.section>
          )}

          {/* Project Information */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="border-t border-white/[0.06] pt-12 mb-16"
          >
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-8">
              {t('projectInformation')}
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {formatDate(project.project_date) && (
                <MetaCard
                  icon={<Calendar size={18} className="text-purple-light" />}
                  label={t('projectDate')}
                  value={formatDate(project.project_date)!}
                />
              )}

              {project.tools.length > 0 && (
                <MetaCard
                  icon={<Wrench size={18} className="text-purple-light" />}
                  label={t('toolsUsed')}
                  value={project.tools.join(', ')}
                />
              )}

              {project.category?.name && (
                <MetaCard
                  icon={<Target size={18} className="text-purple-light" />}
                  label={t('category')}
                  value={project.category.name}
                />
              )}
            </div>

            {displayedLongDescription && (
              <div className="mb-10">
                <h3 className="font-display font-semibold text-xl text-white mb-4">
                  {t('aboutProject')}
                </h3>

                <p className="text-base text-muted leading-relaxed whitespace-pre-line">
                  {displayedLongDescription}
                </p>
              </div>
            )}

            {displayedGoals && (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <Target size={20} className="text-purple-light" />
                  <h3 className="font-display font-semibold text-xl text-white">
                    {t('projectGoals')}
                  </h3>
                </div>

                <p className="text-base text-muted leading-relaxed bg-ink-soft/50 rounded-2xl p-6 border border-white/[0.04]">
                  {displayedGoals}
                </p>
              </div>
            )}
          </motion.section>

          {/* Previous / Next navigation */}
          <div className="border-t border-white/[0.06] pt-10 grid sm:grid-cols-2 gap-4">
            {prevProject ? (
              <Link
                to={`/project/${prevProject.slug}`}
                className="group glass-card rounded-2xl p-6 flex items-center gap-4 hover:border-purple/30 transition-all"
              >
                {isArabic ? (
                  <ChevronRight
                    size={24}
                    className="text-muted group-hover:text-purple-light transition-colors flex-shrink-0"
                  />
                ) : (
                  <ChevronLeft
                    size={24}
                    className="text-muted group-hover:text-purple-light transition-colors flex-shrink-0"
                  />
                )}

                <div className="min-w-0">
                  <span className="block text-xs text-muted uppercase tracking-wide mb-1">
                    {t('previous')}
                  </span>
                  <span className="text-sm text-white truncate block">
                    {getProjectTitle(prevProject)}
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
                    {t('next')}
                  </span>
                  <span className="text-sm text-white truncate block">
                    {getProjectTitle(nextProject)}
                  </span>
                </div>

                {isArabic ? (
                  <ChevronLeft
                    size={24}
                    className="text-muted group-hover:text-purple-light transition-colors flex-shrink-0"
                  />
                ) : (
                  <ChevronRight
                    size={24}
                    className="text-muted group-hover:text-purple-light transition-colors flex-shrink-0"
                  />
                )}
              </Link>
            ) : (
              <div />
            )}
          </div>

          {/* Back to all projects */}
          <div className="text-center mt-10">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-white text-sm font-medium hover:bg-white/[0.06] transition-all"
            >
              {t('viewAllProjects')}
              {isArabic ? (
                <ArrowLeft size={16} />
              ) : (
                <ArrowRight size={16} />
              )}
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
