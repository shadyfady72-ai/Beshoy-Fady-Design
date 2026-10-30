import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderKanban, Tags, Briefcase, Images, Eye, Star, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';

interface Stats {
  projects: number;
  published: number;
  featured: number;
  categories: number;
  services: number;
  images: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      try {
        const [p, c, s, img] = await Promise.all([
          supabase.from('projects').select('*'),
          supabase.from('categories').select('*'),
          supabase.from('services').select('*'),
          supabase.from('project_images').select('*'),
        ]);
        const projects = p.data ?? [];
        setStats({
          projects: projects.length,
          published: projects.filter((x: any) => x.is_published).length,
          featured: projects.filter((x: any) => x.is_featured).length,
          categories: (c.data ?? []).length,
          services: (s.data ?? []).length,
          images: (img.data ?? []).length,
        });
        setRecentProjects(projects.slice(0, 5));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards = [
    { label: 'Total Projects', value: stats?.projects ?? 0, icon: FolderKanban, color: 'from-purple/20 to-purple/5' },
    { label: 'Published', value: stats?.published ?? 0, icon: Eye, color: 'from-green-500/20 to-green-500/5' },
    { label: 'Featured', value: stats?.featured ?? 0, icon: Star, color: 'from-yellow-500/20 to-yellow-500/5' },
    { label: 'Categories', value: stats?.categories ?? 0, icon: Tags, color: 'from-blue-500/20 to-blue-500/5' },
    { label: 'Services', value: stats?.services ?? 0, icon: Briefcase, color: 'from-pink-500/20 to-pink-500/5' },
    { label: 'Gallery Images', value: stats?.images ?? 0, icon: Images, color: 'from-cyan-500/20 to-cyan-500/5' },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">
          Overview
        </h1>
        <p className="text-sm text-muted">
          A snapshot of your portfolio content.
        </p>
      </div>

      {loading ? (
        <div className="w-10 h-10 rounded-full border-2 border-purple/20 border-t-purple-light animate-spin" />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {cards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`rounded-2xl p-5 glass-card bg-gradient-to-br ${card.color}`}
              >
                <card.icon size={22} className="text-purple-light mb-3" />
                <div className="font-display font-bold text-2xl text-white">
                  {card.value}
                </div>
                <div className="text-xs text-muted mt-1">{card.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={18} className="text-purple-light" />
              <h2 className="font-display font-semibold text-lg text-white">
                Recent Projects
              </h2>
            </div>
            {recentProjects.length === 0 ? (
              <p className="text-sm text-muted">No projects yet.</p>
            ) : (
              <div className="space-y-2">
                {recentProjects.map((p) => (
                  <Link
                    key={p.id}
                    to="/admin/projects"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {p.cover_image && (
                        <img
                          src={p.cover_image}
                          alt={p.title}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <span className="text-sm text-white truncate">
                        {p.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {p.is_featured && (
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      )}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          p.is_published
                            ? 'bg-green-500/15 text-green-400'
                            : 'bg-white/[0.06] text-muted'
                        }`}
                      >
                        {p.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
