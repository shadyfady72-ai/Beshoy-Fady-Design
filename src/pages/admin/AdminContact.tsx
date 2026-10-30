import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';

const FIELDS = [
  { key: 'contact_email', label: 'Contact Email' },
  { key: 'whatsapp_link', label: 'WhatsApp Link' },
  { key: 'behance_link', label: 'Behance Link' },
  { key: 'instagram_link', label: 'Instagram Link' },
  { key: 'linkedin_link', label: 'Facebook Link' },
];

export default function AdminContact() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { data } = await supabase.from('site_settings').select('*').in('setting_key', FIELDS.map((f) => f.key));
      const map: Record<string, string> = {};
      (data ?? []).forEach((r: any) => (map[r.setting_key] = r.setting_value ?? ''));
      setValues(map);
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    if (!supabase) return;
    setSaving(true);
    for (const field of FIELDS) {
      await supabase
        .from('site_settings')
        .upsert({ setting_key: field.key, setting_value: values[field.key] ?? '' }, { onConflict: 'setting_key' });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
        <h1 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">Contact Information</h1>
        <p className="text-sm text-muted">Update your contact details and social links.</p>
      </div>

      <div className="max-w-xl space-y-5">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label className="admin-label">{field.label}</label>
            <input
              type="text"
              value={values[field.key] ?? ''}
              onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
              className="admin-input"
              placeholder={field.label}
            />
          </div>
        ))}

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
