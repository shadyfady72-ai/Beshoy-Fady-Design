
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar({ designerName }: { designerName: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const { language, toggleLanguage, t } = useLanguage();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  const links = [
    { label: t('work'), href: '/#works' },
    { label: t('categories'), href: '/#categories' },
    { label: t('about'), href: '/#about' },
    { label: t('contact'), href: '/#contact' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-ink/80 backdrop-blur-xl border-b border-white/[0.06]'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-2">
            <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple to-purple-dark flex items-center justify-center text-white font-display font-bold text-sm glow-soft transition-transform group-hover:scale-110">
              {designerName.charAt(0)}
            </span>
            <span className="font-display font-semibold text-white text-lg tracking-tight">
              {designerName}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {!isAdmin && (
              <>
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-muted hover:text-white transition-colors relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-purple-light transition-all group-hover:w-full" />
                  </a>
                ))}
              </>
            )}

            <Link
              to="/admin"
              className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-purple-light transition-colors"
            >
              <LayoutDashboard size={15} />
              {t('admin')}
            </Link>

            {!isAdmin && (
              <button
                type="button"
                onClick={toggleLanguage}
                dir="ltr"
                aria-label="Switch language"
                className="relative w-[76px] h-9 rounded-full border border-white/10 bg-white/[0.05] p-1 flex items-center"
              >
                <motion.span
                  className="absolute top-1 bottom-1 w-8 rounded-full bg-purple shadow-lg"
                  animate={{ x: language === 'en' ? 0 : 36 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                />

                <span className={`relative z-10 w-8 text-center text-xs font-bold ${
                  language === 'en' ? 'text-white' : 'text-muted'
                }`}>
                  EN
                </span>

                <span className={`relative z-10 w-8 text-center text-xs font-bold ${
                  language === 'ar' ? 'text-white' : 'text-muted'
                }`}>
                  AR
                </span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 md:hidden">
            {!isAdmin && (
              <button
                type="button"
                onClick={toggleLanguage}
                dir="ltr"
                className="relative w-[76px] h-9 rounded-full border border-white/10 bg-white/[0.05] p-1 flex items-center"
                aria-label="Switch language"
              >
                <motion.span
                  className="absolute top-1 bottom-1 w-8 rounded-full bg-purple"
                  animate={{ x: language === 'en' ? 0 : 36 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                />
                <span className={`relative z-10 w-8 text-center text-xs font-bold ${language === 'en' ? 'text-white' : 'text-muted'}`}>
                  EN
                </span>
                <span className={`relative z-10 w-8 text-center text-xs font-bold ${language === 'ar' ? 'text-white' : 'text-muted'}`}>
                  AR
                </span>
              </button>
            )}

            <button
              className="text-white p-2"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-0 right-0 z-40 bg-ink-soft/95 backdrop-blur-xl border-b border-white/[0.06] md:hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {!isAdmin && links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-muted hover:text-white transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}

              <Link
                to="/admin"
                className="flex items-center gap-2 text-base font-medium text-purple-light py-2"
              >
                <LayoutDashboard size={18} />
                {t('adminDashboard')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
