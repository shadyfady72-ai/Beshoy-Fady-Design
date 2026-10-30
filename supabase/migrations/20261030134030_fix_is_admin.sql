/*
# Fix is_admin function to read admin email from site_settings

The is_admin() function previously relied on a Postgres GUC setting (app.admin_email)
that cannot be set by the anon-key frontend. Now it reads the allowed admin email
from the site_settings table (key = 'admin_email'), which the admin can update
through the dashboard. This makes RLS enforce admin-only writes server-side.
*/

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users u
    JOIN site_settings s ON s.setting_key = 'admin_email'
    WHERE u.id = auth.uid()
      AND u.email = s.setting_value
      AND s.setting_value IS NOT NULL
      AND s.setting_value <> ''
  );
$$;

REVOKE EXECUTE ON FUNCTION is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- Insert default admin_email setting (placeholder — update via dashboard or env)
INSERT INTO site_settings (setting_key, setting_value)
VALUES ('admin_email', 'admin@example.com')
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;
