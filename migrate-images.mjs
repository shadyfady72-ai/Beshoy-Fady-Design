
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'http://127.0.0.1:54321',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Service role key is missing');
  }

  // تأكد من وجود Storage bucket
  const { error: bucketError } = await supabase.storage.getBucket('portfolio');

  if (bucketError) {
    const { error } = await supabase.storage.createBucket('portfolio', {
      public: true
    });
    if (error && !error.message.includes('already exists')) throw error;
  }

  // جلب صور المعارض
  const { data: gallery, error: galleryError } = await supabase
    .from('project_images')
    .select('id, image_url');

  if (galleryError) throw galleryError;

  // جلب صور أغلفة المشاريع
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id, cover_image')
    .not('cover_image', 'is', null);

  if (projectsError) throw projectsError;

  // تجميع الصور بدون تكرار
  const assets = new Map();

  for (const row of gallery) {
    if (!row.image_url) continue;
    if (!assets.has(row.image_url)) {
      assets.set(row.image_url, { gallery: [], projects: [] });
    }
    assets.get(row.image_url).gallery.push(row.id);
  }

  for (const row of projects) {
    if (!row.cover_image) continue;
    if (!assets.has(row.cover_image)) {
      assets.set(row.cover_image, { gallery: [], projects: [] });
    }
    assets.get(row.cover_image).projects.push(row.id);
  }

  console.log(`Found ${assets.size} unique images`);

  let success = 0;
  let failed = 0;

  for (const [oldUrl, refs] of assets) {
    try {
      const fileName = new URL(oldUrl).pathname.split('/').pop();
      const storagePath = `migration/${fileName}`;

      const response = await fetch(oldUrl);
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const contentType =
        response.headers.get('content-type') || 'application/octet-stream';

      const file = Buffer.from(await response.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(storagePath, file, {
          contentType,
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('portfolio')
        .getPublicUrl(storagePath);

      const newUrl = data.publicUrl;

      for (const id of refs.gallery) {
        const { error } = await supabase
          .from('project_images')
          .update({ image_url: newUrl })
          .eq('id', id);
        if (error) throw error;
      }

      for (const id of refs.projects) {
        const { error } = await supabase
          .from('projects')
          .update({ cover_image: newUrl })
          .eq('id', id);
        if (error) throw error;
      }

      success++;
      console.log(`OK ${success + failed}/${assets.size}: ${fileName}`);
    } catch (error) {
      failed++;
      console.error(`FAILED: ${oldUrl}`);
      console.error(error.message);
    }
  }

  console.log('\nMigration finished');
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);
}

main().catch(console.error);
