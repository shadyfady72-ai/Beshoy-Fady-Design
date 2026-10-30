/*
# Create portfolio storage bucket

1. Storage
- Create a public bucket named 'portfolio' for project images
- Allow public read access
- Allow authenticated users to upload (admin only via RLS on tables)
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Public read
DROP POLICY IF EXISTS "portfolio_public_read" ON storage.objects;
CREATE POLICY "portfolio_public_read"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'portfolio');

-- Admin write
DROP POLICY IF EXISTS "portfolio_admin_write" ON storage.objects;
CREATE POLICY "portfolio_admin_write"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio' AND is_admin());

DROP POLICY IF EXISTS "portfolio_admin_update" ON storage.objects;
CREATE POLICY "portfolio_admin_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio' AND is_admin())
WITH CHECK (bucket_id = 'portfolio' AND is_admin());

DROP POLICY IF EXISTS "portfolio_admin_delete" ON storage.objects;
CREATE POLICY "portfolio_admin_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio' AND is_admin());
