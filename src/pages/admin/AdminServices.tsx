import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Service } from '@/types';
import AdminLayout from '@/components/admin/AdminLayout';

const ICON_OPTIONS = ['Palette', 'Share2', 'Layout', 'Megaphone', 'Printer', 'Compass', 'Star', 'PenTool'];

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase.from('services').select('*').order('sort_order');
    setServices((data as Service[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!supabase || !confirm('Delete this service?')) return;
    await supabase.from('services').delete().eq('id', id);
    load();
  };

  const toggleVisible = async (s: Service) => {
    if (!supabase) return;
    await supabase.from('services').update({ is_visible: !s.is_visible }).eq('id', s.id);
    load();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">Services</h1>
          <p className="text-sm text-muted">Manage your service offerings.</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple to-purple-dark text-white text-sm font-medium glow-soft hover:scale-105 transition-all"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add Service</span>
        </button>
      </div>

      {loading ? (
        <div className="w-10 h-10 rounded-full border-2 border-purple/20 border-t-purple-light animate-spin" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <div key={s.id} className="glass-card rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-display font-semibold text-white">{s.title}</h3>
                <button onClick={() => toggleVisible(s)} className="text-muted hover:text-white">
                  {s.is_visible ? <Eye size={16} className="text-green-400" /> : <EyeOff size={16} />}
                </button>
              </div>
              <p className="text-xs text-muted mb-4 line-clamp-3">{s.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(s)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg glass text-xs text-white hover:border-purple/30 transition-all"
                >
                  <Pencil size={13} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
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
          <ServiceModal
            service={editing}
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

function ServiceModal({
  service,
  onClose,
  onSaved,
}: {
  service: Service | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    title: service?.title ?? '',
    description: service?.description ?? '',
    icon: service?.icon ?? 'Palette',
    sort_order: service?.sort_order ?? 0,
    is_visible: service?.is_visible ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!supabase || !form.title) return;
    setSaving(true);
    setError(null);
    try {
      if (service) {
        const { error } = await supabase.from('services').update(form).eq('id', service.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('services').insert(form);
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
            {service ? 'Edit Service' : 'New Service'}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="admin-label">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="admin-input"
              placeholder="Service title"
            />
          </div>
          <div>
            <label className="admin-label">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="admin-input resize-none"
              placeholder="Short description"
            />
          </div>
          <div>
            <label className="admin-label">Icon</label>
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
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Sort Order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="admin-input"
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_visible}
                  onChange={(e) => setForm({ ...form, is_visible: e.target.checked })}
                  className="w-4 h-4 accent-purple"
                />
                Visible
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
