# Row Level Security (RLS) Setup

This document contains instructions for configuring Row Level Security policies in Supabase.

## Overview

RLS ensures that:

- **Messages**:
  - Public can insert via form
  - Public can view only approved messages
  - Admin can view and manage all messages
- **Photos**: Public can view, only admin can manage
- **Service Role**: Can insert messages via API (public form)

## 1. Enable RLS on Tables

In the **SQL Editor** of Supabase, execute:

```sql
-- Enable RLS on tables
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "photos" ENABLE ROW LEVEL SECURITY;
```

## 2. Policies for `messages` Table

### Remove old policies (if they exist)

```sql
DROP POLICY IF EXISTS "Service role can insert messages" ON "messages";
DROP POLICY IF EXISTS "Only admin can view messages" ON "messages";
DROP POLICY IF EXISTS "Only admin can update messages" ON "messages";
DROP POLICY IF EXISTS "Only admin can delete messages" ON "messages";
```

### Insertion via Service Role (Public Form)

```sql
-- Only service role can insert messages (via API route/server action only)
CREATE POLICY "Service role can insert messages" ON "messages"
  FOR INSERT
  TO service_role
  WITH CHECK (true);
```

### Public Viewing (Approved Messages)

```sql
-- Public can view approved messages
CREATE POLICY "Public can view approved messages" ON "messages"
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');
```

### Complete Viewing by Admin

```sql
-- Admin can view all messages (for moderation)
CREATE POLICY "Admin can view all messages" ON "messages"
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'adeonir@gmail.com');
```

### Management by Admin

```sql
-- Only admin can update messages
CREATE POLICY "Only admin can update messages" ON "messages"
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'adeonir@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'adeonir@gmail.com');

-- Only admin can delete messages
CREATE POLICY "Only admin can delete messages" ON "messages"
  FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'adeonir@gmail.com');
```

## 3. Policies for `photos` Table

### Remove old policies (if they exist)

```sql
DROP POLICY IF EXISTS "Anyone can view photos" ON "photos";
DROP POLICY IF EXISTS "Only admin can manage photos" ON "photos";
```

### Public Viewing

```sql
-- Anyone can view photos (public gallery)
CREATE POLICY "Anyone can view photos" ON "photos"
  FOR SELECT
  TO anon, authenticated
  USING (true);
```

### Management by Admin

```sql
-- Only admin can manage photos
CREATE POLICY "Only admin can manage photos" ON "photos"
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'adeonir@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'adeonir@gmail.com');
```

## 4. Configure Admin Email

⚠️ **Important**: The admin email is configured in the RLS policies above as `'adeonir@gmail.com'`.

Make sure this email matches the `ADMIN_EMAIL` variable in your `.env.local` file.

## 5. Workflow

### Messages

1. **Visitors**: Send messages via form → Server Action → Service Role inserts into database
2. **Visitors**: View only approved messages on public page
3. **Admin**: View all pending messages in dashboard
4. **Admin**: Can approve, reject, or edit messages

### Photos

1. **Visitors**: View public gallery (read-only)
2. **Admin**: Upload, edit, delete, and reorder photos
3. **Storage**: Integrated with RLS for upload/download control

## 6. Using Server Actions

### Unified Fetch Function

```typescript
// Fetch approved messages (public)
const { messages } = await fetchMessages(1, 10, "approved");

// Fetch all messages (admin - RLS allows only if logged in as admin)
const { messages } = await fetchMessages(1, 10);

// Fetch pending messages (admin)
const { messages } = await fetchMessages(1, 10, "pending");
```

### Other Functions

```typescript
// Create message (public via Service Role)
await createMessage({ name: "John", message: "Congratulations!" });

// Delete message (admin)
await deleteMessage("message-id");

// Fetch specific message (admin)
const message = await getMessage("message-id");
```

## 7. Testing Policies

### As Admin (Logged In)

- ✅ View all messages (pending, approved, rejected)
- ✅ Manage messages (approve/reject/edit)
- ✅ View all photos
- ✅ Upload/edit/delete photos

### As Visitor (Not Logged In)

- ✅ View approved messages on public page
- ✅ Send message via form
- ✅ View photo gallery
- ❌ View pending/rejected messages (denied)
- ❌ Upload photos (denied)

### Via Service Role (Server Actions)

- ✅ Insert messages into database
- ✅ Read data for public display

## 8. Security

- **Authentication**: Based on JWT with verified email
- **Authorization**: RLS ensures access only to correct admin
- **Secure Insertion**: Public messages go through Service Role
- **Validation**: Server Actions validate data before insertion
- **Controlled Visibility**: Public sees only approved messages
- **Unified Function**: Single `fetchMessages` function with optional filters
