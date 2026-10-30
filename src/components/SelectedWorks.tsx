import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Project } from '@/types';
import FanGallery from './FanGallery';

interface SelectedWorksProps {
  projects: Project[];
}

export default function SelectedWorks({ projects }: SelectedWorksProps) {
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
            Selected Works
          </span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-white max-w-2xl mx-auto leading-tight mb-4">
            A collection of ideas turned into experiences.
          </h2>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-purple-light transition-colors group mt-2"
          >
            View All Projects
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

        {/* Fan gallery */}
        <FanGallery projects={projects} />
      </div>
    </section>
  );
}
