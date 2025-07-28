-- Script to recreate tables in Supabase with camelCase
-- Execute this script in Supabase SQL Editor

-- 1. Remove existing tables (if they exist)
DROP TABLE IF EXISTS "messages" CASCADE;
DROP TABLE IF EXISTS "photos" CASCADE;

-- 2. Create messages table
CREATE TABLE "messages" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create photos table
CREATE TABLE "photos" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT,
  "filePath" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create indexes for performance
CREATE INDEX "messages_status_idx" ON "messages" ("status");
CREATE INDEX "messages_createdAt_idx" ON "messages" ("createdAt");
CREATE INDEX "photos_order_idx" ON "photos" ("order");

-- 5. Verify created tables
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name IN ('messages', 'photos')
ORDER BY table_name, ordinal_position;
