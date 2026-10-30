import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar({ designerName }: { designerName: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  const links = [
    { label: 'Work', href: '/#works' },
    { label: 'Categories', href: '/#categories' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
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

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-purple-light transition-all group-hover:w-full" />
              </a>
            ))}
            <Link
              to="/admin"
              className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-purple-light transition-colors"
            >
              <LayoutDashboard size={15} />
              Admin
            </Link>
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
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
              {links.map((link) => (
                <a
                  key={link.label}
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
                Admin Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
