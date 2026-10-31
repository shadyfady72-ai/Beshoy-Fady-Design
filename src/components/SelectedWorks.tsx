
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Project } from '@/types';
import FanGallery from './FanGallery';
import { useLanguage } from '@/context/LanguageContext';

interface SelectedWorksProps {
  projects: Project[];
}

export default function SelectedWorks({ projects }: SelectedWorksProps) {
  const { language, t } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <section id="works" className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="text-xs font-semibold tracking-[0.3em] text-purple-light uppercase mb-4 block">
            {t('worksLabel')}
          </span>

          <h2 className="font-display font-bold text-3xl md:text-5xl text-white max-w-2xl mx-auto leading-tight mb-4">
            {t('worksHeading')}
          </h2>

          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-purple-light transition-colors group mt-2"
          >
            {t('viewAllProjects')}
            <ArrowRight
              size={16}
              className={`transition-transform group-hover:translate-x-1 ${
                isArabic ? 'rotate-180' : ''
              }`}
            />
          </Link>
        </motion.div>

        {/* Fan gallery */}
        <FanGallery projects={projects} />
      </div>
    </section>
  );
}
