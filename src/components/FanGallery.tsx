import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/types';

interface FanGalleryProps {
  projects: Project[];
}

interface CardConfig {
  rotate: number;
  translateY: number;
}

const desktopCards: CardConfig[] = [
  { rotate: -25, translateY: 100 },
  { rotate: -12, translateY: 30 },
  { rotate: 0, translateY: 0 },
  { rotate: 12, translateY: 30 },
  { rotate: 25, translateY: 100 },
];

export default function FanGallery({ projects }: FanGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = () => setIsDesktop(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const cardSpacing = isDesktop ? 150 : 92;
  const cardW = isDesktop ? 240 : 160;
  const cardH = isDesktop ? 310 : 210;
  const glowW = isDesktop ? 600 : 420;
  const glowH = isDesktop ? 400 : 300;
  const containerH = isDesktop ? 500 : 390;
  const svgW = isDesktop ? 900 : 760;

  const displayProjects = projects.slice(0, 5);

  if (displayProjects.length === 0) {
    return (
      <div className="text-center py-20 text-muted">
        No published projects yet. Add projects from the admin dashboard.
      </div>
    );
  }

  return (
    <>
      <div className="relative overflow-visible">
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          width={svgW}
          height="500"
          viewBox="0 0 900 500"
          fill="none"
        >
          <path
            d="M 50 450 Q 450 -50 850 450"
            stroke="url(#fanGradient)"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            fill="none"
            opacity="0.4"
          />
          <defs>
            <linearGradient id="fanGradient" x1="0" y1="0" x2="900" y2="0">
              <stop offset="0%" stopColor="#7851E9" stopOpacity="0" />
              <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7851E9" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple/10 rounded-full blur-[100px] pointer-events-none"
          style={{ width: glowW, height: glowH }}
        />

        <div className="relative flex justify-center items-start py-12" style={{ height: containerH }}>
          {displayProjects.map((project, index) => {
            const config = desktopCards[index] ?? { rotate: 0, translateY: 0 };
            const isHovered = hoveredIndex === index;
            const isOtherHovered = hoveredIndex !== null && !isHovered;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
                className="absolute"
                style={{
                  left: `calc(50% + ${(index - 2) * cardSpacing}px)`,
                  top: '50%',
                  marginLeft: `-${cardW / 2}px`,
                  marginTop: `-${cardH / 2}px`,
                }}
              >
                <motion.div
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onTouchStart={() => setHoveredIndex(index)}
                  animate={{
                    rotate: isHovered ? 0 : config.rotate,
                    y: isHovered ? -45 : config.translateY,
                    scale: isHovered ? 1.08 : isOtherHovered ? 0.95 : 1,
                    opacity: isOtherHovered ? 0.5 : 1,
                    zIndex: isHovered ? 20 : 10 - index,
                  }}
                  transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                  className="project-card relative rounded-2xl overflow-hidden cursor-pointer group"
                  style={{
                    width: cardW,
                    height: cardH,
                    boxShadow: isHovered
                      ? '0 30px 70px rgba(0,0,0,0.5), 0 0 40px -10px rgba(120,81,233,0.4)'
                      : '0 15px 40px rgba(0,0,0,0.3)',
                  }}
                >
                  <Link to={`/project/${project.slug}`} className="block w-full h-full">
                    <div className="absolute inset-0 overflow-hidden">
                      <img
                        src={project.cover_image ?? ''}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        style={{ transition: 'transform 0.5s ease', transform: isHovered ? 'scale(1.07)' : 'scale(1)' }}
                        loading="lazy"
                      />
                    </div>
                    <motion.div
                      animate={{ opacity: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent"
                    />
                    <motion.div
                      animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 15 }}
                      transition={{ duration: 0.4, delay: isHovered ? 0.1 : 0 }}
                      className="absolute bottom-0 left-0 right-0 p-4 md:p-5"
                    >
                      <span className="text-[10px] md:text-xs font-medium text-purple-light tracking-wide uppercase mb-1.5 block" style={{ fontSize: isDesktop ? undefined : '10px' }}>
                        {project.category?.name ?? 'Design'}
                      </span>
                      <h3 className="font-display font-semibold text-white leading-tight" style={{ fontSize: isDesktop ? '1.125rem' : '0.875rem', marginBottom: isDesktop ? '0.75rem' : '0.5rem' }}>
                        {project.title}
                      </h3>
                      <span className="inline-flex items-center gap-1.5 text-white/80 group-hover:text-purple-light transition-colors" style={{ fontSize: isDesktop ? '0.875rem' : '0.75rem' }}>
                        View Project
                        <ArrowUpRight size={15} />
                      </span>
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
}
