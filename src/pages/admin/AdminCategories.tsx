
import { useEffect, useState, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { slugify, uploadImage } from '@/lib/upload';
import type { Category } from '@/types';
import AdminLayout from '@/components/admin/AdminLayout';

const ICON_OPTIONS = [
  'Palette',
  'Share2',
  'Layout',
  'Megaphone',
  'Printer',
  'Package',
  'Compass',
  'Star',
];

type CategoryWithImage = Category & {
  image_url?: string | null;
};

export default function AdminCategories() {
  const [categories, setCategories] = useState<CategoryWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CategoryWithImage | null>(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order');

    if (error) {
      console.error(error);
    }

    setCategories((data as CategoryWithImage[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (
      !supabase ||
      !confirm('Delete this category? Projects in it will be uncategorized.')
    ) {
      return;
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      alert(error.message);
      return;
    }

    load();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">
            Categories
          </h1>
          <p className="text-sm text-muted">
            Organize your projects by discipline.
          </p>
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
            <div
              key={c.id}
              className="glass-card rounded-2xl p-5"
            >
              {c.image_url ? (
                <img
                  src={c.image_url}
                  alt={c.name}
                  className="w-full h-36 object-cover rounded-xl mb-4"
                />
              ) : (
                <div className="w-full h-36 rounded-xl mb-4 bg-purple/10 flex items-center justify-center">
                  <ImageIcon size={32} className="text-purple-light" />
                </div>
              )}

              <h3 className="font-display font-semibold text-white mb-1">
                {c.name}
              </h3>

              <p className="text-xs text-muted mb-3">
                /{c.slug}
              </p>

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
  category: CategoryWithImage | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: category?.name ?? '',
    slug: category?.slug ?? '',
    icon: category?.icon ?? 'Palette',
    sort_order: category?.sort_order ?? 0,
    image_url: category?.image_url ?? '',
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const imageUrl = await uploadImage(file);

      if (!imageUrl) {
        throw new Error('Image upload failed.');
      }

      setForm((prev) => ({
        ...prev,
        image_url: imageUrl,
      }));
    } catch (err) {
  console.error('Category Save Error:', err);

  const errorMessage =
    typeof err === 'object' &&
    err !== null &&
    'message' in err
      ? String(err.message)
      : String(err);

  setError(errorMessage);
}
    finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!supabase || !form.name.trim()) return;

    setSaving(true);
    setError(null);

    const slug = form.slug.trim() || slugify(form.name);

    try {
      const payload = {
        name: form.name.trim(),
        slug,
        icon: form.icon,
        sort_order: form.sort_order,
        image_url: form.image_url || null,
      };

      if (category) {
        const { error } = await supabase
          .from('categories')
          .update(payload)
          .eq('id', category.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .insert(payload);

        if (error) throw error;
      }

      onSaved();
    } catch (err: unknown) {
  console.error('Category Save Error:', err);

  const errorMessage =
    typeof err === 'object' &&
    err !== null &&
    'message' in err
      ? String(err.message)
      : String(err);

  setError(errorMessage);
} finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass-card rounded-2xl p-6 md:p-8 max-w-md w-full my-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-xl text-white">
            {category ? 'Edit Category' : 'New Category'}
          </h2>

          <button
            onClick={onClose}
            className="text-muted hover:text-white p-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-2">
              Name
            </label>

            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="admin-input"
              placeholder="Category name"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-2">
              Slug
            </label>

            <input
              type="text"
              value={form.slug}
              onChange={(e) =>
                setForm({ ...form, slug: e.target.value })
              }
              className="admin-input"
              placeholder="auto-generated"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-2">
              Icon
            </label>

            <select
              value={form.icon}
              onChange={(e) =>
                setForm({ ...form, icon: e.target.value })
              }
              className="admin-input"
            >
              {ICON_OPTIONS.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
          </div>

          {/* Category Image Upload */}
          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-2">
              Category Image
            </label>

            {form.image_url ? (
              <div className="relative rounded-xl overflow-hidden mb-3">
                <img
                  src={form.image_url}
                  alt="Category preview"
                  className="w-full h-44 object-cover"
                />

                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      image_url: '',
                    }))
                  }
                  className="absolute top-2 right-2 p-2 rounded-lg bg-black/70 text-white hover:bg-red-500 transition-colors"
                  title="Remove image"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <div className="w-full h-36 rounded-xl border border-dashed border-purple/40 bg-purple/5 flex flex-col items-center justify-center gap-2 mb-3">
                <ImageIcon size={28} className="text-purple-light" />
                <span className="text-xs text-muted">
                  No image selected
                </span>
              </div>
            )}

            <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass text-sm text-white cursor-pointer hover:border-purple/40 transition-all">
              <Upload size={17} />
              {uploading
                ? 'Uploading...'
                : form.image_url
                  ? 'Change Image'
                  : 'Upload Image'}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>

            <p className="text-[11px] text-muted mt-2">
              This image will appear on the left side of the category card.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-2">
              Sort Order
            </label>

            <input
              type="number"
              value={form.sort_order}
              onChange={(e) =>
                setForm({
                  ...form,
                  sort_order: parseInt(e.target.value) || 0,
                })
              }
              className="admin-input"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 whitespace-pre-wrap">
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={saving || uploading || !form.name.trim()}
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
