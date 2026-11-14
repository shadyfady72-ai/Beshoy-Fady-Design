
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Palette,
  Share2,
  Layout,
  Megaphone,
  Printer,
  Package,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import type { Category } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

const iconMap: Record<string, LucideIcon> = {
  Palette,
  Share2,
  Layout,
  Megaphone,
  Printer,
  Package,
};

interface CategoriesProps {
  categories: Category[];
  projectCounts: Record<string, number>;
}

export default function Categories({
  categories,
  projectCounts,
}: CategoriesProps) {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <section id="categories" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.3em] text-purple-light uppercase mb-4 block">
            {t('categoriesLabel')}
          </span>

          <h2 className="font-display font-bold text-3xl md:text-5xl text-white leading-tight">
            {t('categoriesHeading')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">

          {categories.slice(0, 4).map((cat, index) => {
            const Icon = iconMap[cat.icon ?? 'Palette'] ?? Palette;
            const count = projectCounts[cat.slug] ?? 0;

            const categoryName = isArabic
              ? cat.name_ar || cat.name
              : cat.name;

            // Optional category image URL
            const imageUrl = cat.image_url;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
              >
                <Link
                  to={`/projects?category=${cat.slug}`}
                  dir="ltr"
                  className="group relative flex h-[160px] md:h-[175px] overflow-hidden rounded-2xl glass-card border border-white/5 hover:border-purple/40 transition-all duration-500 hover:-translate-y-1"
                >

                  {/* Left Image */}
                  <div className="relative w-[30%] shrink-0 overflow-hidden bg-purple/10">

                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={categoryName}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple/20 to-purple/5">
                        <Icon
                          size={38}
                          strokeWidth={1.5}
                          className="text-purple-light"
                        />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
                  </div>

                  {/* Right Content */}
                  <div
                    dir={isArabic ? 'rtl' : 'ltr'}
                    className={`relative flex-1 min-w-0 flex flex-col justify-center px-4 md:px-6 py-4 ${
                      isArabic ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple/0 to-purple/0 group-hover:from-purple/10 group-hover:to-transparent transition-all duration-500 pointer-events-none" />

                    <div className="relative">

                      <h3 className="font-display font-semibold text-sm md:text-lg text-white leading-snug mb-3">
                        {categoryName}
                      </h3>

                      <div className="flex items-center justify-between gap-2 mt-3">
                        <span className="text-xs md:text-sm text-muted">
                          {count}{' '}
                          {t(count === 1 ? 'project' : 'projects')}
                        </span>

                        <ArrowUpRight
                          size={18}
                          className={`shrink-0 text-muted group-hover:text-purple-light transition-all group-hover:translate-x-1 group-hover:-translate-y-1 ${
                            isArabic ? 'rotate-180' : ''
                          }`}
                        />
                      </div>

                    </div>
                  </div>

                </Link>
              </motion.div>
            );
          })}

        </div>
      </div>
    </section>
  );
}
