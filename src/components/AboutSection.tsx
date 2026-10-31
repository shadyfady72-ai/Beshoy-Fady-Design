
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { About } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface AboutSectionProps {
  about: About | null;
}

export default function AboutSection({ about }: AboutSectionProps) {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  const skills = about?.skills ?? [];
  const experience = about?.years_experience ?? 0;

  const bio = isArabic
    ? about?.bio_ar || 'أنا مصمم جرافيك ومصمم بصري إبداعي، شغوف بتحويل الأفكار إلى تجارب بصرية مميزة.'
    : about?.bio ||
      'I am a graphic designer and creative visual designer with a passion for turning ideas into striking visual experiences.';

  const philosophy = isArabic
    ? about?.philosophy_ar || 'أؤمن أن التصميم المميز يجمع بين الاستراتيجية والمشاعر.'
    : about?.philosophy ||
      'I believe great design lives at the intersection of strategy and emotion.';

  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.3em] text-purple-light uppercase mb-4 block">
            {t('aboutLabel')}
          </span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-white max-w-3xl mx-auto leading-tight">
            {t('aboutHeading')}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden glass-card">
              {about?.profile_image ? (
                <img
                  src={about.profile_image}
                  alt={about.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple/20 to-ink-soft">
                  <span className="font-display font-bold text-7xl text-gradient-purple">
                    {about?.full_name?.charAt(0) ?? 'A'}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-6 -right-6 glass-card rounded-2xl p-6 text-center glow-soft">
              <span className="font-display font-bold text-3xl text-gradient-purple block">
                {experience}+
              </span>
              <span className="text-xs text-muted uppercase tracking-wide">
                {t('experience')}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Sparkles size={18} className="text-purple-light" />
              <span className="text-sm font-medium text-purple-light">
                {t('creativePhilosophy')}
              </span>
            </div>

            <p className="text-lg text-white/90 leading-relaxed mb-5">
              {bio}
            </p>

            <p className={`text-base text-muted leading-relaxed mb-8 italic border-purple/40 ${
              isArabic
                ? 'border-r-2 pr-5'
                : 'border-l-2 pl-5'
            }`}>
              {philosophy}
            </p>

            <div>
              <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wide mb-4">
                {t('softwareSkills')}
              </h4>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="px-4 py-2 rounded-lg glass text-sm text-white/90 hover:border-purple/30 hover:bg-purple/10 transition-all cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
