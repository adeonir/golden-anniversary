-- Database tables setup script
-- Execute this script in Supabase SQL Editor

-- ========================================
-- 1. DROP EXISTING TABLES
-- ========================================
DROP TABLE IF EXISTS "messages" CASCADE;
DROP TABLE IF EXISTS "photos" CASCADE;

-- ========================================
-- 2. CREATE TABLES
-- ========================================

-- Messages table
CREATE TABLE "messages" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Photos table
CREATE TABLE "photos" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "filename" TEXT NOT NULL,
  "title" TEXT,
  "url" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================
-- 3. CREATE INDEXES
-- ========================================
CREATE INDEX "messages_status_idx" ON "messages" ("status");
CREATE INDEX "messages_createdAt_idx" ON "messages" ("createdAt");
CREATE INDEX "photos_order_idx" ON "photos" ("order");

-- ========================================
-- 4. VERIFICATION
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
