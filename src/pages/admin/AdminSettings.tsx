import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';

const TEXT_FIELDS = [
  { key: 'hero_label', label: 'Hero Label' },
  { key: 'hero_heading', label: 'Hero Heading' },
  { key: 'hero_description', label: 'Hero Description', textarea: true },
  { key: 'designer_name', label: 'Designer Name' },
  { key: 'admin_email', label: 'Admin Email (authorized Google account)' },
];

const TOGGLES = [
  { key: 'show_selected_works', label: 'Show Selected Works Section' },
  { key: 'show_categories', label: 'Show Categories Section' },
  { key: 'show_about', label: 'Show About Section' },
  { key: 'show_contact', label: 'Show Contact Section' },
];

export default function AdminSettings() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const allKeys = [...TEXT_FIELDS, ...TOGGLES].map((f) => f.key);
      const { data } = await supabase.from('site_settings').select('*').in('setting_key', allKeys);
      const map: Record<string, string> = {};
      (data ?? []).forEach((r: any) => (map[r.setting_key] = r.setting_value ?? ''));
      setValues(map);
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    if (!supabase) return;
    setSaving(true);
    const allKeys = [...TEXT_FIELDS, ...TOGGLES].map((f) => f.key);
    for (const key of allKeys) {
      await supabase
        .from('site_settings')
        .upsert({ setting_key: key, setting_value: values[key] ?? '' }, { onConflict: 'setting_key' });
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
        <h1 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">Website Settings</h1>
        <p className="text-sm text-muted">Control your site content and visibility.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="glass-card rounded-2xl p-6 space-y-5">
          <h2 className="font-display font-semibold text-lg text-white">Content</h2>
          {TEXT_FIELDS.map((field) => (
            <div key={field.key}>
              <label className="admin-label">{field.label}</label>
              {field.textarea ? (
                <textarea
                  rows={3}
                  value={values[field.key] ?? ''}
                  onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                  className="admin-input resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={values[field.key] ?? ''}
                  onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                  className="admin-input"
                />
              )}
            </div>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h2 className="font-display font-semibold text-lg text-white">Section Visibility</h2>
          {TOGGLES.map((toggle) => (
            <label key={toggle.key} className="flex items-center gap-3 text-sm text-white cursor-pointer">
              <input
                type="checkbox"
                checked={values[toggle.key] !== 'false'}
                onChange={(e) =>
                  setValues({ ...values, [toggle.key]: e.target.checked ? 'true' : 'false' })
                }
                className="w-4 h-4 accent-purple"
              />
              {toggle.label}
            </label>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple to-purple-dark text-white text-sm font-medium glow-soft disabled:opacity-50 transition-all"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
          {saved && <span className="text-sm text-green-400">Settings saved!</span>}
        </div>
      </div>
    </AdminLayout>
  );
}
