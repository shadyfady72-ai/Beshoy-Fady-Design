
import { useEffect, useState, type ChangeEvent, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, X, Star, Eye, EyeOff, Upload, Save,
  ChevronUp, ChevronDown, ImagePlus, LayoutGrid, Columns3,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { uploadImage, slugify } from '@/lib/upload';
import type { Project, Category, ProjectImage } from '@/types';
import AdminLayout from '@/components/admin/AdminLayout';

type GalleryLayout = 'masonry' | 'grid' | 'full' | 'editorial';
type ImageRatio = 'auto' | '1/1' | '3/4' | '16/9' | '4/5';

type ImageLayout = {
  width: number;
  aspectRatio: ImageRatio;
};

type GallerySettings = {
  layout: GalleryLayout;
  columns: number;
  gap: number;
  maxWidth: number;
  imageLayouts: ImageLayout[];
};

type GalleryItem = {
  id?: string;
  image_url: string;
  file?: File;
};

const defaultSettings: GallerySettings = {
  layout: 'masonry',
  columns: 2,
  gap: 20,
  maxWidth: 1100,
  imageLayouts: [],
};

const defaultImageLayout: ImageLayout = {
  width: 100,
  aspectRatio: 'auto',
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);
  const [selectedWorksIds, setSelectedWorksIds] = useState<string[]>([]);

  const load = async () => {
  if (!supabase) {
    setLoading(false);
    return;
  }

  setLoading(true);

  const [p, c, s] = await Promise.all([
    supabase
      .from('projects')
      .select('*, category:categories(*)')
      .order('sort_order'),

    supabase
      .from('categories')
      .select('*')
      .order('sort_order'),

    supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'selected_works_project_ids')
      .maybeSingle(),
  ]);

  if (p.error) console.error(p.error);
  if (c.error) console.error(c.error);
  if (s.error) console.error(s.error);

  setProjects((p.data as Project[]) ?? []);
  setCategories((c.data as Category[]) ?? []);

  try {
    const savedIds = s.data?.setting_value
      ? JSON.parse(s.data.setting_value)
      : [];

    setSelectedWorksIds(Array.isArray(savedIds) ? savedIds : []);
  } catch {
    setSelectedWorksIds([]);
  }

  setLoading(false);
};

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!supabase || !confirm('Delete this project? This cannot be undone.')) return;

    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) {
      alert(error.message);
      return;
    }

    await load();
  };

  const toggleFeatured = async (p: Project) => {
    if (!supabase) return;

    const { error } = await supabase
      .from('projects')
      .update({ is_featured: !p.is_featured })
      .eq('id', p.id);

    if (error) alert(error.message);
    else await load();
  };

  const togglePublished = async (p: Project) => {
    if (!supabase) return;

    const { error } = await supabase
      .from('projects')
      .update({ is_published: !p.is_published })
      .eq('id', p.id);

    if (error) alert(error.message);
    else await load();
  };
  const toggleSelectedWorks = async (projectId: string) => {
  if (!supabase) return;

  const nextIds = selectedWorksIds.includes(projectId)
    ? selectedWorksIds.filter((id) => id !== projectId)
    : [...selectedWorksIds, projectId];

  const settingKey = 'selected_works_project_ids';
  const settingValue = JSON.stringify(nextIds);

  const { data: existing, error: selectError } = await supabase
    .from('site_settings')
    .select('id')
    .eq('setting_key', settingKey)
    .maybeSingle();

  if (selectError) {
    alert(selectError.message);
    return;
  }

  const result = existing
    ? await supabase
        .from('site_settings')
        .update({ setting_value: settingValue })
        .eq('setting_key', settingKey)
    : await supabase
        .from('site_settings')
        .insert({
          setting_key: settingKey,
          setting_value: settingValue,
        });

  if (result.error) {
    alert(result.error.message);
    return;
  }

  setSelectedWorksIds(nextIds);
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
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple to-purple-dark text-white text-sm font-medium"
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
          <button onClick={() => setCreating(true)} className="text-purple-light text-sm">
            Create your first project
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="glass-card rounded-2xl overflow-hidden">
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
                    <span className="w-7 h-7 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    </span>
                  )}

                  <button
                    onClick={() => togglePublished(p)}
                    title="Toggle published"
                    className="w-7 h-7 rounded-lg bg-black/50 flex items-center justify-center"
                  >
                    {p.is_published
                      ? <Eye size={14} className="text-green-400" />
                      : <EyeOff size={14} className="text-muted" />}
                  </button>
                </div>
              </div>

              <div className="p-4">
                <span className="text-xs text-purple-light uppercase block mb-1">
                  {p.category?.name ?? 'Uncategorized'}
                </span>

                <h3 className="font-display font-semibold text-sm text-white mb-3 truncate">
                  {p.title}
                </h3>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(p)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg glass text-xs text-white"
                  >
                    <Pencil size={13} /> Edit
                  </button>

                  <button
                    onClick={() => toggleFeatured(p)}
                    className="w-9 h-9 rounded-lg glass flex items-center justify-center"
                    title="Toggle featured"
                  >
                    <Star
                      size={14}
                      className={p.is_featured ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}
                    />
                  </button>
                  <button
                    onClick={() => toggleSelectedWorks(p.id)}
                    className={`flex-1 min-w-0 px-2 py-2 rounded-lg text-[11px] leading-tight transition ${
                    selectedWorksIds.includes(p.id)
                    ? 'bg-purple/20 text-purple-light border border-purple/40'
                    : 'glass text-muted'
                  }`}
                    title="Toggle Selected Works"
>
                     {selectedWorksIds.includes(p.id)
                     ? '✓ Selected'
                    : '+ Select for Home'}
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:text-red-400"
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
            key={editing?.id ?? 'new'}
            project={editing}
            categories={categories}
            onClose={() => {
              setEditing(null);
              setCreating(false);
            }}
            onSaved={() => {
              setEditing(null);
              setCreating(false);
              load();
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
    tools: project?.tools?.join(', ') ?? '',
    project_date: project?.project_date ?? '',
    goals: project?.goals ?? '',
    process: project?.process ?? '',
    is_published: project?.is_published ?? false,
    is_featured: project?.is_featured ?? false,
    sort_order: project?.sort_order ?? 0,
  });

  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [settings, setSettings] = useState<GallerySettings>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [loadingGallery, setLoadingGallery] = useState(Boolean(project));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGallery = async () => {
      if (!supabase || !project) {
        setLoadingGallery(false);
        return;
      }

      const [imagesResult, settingsResult] = await Promise.all([
        supabase
          .from('project_images')
          .select('*')
          .eq('project_id', project.id)
          .order('sort_order', { ascending: true }),

        supabase
          .from('site_settings')
          .select('setting_value')
          .eq('setting_key', `project_gallery_${project.id}`)
          .maybeSingle(),
      ]);

      if (imagesResult.error) {
        setError(imagesResult.error.message);
      }

      const loadedImages = (imagesResult.data ?? []) as ProjectImage[];

      setGallery(
        loadedImages.map((img) => ({
          id: img.id,
          image_url: img.image_url,
        }))
      );

      let savedSettings: GallerySettings = { ...defaultSettings };

      if (settingsResult.error) {
        setError(settingsResult.error.message);
      } else if (settingsResult.data?.setting_value) {
        try {
          savedSettings = {
            ...defaultSettings,
            ...JSON.parse(settingsResult.data.setting_value),
          };
        } catch {
          savedSettings = { ...defaultSettings };
        }
      }

      savedSettings.imageLayouts = loadedImages.map((_, index) => ({
        ...defaultImageLayout,
        ...(savedSettings.imageLayouts?.[index] ?? {}),
      }));

      setSettings(savedSettings);
      setLoadingGallery(false);
    };

    loadGallery();
  }, [project]);

  const updateForm = (key: string, value: string | boolean | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCoverUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    setError(null);

    try {
      const url = await uploadImage(file);
      if (!url) throw new Error('Cover image upload failed.');
      updateForm('cover_image', url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploadingCover(false);
      e.target.value = '';
    }
  };

  const handleGalleryUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const newItems: GalleryItem[] = files.map((file) => ({
      image_url: URL.createObjectURL(file),
      file,
    }));

    setGallery((prev) => [...prev, ...newItems]);

    setSettings((prev) => ({
      ...prev,
      imageLayouts: [
        ...prev.imageLayouts,
        ...newItems.map(() => ({ ...defaultImageLayout })),
      ],
    }));

    e.target.value = '';
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= gallery.length) return;

    setGallery((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

    setSettings((prev) => {
      const next = [...prev.imageLayouts];
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, imageLayouts: next };
    });
  };

  const removeImage = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));

    setSettings((prev) => ({
      ...prev,
      imageLayouts: prev.imageLayouts.filter((_, i) => i !== index),
    }));
  };

  const updateImageLayout = (index: number, changes: Partial<ImageLayout>) => {
    setSettings((prev) => {
      const imageLayouts = [...prev.imageLayouts];

      imageLayouts[index] = {
        ...defaultImageLayout,
        ...imageLayouts[index],
        ...changes,
      };

      return { ...prev, imageLayouts };
    });
  };

  const saveGallerySettings = async (
    projectId: string,
    gallerySettings: GallerySettings
  ) => {
    if (!supabase) throw new Error('Supabase is not configured.');

    const key = `project_gallery_${projectId}`;
    const value = JSON.stringify(gallerySettings);

    const { data: existing, error: selectError } = await supabase
      .from('site_settings')
      .select('id')
      .eq('setting_key', key)
      .maybeSingle();

    if (selectError) throw selectError;

    if (existing) {
      const { error } = await supabase
        .from('site_settings')
        .update({ setting_value: value })
        .eq('setting_key', key);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('site_settings')
        .insert({ setting_key: key, setting_value: value });

      if (error) throw error;
    }
  };

  const handleSave = async () => {
    if (!supabase || !form.title.trim()) return;

    setSaving(true);
    setError(null);

    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
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

      let projectId: string | undefined = project?.id;

      if (projectId) {
        const { error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', projectId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('projects')
          .insert(payload)
          .select('id')
          .single();

        if (error) throw error;
        projectId = data.id;
      }

      if (!projectId) {
        throw new Error('Project ID was not created successfully.');
      }

      const finalImages: { image_url: string; sort_order: number }[] = [];

      for (const item of gallery) {
        let imageUrl = item.image_url;

        if (item.file) {
          const uploadedUrl = await uploadImage(item.file);
          if (!uploadedUrl) {
            throw new Error(`Failed to upload image: ${item.file.name}`);
          }
          imageUrl = uploadedUrl;
        }

        finalImages.push({
          image_url: imageUrl,
          sort_order: finalImages.length,
        });
      }

      const { error: deleteError } = await supabase
        .from('project_images')
        .delete()
        .eq('project_id', projectId);

      if (deleteError) throw deleteError;

      if (finalImages.length > 0) {
        const { error: insertError } = await supabase
          .from('project_images')
          .insert(
            finalImages.map((img) => ({
              project_id: projectId,
              image_url: img.image_url,
              sort_order: img.sort_order,
            }))
          );

        if (insertError) throw insertError;
      }

      const finalSettings: GallerySettings = {
        ...settings,
        imageLayouts: gallery.map((_, index) => ({
          ...defaultImageLayout,
          ...(settings.imageLayouts[index] ?? {}),
        })),
      };

      await saveGallerySettings(projectId, finalSettings);

      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="glass-card rounded-2xl p-5 md:p-8 max-w-4xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-semibold text-xl text-white">
              {project ? 'Edit Project' : 'New Project'}
            </h2>
            <p className="text-xs text-muted mt-1">
              Project details and gallery settings
            </p>
          </div>

          <button onClick={onClose} className="text-muted hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 max-h-[72vh] overflow-y-auto pr-2">
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-purple-light">
              Project Information
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Title">
                <input
                  value={form.title}
                  onChange={(e) => updateForm('title', e.target.value)}
                  className="admin-input"
                  placeholder="Project title"
                />
              </Field>

              <Field label="Slug">
                <input
                  value={form.slug}
                  onChange={(e) => updateForm('slug', e.target.value)}
                  className="admin-input"
                  placeholder="Auto-generated if empty"
                />
              </Field>
            </div>

            <Field label="Short Description">
              <input
                value={form.description}
                onChange={(e) => updateForm('description', e.target.value)}
                className="admin-input"
              />
            </Field>

            <Field label="Full Description">
              <textarea
                rows={3}
                value={form.long_description}
                onChange={(e) => updateForm('long_description', e.target.value)}
                className="admin-input resize-none"
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Category">
                <select
                  value={form.category_id}
                  onChange={(e) => updateForm('category_id', e.target.value)}
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
                  onChange={(e) => updateForm('project_date', e.target.value)}
                  className="admin-input"
                />
              </Field>
            </div>

            <Field label="Tools (comma separated)">
              <input
                value={form.tools}
                onChange={(e) => updateForm('tools', e.target.value)}
                className="admin-input"
                placeholder="Photoshop, Illustrator, Figma"
              />
            </Field>

            <Field label="Goals">
              <textarea
                rows={2}
                value={form.goals}
                onChange={(e) => updateForm('goals', e.target.value)}
                className="admin-input resize-none"
              />
            </Field>

            <Field label="Design Process">
              <textarea
                rows={2}
                value={form.process}
                onChange={(e) => updateForm('process', e.target.value)}
                className="admin-input resize-none"
              />
            </Field>

            <Field label="Cover Image">
              <div className="flex gap-3 items-center">
                <input
                  value={form.cover_image}
                  onChange={(e) => updateForm('cover_image', e.target.value)}
                  className="admin-input flex-1"
                  placeholder="Image URL"
                />

                <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl glass text-sm text-white cursor-pointer">
                  <Upload size={15} />
                  {uploadingCover ? 'Uploading...' : 'Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                    disabled={uploadingCover}
                  />
                </label>
              </div>

              {form.cover_image && (
                <img
                  src={form.cover_image}
                  alt="Cover preview"
                  className="mt-3 w-full h-40 object-cover rounded-xl"
                />
              )}
            </Field>
          </section>

          <div className="border-t border-white/10 pt-6 space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-purple-light flex items-center gap-2">
                <ImagePlus size={17} /> Project Gallery
              </h3>
              <p className="text-xs text-muted mt-1">
                Upload, arrange, resize and customize each image separately.
              </p>
            </div>

            <label className="flex items-center justify-center gap-2 border border-dashed border-purple/40 rounded-xl p-5 text-sm text-white cursor-pointer hover:bg-purple/5 transition">
              <Upload size={18} />
              Add Gallery Images
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                className="hidden"
              />
            </label>

            {loadingGallery ? (
              <p className="text-sm text-muted">Loading gallery...</p>
            ) : gallery.length === 0 ? (
              <p className="text-sm text-muted text-center py-4">
                No gallery images added yet.
              </p>
            ) : (
              <div className="space-y-4">
                {gallery.map((img, index) => {
                  const imageLayout = {
                    ...defaultImageLayout,
                    ...(settings.imageLayouts[index] ?? {}),
                  };

                  return (
                    <div
                      key={`${img.id ?? img.image_url}-${index}`}
                      className="glass rounded-xl p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-24 shrink-0 bg-black/20 rounded-lg overflow-hidden">
                          <img
                            src={img.image_url}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium">
                            Image {index + 1}
                          </p>
                          <p className="text-xs text-muted mt-1">
                            Width: {imageLayout.width}% · Ratio: {imageLayout.aspectRatio}
                          </p>

                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => moveImage(index, -1)}
                              disabled={index === 0}
                              className="p-2 rounded-lg glass disabled:opacity-30"
                              title="Move up"
                            >
                              <ChevronUp size={16} />
                            </button>

                            <button
                              onClick={() => moveImage(index, 1)}
                              disabled={index === gallery.length - 1}
                              className="p-2 rounded-lg glass disabled:opacity-30"
                              title="Move down"
                            >
                              <ChevronDown size={16} />
                            </button>

                            <button
                              onClick={() => removeImage(index)}
                              className="p-2 rounded-lg glass text-red-400"
                              title="Remove image"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs text-muted">Image Width</label>
                          <span className="text-sm text-purple-light font-semibold">
                            {imageLayout.width}%
                          </span>
                        </div>

                        <input
                          type="range"
                          min="25"
                          max="100"
                          step="5"
                          value={imageLayout.width}
                          onChange={(e) =>
                            updateImageLayout(index, {
                              width: Number(e.target.value),
                            })
                          }
                          className="w-full accent-purple"
                        />

                        <label className="block text-xs text-muted">
                          Image Ratio
                        </label>

                        <select
                          value={imageLayout.aspectRatio}
                          onChange={(e) =>
                            updateImageLayout(index, {
                              aspectRatio: e.target.value as ImageRatio,
                            })
                          }
                          className="admin-input"
                        >
                          <option value="auto">Original Ratio</option>
                          <option value="1/1">Square 1:1</option>
                          <option value="3/4">Portrait 3:4</option>
                          <option value="4/5">Portrait 4:5</option>
                          <option value="16/9">Landscape 16:9</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t border-white/10 pt-6 space-y-5">
            <h3 className="text-sm font-semibold text-purple-light flex items-center gap-2">
              <LayoutGrid size={17} /> Gallery Layout
            </h3>

            <Field label="Layout Style">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {([
                  ['masonry', 'Masonry'],
                  ['grid', 'Uniform Grid'],
                  ['full', 'Full Width'],
                  ['editorial', 'Editorial'],
                ] as [GalleryLayout, string][]).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setSettings((prev) => ({ ...prev, layout: value }))}
                    className={`p-3 rounded-xl border text-xs transition ${
                      settings.layout === value
                        ? 'border-purple bg-purple/20 text-white'
                        : 'border-white/10 glass text-muted'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Field>

            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Columns">
                <select
                  value={settings.columns}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, columns: Number(e.target.value) }))
                  }
                  className="admin-input"
                  disabled={settings.layout === 'full'}
                >
                  <option value={1}>1 Column</option>
                  <option value={2}>2 Columns</option>
                  <option value={3}>3 Columns</option>
                  <option value={4}>4 Columns</option>
                </select>
              </Field>

              <Field label={`Image Gap (${settings.gap}px)`}>
                <input
                  type="range"
                  min="0"
                  max="48"
                  step="4"
                  value={settings.gap}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, gap: Number(e.target.value) }))
                  }
                  className="w-full mt-3 accent-purple"
                />
              </Field>

              <Field label="Gallery Width">
                <select
                  value={settings.maxWidth}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, maxWidth: Number(e.target.value) }))
                  }
                  className="admin-input"
                >
                  <option value={900}>Narrow</option>
                  <option value={1100}>Default</option>
                  <option value={1280}>Wide</option>
                  <option value={1440}>Extra Wide</option>
                </select>
              </Field>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-purple-light flex items-center gap-2">
                <Columns3 size={17} /> Live Preview
              </h3>
              <span className="text-xs text-muted">Preview of gallery layout</span>
            </div>

            <div
              className="mx-auto flex flex-wrap items-start"
              style={{
                maxWidth: `${settings.maxWidth}px`,
                gap: `${settings.gap}px`,
              }}
            >
              {gallery.map((img, index) => {
                const imageLayout = {
                  ...defaultImageLayout,
                  ...(settings.imageLayouts[index] ?? {}),
                };

                const width = Math.max(25, Math.min(100, imageLayout.width));

                return (
                  <div
                    key={`preview-${index}`}
                    style={{
                      flex: `0 0 calc(${width}% - ${settings.gap * (width / 100)}px)`,
                      maxWidth: `calc(${width}% - ${settings.gap * (width / 100)}px)`,
                    }}
                    className="overflow-hidden rounded-lg bg-black/20"
                  >
                    <div
                      style={{
                        width: '100%',
                        aspectRatio:
                          imageLayout.aspectRatio === 'auto'
                            ? undefined
                            : imageLayout.aspectRatio,
                      }}
                    >
                      <img
                        src={img.image_url}
                        alt=""
                        className={
                          imageLayout.aspectRatio === 'auto'
                            ? 'block w-full h-auto object-contain'
                            : 'block w-full h-full object-contain'
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 border-t border-white/10 pt-6">
            <Field label="Sort Order">
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => updateForm('sort_order', Number(e.target.value))}
                className="admin-input"
              />
            </Field>

            <div className="flex items-end gap-4 pb-2">
              <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => updateForm('is_published', e.target.checked)}
                  className="accent-purple"
                />
                Published
              </label>

              <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => updateForm('is_featured', e.target.checked)}
                  className="accent-purple"
                />
                Featured
              </label>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 whitespace-pre-wrap">{error}</p>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={saving || uploadingCover || loadingGallery || !form.title.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple to-purple-dark text-white text-sm font-medium disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Project'}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl glass text-sm text-white"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
