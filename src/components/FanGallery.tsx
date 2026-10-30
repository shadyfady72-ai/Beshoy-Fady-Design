
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileCardWidth, setMobileCardWidth] = useState(280);

  const displayProjects = projects.slice(0, 5);
  const total = displayProjects.length;

  useEffect(() => {
    const updateWidth = () => {
      setMobileCardWidth(
        Math.min(Math.max(window.innerWidth * 0.76, 240), 300)
      );
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const nextCard = () => {
    setActiveIndex((current) => (current + 1) % total);
  };

  const previousCard = () => {
    setActiveIndex((current) => (current - 1 + total) % total);
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    if (info.offset.x < -45 || info.velocity.x < -450) {
      nextCard();
    } else if (info.offset.x > 45 || info.velocity.x > 450) {
      previousCard();
    }
  };

  if (total === 0) {
    return (
      <div className="text-center py-20 text-muted">
        No published projects yet. Add projects from the admin dashboard.
      </div>
    );
  }

  return (
    <>
      {/* ================= DESKTOP GALLERY ================= */}
      <div className="hidden md:block relative overflow-visible">

        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          width={900}
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
          style={{ width: 600, height: 400 }}
        />

        <div
          className="relative flex justify-center items-start py-12"
          style={{ height: 500 }}
        >
          {displayProjects.map((project, index) => {
            const config = desktopCards[index] ?? {
              rotate: 0,
              translateY: 0,
            };

            const isHovered = hoveredIndex === index;
            const isOtherHovered =
              hoveredIndex !== null && !isHovered;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.2, 0.8, 0.2, 1],
                }}
                className="absolute"
                style={{
                  left: `calc(50% + ${(index - 2) * 150}px)`,
                  top: '50%',
                  marginLeft: '-120px',
                  marginTop: '-155px',
                }}
              >
                <motion.div
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  animate={{
                    rotate: isHovered ? 0 : config.rotate,
                    y: isHovered ? -45 : config.translateY,
                    scale: isHovered
                      ? 1.08
                      : isOtherHovered
                        ? 0.95
                        : 1,
                    opacity: isOtherHovered ? 0.5 : 1,
                    zIndex: isHovered ? 20 : 10 - index,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.2, 0.8, 0.2, 1],
                  }}
                  className="project-card relative rounded-2xl overflow-hidden cursor-pointer group"
                  style={{
                    width: 240,
                    height: 310,
                    boxShadow: isHovered
                      ? '0 30px 70px rgba(0,0,0,0.5), 0 0 40px -10px rgba(120,81,233,0.4)'
                      : '0 15px 40px rgba(0,0,0,0.3)',
                  }}
                >
                  <Link
                    to={`/project/${project.slug}`}
                    className="block w-full h-full"
                  >
                    <div className="absolute inset-0 overflow-hidden">
                      <img
                        src={project.cover_image ?? ''}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        style={{
                          transition: 'transform 0.5s ease',
                          transform: isHovered
                            ? 'scale(1.07)'
                            : 'scale(1)',
                        }}
                        loading="lazy"
                      />
                    </div>

                    <motion.div
                      animate={{ opacity: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent"
                    />

                    <motion.div
                      animate={{
                        opacity: isHovered ? 1 : 0,
                        y: isHovered ? 0 : 15,
                      }}
                      transition={{
                        duration: 0.4,
                        delay: isHovered ? 0.1 : 0,
                      }}
                      className="absolute bottom-0 left-0 right-0 p-5"
                    >
                      <span className="text-xs font-medium text-purple-light tracking-wide uppercase mb-1.5 block">
                        {project.category?.name ?? 'Design'}
                      </span>

                      <h3 className="font-display font-semibold text-white leading-tight text-lg mb-3">
                        {project.title}
                      </h3>

                      <span className="inline-flex items-center gap-1.5 text-white/80 group-hover:text-purple-light transition-colors text-sm">
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

      {/* ================= MOBILE CARD SHUFFLE ================= */}
      <div
        className="md:hidden relative overflow-hidden w-full"
        style={{ height: 455 }}
      >
        {/* Background glow */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px] pointer-events-none"
          style={{
            width: 340,
            height: 340,
            background: 'rgba(120,81,233,0.16)',
          }}
        />

        {/* Cards */}
        <div className="relative w-full h-full">

          {displayProjects.map((project, index) => {
            let relativeIndex = (index - activeIndex + total) % total;

            if (relativeIndex > total / 2) {
              relativeIndex -= total;
            }

            const isActive = relativeIndex === 0;

            if (Math.abs(relativeIndex) > 1) {
              return null;
            }

            return (
              <motion.div
                key={project.id}
                drag={isActive ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={isActive ? handleDragEnd : undefined}
                onClick={(event) => {
                  if (!isActive) {
                    event.preventDefault();
                    setActiveIndex(index);
                  }
                }}
                initial={false}
                animate={{
                  x: relativeIndex * mobileCardWidth * 0.78,
                  y: relativeIndex === 0 ? 0 : 15,
                  rotate: relativeIndex * 9,
                  scale: isActive ? 1 : 0.88,
                  opacity: isActive ? 1 : 0.8,
                  zIndex: isActive ? 30 : 20,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 26,
                  mass: 0.8,
                }}
                className="absolute top-1/2 left-1/2 cursor-grab active:cursor-grabbing"
                style={{
                  width: mobileCardWidth,
                  height: 380,
                  marginLeft: -mobileCardWidth / 2,
                  marginTop: -205,
                  touchAction: isActive ? 'pan-y' : 'auto',
                }}
              >
                <Link
                  to={`/project/${project.slug}`}
                  tabIndex={isActive ? 0 : -1}
                  className="relative block w-full h-full overflow-hidden rounded-[25px] bg-[#211B35]"
                  style={{
                    boxShadow: isActive
                      ? '0 25px 70px rgba(0,0,0,0.55), 0 0 35px rgba(120,81,233,0.2)'
                      : '0 15px 40px rgba(0,0,0,0.4)',
                    pointerEvents: isActive ? 'auto' : 'none',
                  }}
                >
                  {/* Project image */}
                  <img
                    src={project.cover_image ?? ''}
                    alt={project.title}
                    loading="lazy"
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Image overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171323] via-[#171323]/25 to-transparent" />

                  {/* Top information */}
                  <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
                    <span className="text-white/80 text-xs font-medium tracking-[0.2em]">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span className="text-[10px] uppercase tracking-wider text-white/90 bg-black/25 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
                      {project.category?.name ?? 'Design'}
                    </span>
                  </div>

                  {/* Center decorative circle */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-44 h-44 rounded-full border border-white/20" />
                    <div className="absolute w-32 h-32 rounded-full border border-white/15" />
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-xs text-purple-200 uppercase tracking-widest mb-3 block">
                          {project.category?.name ?? 'Selected Work'}
                        </span>

                        <h3 className="text-3xl font-semibold text-white leading-tight mb-2">
                          {project.title}
                        </h3>

                        <span className="text-sm text-white/70">
                          Explore this project
                        </span>
                      </div>

                      <span className="w-11 h-11 shrink-0 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                        <ArrowUpRight size={21} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Pagination dots */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-2 z-40">
          {displayProjects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              aria-label={`Show project ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className="rounded-full transition-all duration-300"
              style={{
                width: activeIndex === index ? 10 : 8,
                height: activeIndex === index ? 10 : 8,
                background:
                  activeIndex === index
                    ? '#A78BFA'
                    : 'rgba(255,255,255,0.3)',
                boxShadow:
                  activeIndex === index
                    ? '0 0 12px rgba(167,139,250,0.7)'
                    : 'none',
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
