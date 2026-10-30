import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/upload';
import type { Category } from '@/types';
import AdminLayout from '@/components/admin/AdminLayout';

const ICON_OPTIONS = ['Palette', 'Share2', 'Layout', 'Megaphone', 'Printer', 'Package', 'Compass', 'Star'];

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    setCategories((data as Category[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!supabase || !confirm('Delete this category? Projects in it will be uncategorized.')) return;
    await supabase.from('categories').delete().eq('id', id);
    load();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">Categories</h1>
          <p className="text-sm text-muted">Organize your projects by discipline.</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple to-purple-dark text-white text-sm font-medium glow-soft hover:scale-105 transition-all"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add Category</span>
        </button>
      </div>

      {loading ? (
        <div className="w-10 h-10 rounded-full border-2 border-purple/20 border-t-purple-light animate-spin" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div key={c.id} className="glass-card rounded-2xl p-5">
              <h3 className="font-display font-semibold text-white mb-1">{c.name}</h3>
              <p className="text-xs text-muted mb-3">/{c.slug}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(c)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg glass text-xs text-white hover:border-purple/30 transition-all"
                >
                  <Pencil size={13} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:border-red-400/30 hover:text-red-400 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {(editing || creating) && (
          <CategoryModal
            category={editing}
            onClose={() => {
              setEditing(null);
              setCreating(false);
            }}
            onSaved={() => {
              load();
              setEditing(null);
              setCreating(false);
            }}
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

function CategoryModal({
  category,
  onClose,
  onSaved,
}: {
  category: Category | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: category?.name ?? '',
    slug: category?.slug ?? '',
    icon: category?.icon ?? 'Palette',
    sort_order: category?.sort_order ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!supabase || !form.name) return;
    setSaving(true);
    setError(null);
    const slug = form.slug || slugify(form.name);
    try {
      if (category) {
        const { error } = await supabase.from('categories').update({ ...form, slug }).eq('id', category.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('categories').insert({ ...form, slug });
        if (error) throw error;
      }
      onSaved();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass-card rounded-2xl p-6 md:p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-xl text-white">
            {category ? 'Edit Category' : 'New Category'}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-2">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="admin-input"
              placeholder="Category name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-2">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="admin-input"
              placeholder="auto-generated"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-2">Icon</label>
            <select
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="admin-input"
            >
              {ICON_OPTIONS.map((icon) => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-2">Sort Order</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
              className="admin-input"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={saving || !form.name}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple to-purple-dark text-white text-sm font-medium glow-soft disabled:opacity-50 transition-all"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl glass text-sm text-white hover:bg-white/[0.06] transition-all"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
