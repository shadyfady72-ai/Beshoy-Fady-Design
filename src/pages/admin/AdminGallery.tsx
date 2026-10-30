import { useEffect, useState } from 'react';
import { Trash2, Upload, Plus, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/upload';
import type { Project, ProjectImage } from '@/types';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminGallery() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { data } = await supabase.from('projects').select('id, title').order('sort_order');
      setProjects((data as Project[]) ?? []);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!supabase || !selectedProject) return;
    (async () => {
      const { data } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', selectedProject)
        .order('sort_order');
      setImages((data as ProjectImage[]) ?? []);
    })();
  }, [selectedProject]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!supabase || !selectedProject || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        const url = await uploadImage(file);
        if (url) {
          await supabase.from('project_images').insert({
            project_id: selectedProject,
            image_url: url,
            sort_order: images.length,
          });
        }
      }
      const { data } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', selectedProject)
        .order('sort_order');
      setImages((data as ProjectImage[]) ?? []);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    await supabase.from('project_images').delete().eq('id', id);
    setImages(images.filter((img) => img.id !== id));
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">Gallery</h1>
        <p className="text-sm text-muted">Upload images for each project.</p>
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
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          {selectedProject && (
            <>
              <div>
                <label className="flex items-center gap-2 px-4 py-3 rounded-xl glass text-sm text-white cursor-pointer hover:border-purple/30 transition-all w-fit">
                  <Upload size={16} />
                  {uploading ? 'Uploading...' : 'Upload Images'}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              {images.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <p className="text-sm text-muted">No gallery images yet.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((img) => (
                    <div key={img.id} className="relative group rounded-xl overflow-hidden glass-card">
                      <img src={img.image_url} alt="Gallery" className="w-full h-40 object-cover" />
                      <button
                        onClick={() => handleDelete(img.id)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-500/20 backdrop-blur-md flex items-center justify-center text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={15} />
                      </button>
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
