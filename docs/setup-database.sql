-- Database Tables Setup Script
-- Execute this script in Supabase SQL Editor

-- ========================================
-- 1. DROP EXISTING TABLES
-- ========================================
DROP TABLE IF EXISTS "messages" CASCADE;
DROP TABLE IF EXISTS "photos" CASCADE;

-- ========================================
-- 2. CREATE TABLES
-- ========================================

-- Messages table for guestbook functionality
CREATE TABLE "messages" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Photos table for gallery functionality
CREATE TABLE "photos" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "filename" TEXT NOT NULL,
  "title" TEXT,
  "url" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "category" TEXT NOT NULL DEFAULT 'memory' CHECK (category IN ('memory', 'event')),
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================
-- 3. CREATE INDEXES
-- ========================================
CREATE INDEX "messages_status_idx" ON "messages" ("status");
CREATE INDEX "messages_createdAt_idx" ON "messages" ("createdAt");
CREATE INDEX "photos_order_idx" ON "photos" ("order");
CREATE INDEX "photos_category_idx" ON "photos" ("category");

-- ========================================
-- 4. ENABLE ROW LEVEL SECURITY
-- ========================================

-- Enable RLS on messages table
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;

-- Enable RLS on photos table
ALTER TABLE "photos" ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 5. CREATE RLS POLICIES
-- ========================================

-- Messages policies
-- Single SELECT policy with conditional logic (avoids Multiple Permissive Policies warning)
CREATE POLICY "Public can read messages" ON "messages"
FOR SELECT USING (
  CASE
    WHEN (select auth.role()) = 'authenticated' THEN true  -- Admin can read all
    ELSE status = 'approved'                               -- Public only approved
  END
);

-- Admin can insert new messages
CREATE POLICY "Admin can insert messages" ON "messages"
FOR INSERT TO authenticated WITH CHECK (true);

-- Admin can update messages
CREATE POLICY "Admin can update messages" ON "messages"
FOR UPDATE TO authenticated USING (true);

-- Admin can delete messages
CREATE POLICY "Admin can delete messages" ON "messages"
FOR DELETE TO authenticated USING (true);

-- Photos policies
-- Single SELECT policy for all users (avoids Multiple Permissive Policies warning)
CREATE POLICY "Public can read photos" ON "photos"
FOR SELECT USING (true);

-- Admin can insert photos
CREATE POLICY "Admin can insert photos" ON "photos"
FOR INSERT TO authenticated WITH CHECK (true);

-- Admin can update photos
CREATE POLICY "Admin can update photos" ON "photos"
FOR UPDATE TO authenticated USING (true);

-- Admin can delete photos
CREATE POLICY "Admin can delete photos" ON "photos"
FOR DELETE TO authenticated USING (true);

-- ========================================
-- 6. VERIFICATION
-- ========================================

-- Verify tables
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name IN ('messages', 'photos')
ORDER BY table_name, ordinal_position;

-- Verify RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('messages', 'photos');

-- Verify RLS policies
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
WHERE tablename IN ('messages', 'photos');
