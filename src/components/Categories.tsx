
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
    <section id="categories" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.3em] text-purple-light uppercase mb-4 block">
            {t('categoriesLabel')}
          </span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-white leading-tight">
            {t('categoriesHeading')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((cat, index) => {
            const Icon = iconMap[cat.icon ?? 'Palette'] ?? Palette;
            const count = projectCounts[cat.slug] ?? 0;

            const categoryName = isArabic
              ? cat.name_ar || cat.name
              : cat.name;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Link
                  to={`/projects?category=${cat.slug}`}
                  className="group relative block p-6 md:p-8 rounded-2xl glass-card hover:border-purple/30 transition-all duration-500 hover:-translate-y-1 overflow-hidden h-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple/0 to-purple/0 group-hover:from-purple/10 group-hover:to-transparent transition-all duration-500" />

                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-purple/10 flex items-center justify-center mb-5 group-hover:bg-purple/20 transition-colors">
                      <Icon size={22} className="text-purple-light" />
                    </div>

                    <h3 className="font-display font-semibold text-base md:text-lg text-white mb-2 leading-tight">
                      {categoryName}
                    </h3>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-muted">
                        {count}{' '}
                        {t(count === 1 ? 'project' : 'projects')}
                      </span>

                      <ArrowUpRight
                        size={18}
                        className={`text-muted group-hover:text-purple-light transition-all group-hover:translate-x-1 group-hover:-translate-y-1 ${
                          isArabic ? 'rotate-180' : ''
                        }`}
                      />
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
