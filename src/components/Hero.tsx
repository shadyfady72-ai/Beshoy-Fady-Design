
import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown, Circle } from 'lucide-react';
import { FaBehance, FaInstagram, FaFacebookF } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';

interface HeroProps {
  label: string;
  heading: string;
  description: string;
  designerName: string;
  labelAr?: string;
  headingAr?: string;
  descriptionAr?: string;
  profileImage?: string;
  socialLinks: {
    behance?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export default function Hero({
  heading,
  description,
  designerName,
  headingAr,
  descriptionAr,
  profileImage,
  socialLinks,
}: HeroProps) {
  const { language, t } = useLanguage();
  const isArabic = language === 'ar';

  const displayedHeading = isArabic
    ? headingAr || t('heroHeading')
    : heading;

  const displayedDescription = isArabic
    ? descriptionAr || t('heroDescription')
    : description;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple/20 rounded-full blur-[120px] animate-glow-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-dark/15 rounded-full blur-[100px] animate-glow-pulse"
          style={{ animationDelay: '2s' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple/5 rounded-full blur-[150px]" />
      </div>

      {/* Floating graphic elements */}
      <motion.div
        className="absolute top-[15%] left-[8%] w-16 h-16 rounded-2xl border border-purple/20 rotate-12 hidden lg:block"
        animate={{ y: [0, -30, 0], rotate: [12, 20, 12] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute bottom-[20%] left-[12%] w-10 h-10 rounded-full border border-purple-light/30 hidden lg:block"
        animate={{ y: [0, 25, 0], x: [0, 15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute top-[25%] right-[10%] w-20 h-20 rounded-3xl border border-purple/15 -rotate-12 hidden lg:block"
        animate={{ y: [0, -35, 0], rotate: [-12, -5, -12] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute bottom-[25%] right-[8%] w-12 h-12 rounded-full border border-purple-light/20 hidden lg:block"
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

        {/* Profile Image */}
        {profileImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex justify-center mb-10"
          >
            <div className="relative w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full p-[3px] bg-gradient-to-br from-purple-light via-purple to-purple-dark shadow-[0_0_20px_rgba(139,92,246,0.6),0_0_45px_rgba(139,92,246,0.3)]">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-purple-light/60">
                <img
                  src={profileImage}
                  alt={designerName}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] mb-6"
        >
          <span className="text-gradient block">{designerName}</span>
        </motion.h1>

        {/* Heading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="font-display text-2xl sm:text-3xl md:text-4xl text-white/90 max-w-3xl mx-auto leading-tight mb-6"
        >
          {displayedHeading}
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed mb-10"
        >
          {displayedDescription}
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <a
            href="#works"
            className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple to-purple-dark text-white font-medium text-sm glow-soft hover:glow-purple transition-all hover:scale-105"
          >
            {t('heroExplore')}
            <ArrowRight
              size={18}
              className={`transition-transform group-hover:translate-x-1 ${
                isArabic ? 'rotate-180' : ''
              }`}
            />
          </a>

          <a
            href="#contact"
            className="group flex items-center gap-2 px-7 py-3.5 rounded-xl glass text-white font-medium text-sm hover:bg-white/[0.06] transition-all"
          >
            {t('heroContact')}
            <ArrowRight
              size={18}
              className={`transition-transform group-hover:translate-x-1 ${
                isArabic ? 'rotate-180' : ''
              }`}
            />
          </a>
        </motion.div>

        {/* Social icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="flex items-center justify-center gap-4"
        >
          {socialLinks.behance && (
            <a
              href={socialLinks.behance}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted hover:text-purple-light hover:border-purple/30 transition-all hover:scale-110"
              aria-label="Behance"
            >
              <FaBehance size={20} />
            </a>
          )}

          {socialLinks.instagram && (
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted hover:text-purple-light hover:border-purple/30 transition-all hover:scale-110"
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </a>
          )}

          {socialLinks.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted hover:text-purple-light hover:border-purple/30 transition-all hover:scale-110"
              aria-label="Facebook"
            >
              <FaFacebookF size={18} />
            </a>
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#works"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted hover:text-white transition-colors flex flex-col items-center gap-2"
      >
        <Circle size={6} className="fill-current" />
        <ArrowDown size={18} className="animate-bounce" />
      </motion.a>
    </section>
  );
}
