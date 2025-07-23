import { env } from '~/env'

export const RLS_POLICIES = `
-- Enable RLS on tables
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "photos" ENABLE ROW LEVEL SECURITY;

-- Messages policies
-- Only service role can insert messages (via API route/server action only)
CREATE POLICY "Service role can insert messages" ON "messages"
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Only admin can view messages (for moderation)
CREATE POLICY "Only admin can view messages" ON "messages"
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = '${env.ADMIN_EMAIL}');

-- Only admin can update/delete messages
CREATE POLICY "Only admin can update messages" ON "messages"
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' = '${env.ADMIN_EMAIL}')
  WITH CHECK (auth.jwt() ->> 'email' = '${env.ADMIN_EMAIL}');

CREATE POLICY "Only admin can delete messages" ON "messages"
  FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'email' = '${env.ADMIN_EMAIL}');

-- Photos policies
-- Anyone can view photos (public gallery)
CREATE POLICY "Anyone can view photos" ON "photos"
  FOR SELECT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admin can manage photos
CREATE POLICY "Only admin can manage photos" ON "photos"
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = '${env.ADMIN_EMAIL}')
  WITH CHECK (auth.jwt() ->> 'email' = '${env.ADMIN_EMAIL}');
`
