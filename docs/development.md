# Development Guide

## Overview

This guide covers the development environment setup for the Golden Anniversary website.

## Prerequisites

- Node.js 22+
- pnpm
- Supabase account
- Code editor (Cursor recommended)

## Initial Setup

### 1. Clone and Installation

```bash
git clone https://github.com/adeonir/golden-anniversary.git
cd golden-anniversary
pnpm install
```

### 2. Environment Variables

#### Option 1: .env.local File

Create the `.env.local` file:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Admin
ADMIN_EMAIL=your_admin_email@gmail.com
```

#### Option 2: 1Password CLI (Recommended)

```bash
# Install 1Password CLI
brew install 1password-cli

# Authenticate
op signin

# Run with 1Password variables
op run --env-file=.env.local -- pnpm dev
```

### 3. Database Setup

Execute in Supabase SQL Editor:

- `docs/setup-database.sql` - Create tables (messages and photos)
- `docs/setup-storage.sql` - Configure photo bucket
- `docs/seed-messages.sql` - Sample data (optional)

## Development Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for development
pnpm build:prod   # Build for production
pnpm start        # Start production server

# Code Quality
pnpm lint         # Format and lint code
pnpm type-check   # Run TypeScript checks
```

## Project Structure

```
src/
├── actions/         # Model - Data layer and business logic
├── app/            # Next.js App Router
├── components/     # View - User interface components
│   ├── app/        # Application-specific sections
│   └── ui/         # Reusable UI components
├── hooks/          # ViewModel - State management
├── lib/            # Utilities & Config
├── providers/      # Context Providers
├── types/          # TypeScript types
└── env.ts          # Environment variables validation
```

## Development Tools

### Code Quality

- **Ultracite**: Automatic linting and formatting
- **TypeScript**: Strict type checking
- **Git Hooks**: Lefthook for pre-commit checks

### Recommended VS Code Extensions

- TypeScript Importer
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter

## Development Workflow

### 1. New Feature

**Commit Message**: `feat: feature description`
**PR Title**: `feat(DEV-XX): feature description with imperative verb`

```bash
# Create branch with Linear ticket
git checkout -b feat/DEV-XX-feature-name

# Develop...
pnpm lint
pnpm type-check
git add .
git commit -m "feat: feature description"
git push origin feat/DEV-XX-feature-name
```

### 2. Debugging

```bash
# Development with logs
pnpm dev

# Check types
pnpm type-check

# Local build
pnpm build
```

### 3. Testing

- **Manual Testing**: Navigate through the application
- **Type Checking**: `pnpm type-check`
- **Linting**: `pnpm lint`

## Supabase Configuration

### 1. Local Project

1. Create a project at [Supabase](https://supabase.com)
2. Configure environment variables
3. Execute SQL scripts

### 2. Storage

1. Create `photos` bucket
2. Configure as public
3. Test image uploads

### 3. Authentication

1. Enable email authentication
2. Configure email templates
3. Test admin login

### 4. Security Settings

#### Row Level Security (RLS)

RLS policies are applied automatically by SQL scripts:

- **messages table**: Public reads only approved messages, admin has full access
- **photos table**: Public reads all photos, admin has full access
- **photos storage**: Public reads photos, admin has full CRUD

#### Secure Authentication

Configure in Supabase dashboard (Authentication > Settings):

**Security:**

1. Enable "Breach password protection" to prevent leaked passwords
2. Configure strong password policies if needed

**Multi-Factor Authentication:**

1. Enable TOTP (Time-based One-Time Password)
2. Configure backup codes
3. Allow multiple factors per user

#### Security Verification

Execute in SQL Editor to verify RLS is working:

```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('messages', 'photos');

-- Check created policies
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename IN ('messages', 'photos');
```

## Troubleshooting

### Common Issues

1. **Environment Variables Error**

   - Check `.env.local`
   - Restart development server

2. **TypeScript Type Errors**

   - Run `pnpm type-check`
   - Check imports and types

3. **Supabase Connection Error**
   - Check URL and keys
   - Test in SQL Editor

### Useful Commands

```bash
# Clear cache
rm -rf .next
pnpm dev

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Check versions
node --version
pnpm --version
```

## Best Practices

### Code

- Use TypeScript strictly
- Follow naming conventions
- Keep components small
- Use Server Actions for server-side operations

### Git

- Atomic and descriptive commits
- Use conventional commits
- Keep main branch clean
- Create PRs for significant changes

### Performance

- Use React Query for caching
- Optimize images
- Implement lazy loading
- Monitor Core Web Vitals

### Network Resilience

#### Retry Logic with Exponential Backoff

The project implements automatic retry with exponential backoff to improve network resilience:

**Global Configuration (TanStack Query Provider):**

- **Queries**: 3 attempts with delays 1s → 2s → 4s (max 30s)
- **Mutations**: 2 attempts with delays 1s → 2s (max 10s)

**Why Exponential Backoff?**

- **Fixed delay problem**: Constant server overload during instability
- **Smart solution**: Progressively increases time between attempts
- **Benefits**:
  - Reduces server load during error spikes
  - Prevents "thundering herd effect" (everyone trying simultaneously)
  - Gives services time to recover
  - Naturally respects API rate limits

**Implementation:**

```typescript
// src/providers/query-client.tsx
queries: {
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
}
```

**Use cases:**

- Temporary API failures
- Network instability
- Supabase rate limiting
- Temporary server overload