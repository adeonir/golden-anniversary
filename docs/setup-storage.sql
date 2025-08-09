-- Supabase Storage Setup Script for Photos
-- Execute this script in Supabase SQL Editor
--
-- SECURITY: This script configures RLS policies for the storage bucket
-- - Public: Read access to all photos
-- - Authenticated users (admin): Full CRUD access

-- 1. Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  public = EXCLUDED.public;

-- 2. Create storage policy to allow public read access
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'photos');

-- 3. Create storage policy to allow authenticated users to upload
CREATE POLICY "Authenticated users can upload photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'photos'
  AND auth.role() = 'authenticated'
);

-- 4. Create storage policy to allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update photos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'photos'
  AND auth.role() = 'authenticated'
);

-- 5. Create storage policy to allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'photos'
  AND auth.role() = 'authenticated'
);

-- 6. Verify storage bucket configuration
SELECT
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE id = 'photos';

-- 7. Verify storage policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects'
  AND schemaname = 'storage';
