import { useEffect, useState } from 'react';
import { Save, Upload, Plus, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/upload';
import type { About } from '@/types';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminAbout() {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    full_name: '',
    bio: '',
    philosophy: '',
    years_experience: 0,
    profile_image: '',
    skills: [] as string[],
    social_links: {} as Record<string, string>,
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { data } = await supabase.from('about').select('*').maybeSingle();
      if (data) {
        setAbout(data as About);
        setForm({
          full_name: data.full_name ?? '',
          bio: data.bio ?? '',
          philosophy: data.philosophy ?? '',
          years_experience: data.years_experience ?? 0,
          profile_image: data.profile_image ?? '',
          skills: data.skills ?? [],
          social_links: data.social_links ?? {},
        });
      }
      setLoading(false);
    })();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      if (url) setForm({ ...form, profile_image: url });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!supabase) return;
    setSaving(true);
    setError(null);
    try {
      if (about) {
        const { error } = await supabase.from('about').update(form).eq('id', about.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('about').insert(form);
        if (error) throw error;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="w-10 h-10 rounded-full border-2 border-purple/20 border-t-purple-light animate-spin" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">About Me</h1>
        <p className="text-sm text-muted">Edit your profile and skills.</p>
      </div>

      <div className="max-w-2xl space-y-5">
        <div>
          <label className="admin-label">Full Name</label>
          <input
            type="text"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="admin-input"
          />
        </div>

        <div>
          <label className="admin-label">Profile Image</label>
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={form.profile_image}
              onChange={(e) => setForm({ ...form, profile_image: e.target.value })}
              className="admin-input flex-1"
              placeholder="Image URL"
            />
            <label className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl glass text-sm text-white cursor-pointer hover:border-purple/30 transition-all whitespace-nowrap">
              <Upload size={15} />
              {uploading ? 'Uploading...' : 'Upload'}
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
          </div>
          {form.profile_image && (
            <img src={form.profile_image} alt="Profile" className="mt-3 w-32 h-32 rounded-2xl object-cover" />
          )}
        </div>

        <div>
          <label className="admin-label">Biography</label>
          <textarea
            rows={4}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="admin-input resize-none"
          />
        </div>

        <div>
          <label className="admin-label">Creative Philosophy</label>
          <textarea
            rows={3}
            value={form.philosophy}
            onChange={(e) => setForm({ ...form, philosophy: e.target.value })}
            className="admin-input resize-none"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Years of Experience</label>
            <input
              type="number"
              value={form.years_experience}
              onChange={(e) => setForm({ ...form, years_experience: parseInt(e.target.value) || 0 })}
              className="admin-input"
            />
          </div>
        </div>

        <div>
          <label className="admin-label">Skills</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newSkill.trim()) {
                  e.preventDefault();
                  setForm({ ...form, skills: [...form.skills, newSkill.trim()] });
                  setNewSkill('');
                }
              }}
              className="admin-input flex-1"
              placeholder="Add a skill and press Enter"
            />
            <button
              onClick={() => {
                if (newSkill.trim()) {
                  setForm({ ...form, skills: [...form.skills, newSkill.trim()] });
                  setNewSkill('');
                }
              }}
              className="px-3 rounded-xl glass text-white hover:border-purple/30 transition-all"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.skills.map((skill, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-sm text-white"
              >
                {skill}
                <button
                  onClick={() => setForm({ ...form, skills: form.skills.filter((_, idx) => idx !== i) })}
                  className="text-muted hover:text-red-400"
                >
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="admin-label">Social Links</label>
          <div className="space-y-3">
            {['behance', 'instagram', 'linkedin', 'whatsapp'].map((key) => (
              <input
                key={key}
                type="text"
                value={form.social_links[key] ?? ''}
                onChange={(e) =>
                  setForm({ ...form, social_links: { ...form.social_links, [key]: e.target.value } })
                }
                className="admin-input"
                placeholder={`${key} URL`}
              />
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple to-purple-dark text-white text-sm font-medium glow-soft disabled:opacity-50 transition-all"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {saved && <span className="text-sm text-green-400">Saved!</span>}
        </div>
      </div>
    </AdminLayout>
  );
}
