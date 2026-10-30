import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Star, Eye, EyeOff, Upload, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { uploadImage, slugify } from '@/lib/upload';
import type { Project, Category } from '@/types';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    if (!supabase) return;
    setLoading(true);
    const [p, c] = await Promise.all([
      supabase.from('projects').select('*, category:categories(*)').order('sort_order'),
      supabase.from('categories').select('*').order('sort_order'),
    ]);
    setProjects((p.data as Project[]) ?? []);
    setCategories((c.data as Category[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!supabase || !confirm('Delete this project? This cannot be undone.')) return;
    await supabase.from('projects').delete().eq('id', id);
    load();
  };

  const toggleFeatured = async (p: Project) => {
    if (!supabase) return;
    await supabase.from('projects').update({ is_featured: !p.is_featured }).eq('id', p.id);
    load();
  };

  const togglePublished = async (p: Project) => {
    if (!supabase) return;
    await supabase.from('projects').update({ is_published: !p.is_published }).eq('id', p.id);
    load();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">
            Projects
          </h1>
          <p className="text-sm text-muted">Manage your portfolio projects.</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple to-purple-dark text-white text-sm font-medium glow-soft hover:scale-105 transition-all"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add Project</span>
        </button>
      </div>

      {loading ? (
        <div className="w-10 h-10 rounded-full border-2 border-purple/20 border-t-purple-light animate-spin" />
      ) : projects.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-muted text-sm mb-4">No projects yet.</p>
          <button
            onClick={() => setCreating(true)}
            className="text-purple-light text-sm hover:text-white transition-colors"
          >
            Create your first project
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="glass-card rounded-2xl overflow-hidden group">
              <div className="relative aspect-[3/4] overflow-hidden">
                {p.cover_image ? (
                  <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-ink-soft flex items-center justify-center">
                    <span className="text-muted text-xs">No image</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1.5">
                  {p.is_featured && (
                    <span className="w-7 h-7 rounded-lg bg-yellow-500/20 backdrop-blur-md flex items-center justify-center">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    </span>
                  )}
                  <span
                    className={`w-7 h-7 rounded-lg backdrop-blur-md flex items-center justify-center ${
                      p.is_published ? 'bg-green-500/20' : 'bg-white/10'
                    }`}
                  >
                    {p.is_published ? (
                      <Eye size={14} className="text-green-400" />
                    ) : (
                      <EyeOff size={14} className="text-muted" />
                    )}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <span className="text-xs text-purple-light uppercase tracking-wide block mb-1">
                  {p.category?.name ?? 'Uncategorized'}
                </span>
                <h3 className="font-display font-semibold text-sm text-white mb-3 truncate">
                  {p.title}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(p)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg glass text-xs text-white hover:border-purple/30 transition-all"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => toggleFeatured(p)}
                    className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:border-yellow-400/30 transition-all"
                    title="Toggle featured"
                  >
                    <Star
                      size={14}
                      className={p.is_featured ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}
                    />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:border-red-400/30 hover:text-red-400 transition-all"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {(editing || creating) && (
          <ProjectModal
            project={editing}
            categories={categories}
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

function ProjectModal({
  project,
  categories,
  onClose,
  onSaved,
}: {
  project: Project | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    title: project?.title ?? '',
    slug: project?.slug ?? '',
    description: project?.description ?? '',
    long_description: project?.long_description ?? '',
    category_id: project?.category_id ?? '',
    cover_image: project?.cover_image ?? '',
    tools: project?.tools.join(', ') ?? '',
    project_date: project?.project_date ?? '',
    goals: project?.goals ?? '',
    process: project?.process ?? '',
    is_published: project?.is_published ?? false,
    is_featured: project?.is_featured ?? false,
    sort_order: project?.sort_order ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      if (url) {
        setForm({ ...form, cover_image: url });
      } else {
        setError('Image upload failed. Enter image URL manually.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!supabase || !form.title) return;
    setSaving(true);
    setError(null);
    const slug = form.slug || slugify(form.title);
    const payload = {
      title: form.title,
      slug,
      description: form.description || null,
      long_description: form.long_description || null,
      category_id: form.category_id || null,
      cover_image: form.cover_image || null,
      tools: form.tools.split(',').map((t) => t.trim()).filter(Boolean),
      project_date: form.project_date || null,
      goals: form.goals || null,
      process: form.process || null,
      is_published: form.is_published,
      is_featured: form.is_featured,
      sort_order: form.sort_order,
    };
    try {
      if (project) {
        const { error } = await supabase.from('projects').update(payload).eq('id', project.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('projects').insert(payload);
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
      className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-start md:items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass-card rounded-2xl p-6 md:p-8 max-w-2xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-xl text-white">
            {project ? 'Edit Project' : 'New Project'}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Title">
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="admin-input"
                placeholder="Project title"
              />
            </Field>
            <Field label="Slug (auto-generated if empty)">
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="admin-input"
                placeholder="auto-generated"
              />
            </Field>
          </div>

          <Field label="Short Description">
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="admin-input"
              placeholder="One-line summary"
            />
          </Field>

          <Field label="Full Description">
            <textarea
              rows={4}
              value={form.long_description}
              onChange={(e) => setForm({ ...form, long_description: e.target.value })}
              className="admin-input resize-none"
              placeholder="Detailed project description..."
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Category">
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="admin-input"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Project Date">
              <input
                type="date"
                value={form.project_date}
                onChange={(e) => setForm({ ...form, project_date: e.target.value })}
                className="admin-input"
              />
            </Field>
          </div>

          <Field label="Tools (comma separated)">
            <input
              type="text"
              value={form.tools}
              onChange={(e) => setForm({ ...form, tools: e.target.value })}
              className="admin-input"
              placeholder="Photoshop, Illustrator, Figma"
            />
          </Field>

          <Field label="Goals">
            <textarea
              rows={2}
              value={form.goals}
              onChange={(e) => setForm({ ...form, goals: e.target.value })}
              className="admin-input resize-none"
              placeholder="Project goals..."
            />
          </Field>

          <Field label="Design Process">
            <textarea
              rows={2}
              value={form.process}
              onChange={(e) => setForm({ ...form, process: e.target.value })}
              className="admin-input resize-none"
              placeholder="Design process..."
            />
          </Field>

          <Field label="Cover Image">
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={form.cover_image}
                onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                className="admin-input flex-1"
                placeholder="Image URL"
              />
              <label className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl glass text-sm text-white cursor-pointer hover:border-purple/30 transition-all whitespace-nowrap">
                <Upload size={15} />
                {uploading ? 'Uploading...' : 'Upload'}
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            </div>
            {form.cover_image && (
              <img src={form.cover_image} alt="Cover preview" className="mt-3 w-full h-40 object-cover rounded-xl" />
            )}
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Sort Order">
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="admin-input"
              />
            </Field>
            <div className="flex items-end gap-4 pb-2">
              <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                  className="w-4 h-4 accent-purple"
                />
                Published
              </label>
              <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                  className="w-4 h-4 accent-purple"
                />
                Featured
              </label>
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={saving || !form.title}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple to-purple-dark text-white text-sm font-medium glow-soft disabled:opacity-50 transition-all"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Project'}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
