-- ============================================================================
-- Let demo users add photos to the club Gallery (only add; no edit or delete).
-- Run after demo_users.sql and demo_guest_mode.sql. Safe to run more than once.
-- Nothing changes for members or the admin.
-- ============================================================================

-- 1. Lift the "demo users can't add rows" block on gallery_photos only.
DROP POLICY IF EXISTS "demo_no_insert" ON public.gallery_photos;

-- 2. A demo user may add a gallery row only as themselves.
DROP POLICY IF EXISTS "demo_gallery_insert_own" ON public.gallery_photos;
CREATE POLICY "demo_gallery_insert_own" ON public.gallery_photos FOR INSERT TO authenticated
  WITH CHECK (public.is_demo_user()
    AND profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

-- 3. Storage: a demo user may upload files only into their own folder of the club-gallery bucket.
DROP POLICY IF EXISTS "demo_gallery_upload_own_folder" ON storage.objects;
CREATE POLICY "demo_gallery_upload_own_folder" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'club-gallery' AND public.is_demo_user()
    AND (storage.foldername(name))[1] = (SELECT id::text FROM public.profiles WHERE auth_user_id = auth.uid()));

-- 4. Check
SELECT schemaname, tablename, policyname, cmd FROM pg_policies
WHERE policyname IN ('demo_gallery_insert_own', 'demo_gallery_upload_own_folder')
ORDER BY tablename;
