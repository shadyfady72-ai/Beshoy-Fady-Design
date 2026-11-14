
import { useEffect, useState, type ChangeEvent, type DragEvent } from 'react';
import {
  Trash2,
  Upload,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Save,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/upload';
import type { Project, ProjectImage } from '@/types';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminGallery() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState('');

  // Load projects
  useEffect(() => {
    if (!supabase) return;

    (async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title')
        .order('sort_order');

      if (error) {
        setError(error.message);
      } else {
        setProjects((data as Project[]) ?? []);
      }

      setLoading(false);
    })();
  }, []);

  // Load project images
  const loadImages = async () => {
    if (!supabase || !selectedProject) return;

    const { data, error } = await supabase
      .from('project_images')
      .select('*')
      .eq('project_id', selectedProject)
      .order('sort_order', { ascending: true });

    if (error) {
      setError(error.message);
      return;
    }

    setImages((data as ProjectImage[]) ?? []);
  };

  useEffect(() => {
    setImages([]);
    setError(null);
    setSuccess('');

    if (selectedProject) {
      loadImages();
    }
  }, [selectedProject]);

  // Save image order in Supabase
  
const persistOrder = async (orderedImages: ProjectImage[]) => {
  if (!supabase) return;

  const client = supabase;

  const results = await Promise.all(
    orderedImages.map((img, index) =>
      client
        .from('project_images')
        .update({ sort_order: index })
        .eq('id', img.id)
        .eq('project_id', selectedProject)
    )
  );

  const failed = results.find((result) => result.error);

  if (failed?.error) {
    throw failed.error;
  }
};


  // Reorder images
  const reorderImages = async (fromId: string, toId: string) => {
    if (fromId === toId || savingOrder) return;

    const oldImages = [...images];
    const newImages = [...images];

    const fromIndex = newImages.findIndex((img) => img.id === fromId);
    const toIndex = newImages.findIndex((img) => img.id === toId);

    if (fromIndex === -1 || toIndex === -1) return;

    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);

    setImages(newImages);
    setSavingOrder(true);
    setError(null);
    setSuccess('');

    try {
      await persistOrder(newImages);
      setSuccess('Image order saved successfully.');
    } catch (err) {
      setImages(oldImages);
      setError(
        err instanceof Error ? err.message : 'Failed to save image order.'
      );
    } finally {
      setSavingOrder(false);
    }
  };

  // Drag and drop
  const handleDragStart = (
    e: DragEvent<HTMLDivElement>,
    id: string
  ) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDrop = async (
    e: DragEvent<HTMLDivElement>,
    targetId: string
  ) => {
    e.preventDefault();

    const sourceId = draggedId || e.dataTransfer.getData('text/plain');

    if (sourceId) {
      await reorderImages(sourceId, targetId);
    }

    setDraggedId(null);
  };

  // Upload images
  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    if (!supabase || !selectedProject || files.length === 0) return;

    setUploading(true);
    setError(null);
    setSuccess('');

    try {
      let nextOrder =
        Math.max(-1, ...images.map((img) => img.sort_order ?? -1)) + 1;

      for (const file of files) {
        const url = await uploadImage(file);

        if (!url) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const { error } = await supabase
          .from('project_images')
          .insert({
            project_id: selectedProject,
            image_url: url,
            sort_order: nextOrder++,
          });

        if (error) throw error;
      }

      await loadImages();
      setSuccess('Images uploaded successfully.');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Image upload failed.'
      );
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Delete image
  const handleDelete = async (id: string) => {
    if (!supabase || !confirm('Delete this image?')) return;

    setError(null);
    setSuccess('');

    const { error } = await supabase
      .from('project_images')
      .delete()
      .eq('id', id);

    if (error) {
      setError(error.message);
      return;
    }

    setImages((prev) => prev.filter((img) => img.id !== id));
    setSuccess('Image deleted successfully.');
  };

  // Move image with buttons
  const moveImage = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= images.length) return;

    await reorderImages(images[index].id, images[targetIndex].id);
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">
          Gallery
        </h1>
        <p className="text-sm text-muted">
          Upload and organize project images. Drag images to change their order.
        </p>
      </div>

      {loading ? (
        <div className="w-10 h-10 rounded-full border-2 border-purple/20 border-t-purple-light animate-spin" />
      ) : (
        <div className="space-y-6">
          <div>
            <label className="admin-label">Select Project</label>

            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="admin-input"
            >
              <option value="">Choose a project...</option>

              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {selectedProject && (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-3 rounded-xl glass text-sm text-white cursor-pointer hover:border-purple/30 transition-all">
                  <Upload size={16} />
                  {uploading ? 'Uploading...' : 'Upload Images'}

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleUpload}
                    className="hidden"
                    disabled={uploading || savingOrder}
                  />
                </label>

                <div className="text-xs text-muted">
                  Drag and drop images to rearrange them.
                </div>
              </div>

              {savingOrder && (
                <div className="flex items-center gap-2 text-purple-light text-sm">
                  <Save size={16} className="animate-pulse" />
                  Saving new order...
                </div>
              )}

              {success && (
                <p className="text-sm text-green-400">{success}</p>
              )}

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}

              {images.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <p className="text-sm text-muted">
                    No gallery images yet.
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <div
                      key={img.id}
                      draggable={!savingOrder && !uploading}
                      onDragStart={(e) => handleDragStart(e, img.id)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, img.id)}
                      onDragEnd={() => setDraggedId(null)}
                      className={`relative group rounded-xl overflow-hidden glass-card border transition-all ${
                        draggedId === img.id
                          ? 'opacity-40 border-purple'
                          : 'border-white/10 hover:border-purple/40'
                      } ${
                        savingOrder ? 'pointer-events-none' : 'cursor-grab active:cursor-grabbing'
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={img.image_url}
                          alt={`Gallery image ${index + 1}`}
                          className="w-full h-40 object-cover pointer-events-none"
                        />

                        <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-xs">
                          <GripVertical size={14} />
                          <span>{index + 1}</span>
                        </div>

                        <button
                          onClick={() => handleDelete(img.id)}
                          disabled={savingOrder}
                          className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-500/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                          title="Delete image"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="p-3 flex items-center justify-between gap-2">
                        <span className="text-xs text-muted">
                          Image {index + 1}
                        </span>

                        <div className="flex gap-1">
                          <button
                            onClick={() => moveImage(index, -1)}
                            disabled={index === 0 || savingOrder}
                            className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white disabled:opacity-20 hover:text-purple-light transition-colors"
                            title="Move up"
                          >
                            <ChevronUp size={17} />
                          </button>

                          <button
                            onClick={() => moveImage(index, 1)}
                            disabled={index === images.length - 1 || savingOrder}
                            className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white disabled:opacity-20 hover:text-purple-light transition-colors"
                            title="Move down"
                          >
                            <ChevronDown size={17} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
