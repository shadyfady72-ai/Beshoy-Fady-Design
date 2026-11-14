
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAnimationFrame } from 'framer-motion';
import type { Project } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

interface SelectedWorksProps {
  projects: Project[];
}

function ProjectCard({ project }: { project: Project }) {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    'landscape'
  );

  return (
    <Link
      to={`/project/${project.slug}`}
      aria-label={project.title}
      className={`works-project-card ${orientation}`}
    >
      {project.cover_image && (
        <img
          src={project.cover_image}
          alt={project.title}
          loading="lazy"
          draggable={false}
          onLoad={(event) => {
            const img = event.currentTarget;

            setOrientation(
              img.naturalHeight > img.naturalWidth
                ? 'portrait'
                : 'landscape'
            );
          }}
        />
      )}
    </Link>
  );
}

function MarqueeRow({
  projects,
  direction,
}: {
  projects: Project[];
  direction: 'left' | 'right';
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const firstGroupRef = useRef<HTMLDivElement>(null);
  const position = useRef(0);
  const initialized = useRef(false);
  const [paused, setPaused] = useState(false);

  useAnimationFrame((_, delta) => {
    if (!trackRef.current || !firstGroupRef.current) return;

    const groupWidth = firstGroupRef.current.offsetWidth;

    if (!groupWidth) return;

    if (!initialized.current) {
      position.current = direction === 'right' ? -groupWidth : 0;

      trackRef.current.style.transform =
        `translate3d(${position.current}px, 0, 0)`;

      initialized.current = true;
      return;
    }

    if (paused) return;

    const speed = 90;
    const movement = (speed * Math.min(delta, 40)) / 1000;

    if (direction === 'right') {
      position.current += movement;

      if (position.current >= 0) {
        position.current -= groupWidth;
      }
    } else {
      position.current -= movement;

      if (position.current <= -groupWidth) {
        position.current += groupWidth;
      }
    }

    trackRef.current.style.transform =
      `translate3d(${position.current}px, 0, 0)`;
  });

  return (
    <div
      className="works-marquee"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      onTouchCancel={() => setPaused(false)}
    >
      <div ref={trackRef} className="works-track">
        {[0, 1].map((group) => (
          <div
            ref={group === 0 ? firstGroupRef : undefined}
            className="works-group"
            key={group}
            aria-hidden={group === 1 ? true : undefined}
          >
            {projects.map((project) => (
              <ProjectCard
                key={`${group}-${project.id}`}
                project={project}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SelectedWorks({
  projects,
}: SelectedWorksProps) {
  const { language, t } = useLanguage();
  const isArabic = language === 'ar';

  const [selectedIds, setSelectedIds] = useState<string[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadSelectedWorks = async () => {
      if (!supabase) {
        setSelectedIds([]);
        return;
      }

      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'selected_works_project_ids')
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error('Failed to load Selected Works:', error);
        setSelectedIds([]);
        return;
      }

      try {
        const ids = data?.setting_value
          ? JSON.parse(data.setting_value)
          : [];

        setSelectedIds(Array.isArray(ids) ? ids : []);
      } catch {
        setSelectedIds([]);
      }
    };

    loadSelectedWorks();

    return () => {
      cancelled = true;
    };
  }, []);

  if (selectedIds === null) return null;

  const selectedProjects = projects.filter(
    (project) =>
      selectedIds.includes(project.id) &&
      project.is_published &&
      Boolean(project.cover_image)
  );

  if (!selectedProjects.length) return null;

  return (
    <section
      id="works"
      className="relative py-16 md:py-24 overflow-hidden"
    >
      <div className="flex justify-center px-6 mb-10 md:mb-14">
        <Link
          to="/projects"
          className="inline-flex items-center gap-3 text-base md:text-lg font-semibold text-white hover:text-purple-light transition-colors"
        >
          {t('viewAllProjects')}
          <span className={isArabic ? 'rotate-180' : ''}>→</span>
        </Link>
      </div>

      <div className="flex flex-col gap-5 md:gap-7">
        {/* الصف الأول: من الشمال لليمين */}
        <MarqueeRow
          projects={selectedProjects}
          direction="right"
        />

        {/* الصف الثاني: من اليمين للشمال */}
        <MarqueeRow
          projects={[...selectedProjects].reverse()}
          direction="left"
        />
      </div>

      <style>{`
        .works-marquee {
          width: 100%;
          overflow: hidden;
          position: relative;
        }

        .works-track {
          display: flex;
          flex-wrap: nowrap;
          align-items: flex-start;
          width: max-content;
          will-change: transform;
        }

        .works-group {
          display: flex;
          align-items: flex-start;
          flex-shrink: 0;
          gap: 24px;
          padding-right: 24px;
        }

        .works-project-card {
          display: block;
          flex-shrink: 0;
          overflow: hidden;
          height: 300px !important;
          border-radius: 14px;
          background: transparent;
        }

        .works-project-card.portrait {
          width: 210px !important;
          height: 300px !important;
        }

        .works-project-card.landscape {
          width: 480px !important;
          height: 300px !important;
        }

        .works-project-card img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          user-select: none;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .works-group {
            gap: 14px;
            padding-right: 14px;
          }

          .works-project-card.portrait {
            width: 155px !important;
            height: 225px !important;
          }

          .works-project-card.landscape {
            width: 360px !important;
            height: 225px !important;
          }
        }
      `}</style>
    </section>
  );
}
