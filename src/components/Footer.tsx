import { Link } from 'react-router-dom';

interface FooterProps {
  designerName: string;
  email: string;
}

export default function Footer({ designerName, email }: FooterProps) {
  return (
    <footer className="relative border-t border-white/[0.06] py-12 mt-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple to-purple-dark flex items-center justify-center text-white font-display font-bold text-xs">
              {designerName.charAt(0)}
            </span>
            <span className="font-display font-semibold text-white">
              {designerName}
            </span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6">
            <a href="/#works" className="text-sm text-muted hover:text-white transition-colors">
              Work
            </a>
            <a href="/#about" className="text-sm text-muted hover:text-white transition-colors">
              About
            </a>
            <a href="/#contact" className="text-sm text-muted hover:text-white transition-colors">
              Contact
            </a>
            <Link to="/projects" className="text-sm text-muted hover:text-white transition-colors">
              All Projects
            </Link>
          </nav>

          <a
            href={`mailto:${email}`}
            className="text-sm text-muted hover:text-purple-light transition-colors"
          >
            {email}
          </a>
        </div>

        <div className="mt-8 pt-8 border-t border-white/[0.04] text-center">
          <p className="text-xs text-muted">
            (c) {new Date().getFullYear()} {designerName}. Crafted with passion.
          </p>
        </div>
      </div>
    </footer>
  );
}
