import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Tags,
  User,
  Briefcase,
  Images,
  Phone,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/about', label: 'About Me', icon: User },
  { to: '/admin/services', label: 'Services', icon: Briefcase },
  { to: '/admin/gallery', label: 'Gallery', icon: Images },
  { to: '/admin/contact', label: 'Contact Info', icon: Phone },
  { to: '/admin/settings', label: 'Website Settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-ink flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-ink-soft/50 backdrop-blur-xl border-r border-white/[0.06] flex flex-col z-30 hidden md:flex">
        <div className="p-6 border-b border-white/[0.06]">
          <NavLink to="/admin" className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple to-purple-dark flex items-center justify-center text-white font-display font-bold text-sm glow-soft">
              A
            </span>
            <span className="font-display font-semibold text-white">
              Admin Panel
            </span>
          </NavLink>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-purple/15 text-purple-light border border-purple/20'
                    : 'text-muted hover:text-white hover:bg-white/[0.03]'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/[0.06] space-y-2">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-white hover:bg-white/[0.03] transition-all"
          >
            <ExternalLink size={18} />
            View Public Site
          </a>
          <div className="px-3 py-2 text-xs text-muted truncate">
            {user?.email}
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-ink-soft/80 backdrop-blur-xl border-b border-white/[0.06] h-16 flex items-center justify-between px-4">
        <span className="font-display font-semibold text-white text-sm">
          Admin Panel
        </span>
        <button
          onClick={handleSignOut}
          className="text-muted hover:text-red-400 p-2"
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-ink-soft/90 backdrop-blur-xl border-t border-white/[0.06] flex items-center justify-around py-2">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-purple-light' : 'text-muted'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 pb-20 md:pb-0 min-h-screen">
        <div className="p-6 md:p-8 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
