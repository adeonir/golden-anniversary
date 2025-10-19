# Development Guide

## Overview

This guide covers the development environment setup for the Golden Anniversary website.

## Prerequisites

- Node.js 22+
- pnpm
- Neon database account
- ImageKit account
- PostHog account (for analytics)
- 1Password CLI (recommended for environment variables)
- Code editor (Cursor recommended)

## Initial Setup

### 1. Clone and Installation

```bash
git clone https://github.com/adeonir/golden-anniversary.git
cd golden-anniversary
pnpm install
```

### 2. Environment Variables

Create the `.env.local` file based on `.env.example`:

```bash
# JWT Secret for authentication
JWT_SECRET=your-super-secure-jwt-secret-key-at-least-32-chars

# Neon Database
DATABASE_URL=postgresql://username:password@ep-example.us-east-2.aws.neon.tech/dbname?sslmode=require

# ImageKit Configuration
IMAGEKIT_PRIVATE_KEY=private_your-private-key-here
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_your-public-key-here
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=your-public-key-here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Optional: Skip environment validation during build
SKIP_ENV_VALIDATION=true
```

#### Using 1Password CLI (Recommended)

```bash
# Install 1Password CLI
brew install 1password-cli

# Authenticate
op signin

# All commands will run with 1Password variables `op run --env-file=.env.local --`
pnpm dev
pnpm build
pnpm db:push
```

### 3. Database Setup

The project uses Drizzle ORM with Neon PostgreSQL:

```bash
# Push database schema to Neon
pnpm db:push

# Seed the database with sample data (optional)
pnpm db:seed

# Open Drizzle Studio to manage database
pnpm db:studio
```

The database includes:

- **users**: Admin authentication with bcrypt hashed passwords
- **messages**: Guestbook messages with moderation status
- **photos**: Photo metadata with ImageKit file IDs

## Development Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for development
pnpm build:prod   # Build for production
pnpm start        # Start production server

# Database
pnpm db:push      # Push schema changes
pnpm db:studio    # Open database UI
pnpm db:generate  # Generate migrations
pnpm db:seed      # Seed database with sample data

# Code Quality
pnpm lint         # Format and lint code
pnpm check        # Run TypeScript checks
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
pnpm check
git add .
git commit -m "feat: feature description"
git push origin feat/DEV-XX-feature-name
```

### 2. Debugging

```bash
# Development with logs
pnpm dev

# Check types
pnpm check

# Local build
pnpm build
```

### 3. Testing

- **Manual Testing**: Navigate through the application
- **Type Checking**: `pnpm check`
- **Linting**: `pnpm lint`

## Testing

- Scope

  - Cover: server actions (messages/photos), auth/JWT and middleware, image workflows (client/blur), TanStack Query wrappers
  - Exclude: UI hooks (state/UX)

- Organization

  - Co-locate specs in `src/**/*.spec.ts(x)`
  - Use `tests/` only for mocks and utilities

- Infrastructure

  - In-memory PGlite database; reset between tests
  - Isolated environment variables for tests
  - Validate cache invalidation via `revalidatePath` in critical flows
  - Polyfill `File.arrayBuffer` in jsdom when required

- Commands

  - `pnpm test`
  - `pnpm test:watch`

- Conventions
  - Prefer domain assertions over implementation details

## Technology Configuration

### 1. Neon Database

1. Create a project at [Neon](https://neon.tech)
2. Copy the connection string to `DATABASE_URL`
3. Use Drizzle to manage schema and migrations

### 2. ImageKit Storage

1. Create account at [ImageKit](https://imagekit.io)
2. Get your URL endpoint, public key, and private key
3. Configure environment variables
4. Images are automatically optimized and served via CDN

### 3. PostHog Analytics

1. Create account at [PostHog](https://posthog.com)
2. Create a new project in your workspace
3. Copy your project API key and host URL
4. Configure environment variables:
   - `NEXT_PUBLIC_POSTHOG_KEY`: Your PostHog project API key
   - `NEXT_PUBLIC_POSTHOG_HOST`: PostHog host URL (default: https://app.posthog.com)
5. Analytics are automatically tracked across key user interactions:
   - Section views (countdown, timeline, family messages)
   - Guestbook message submissions and form abandonment
   - Footer external link clicks

#### Error Monitoring

PostHog is configured to capture all errors from mutations and queries:

**Tracked Events:**
- `API Error`: General API errors
- `Mutation Error`: Errors from create, update, delete operations
- `Query Error`: Errors from data fetching operations

**Error Properties:**
- `error_message`: Error message text
- `error_type`: Error class name
- `context`: Operation context (e.g., "createMessage", "fetchPhotos")
- `stack_trace`: Full error stack trace
- `url`: Page URL where error occurred

**Implementation:**
All data hooks (`use-messages.ts`, `use-photos.ts`) use the `useErrorTracking` hook to automatically capture errors before showing user-facing toast messages. This provides full visibility into production errors.

### 4. JWT Authentication

- Stateless authentication using JSON Web Tokens
- Passwords hashed with bcrypt
- Admin user created via temporary script
- Middleware validates JWT and user existence
- Sessions stored in httpOnly cookies

### 5. Security

#### Application-Level Security

- **JWT tokens**: Signed with secure secret, httpOnly cookies
- **Password hashing**: bcrypt with salt rounds
- **Database access**: Controlled at application level via Drizzle
- **File uploads**: Validated size, format, and processed via ImageKit
- **Environment variables**: Validated with Zod schemas

#### Database Security

- **SSL connections**: Required for Neon database
- **Connection pooling**: Handled by Neon automatically
- **Backup**: Automatic backups via Neon
- **Branching**: Use Neon branches for safe schema changes

## Troubleshooting

### Common Issues

1. **Environment Variables Error**

   - Check `.env.local`
   - Restart development server

2. **TypeScript Type Errors**

   - Run `pnpm check`
   - Check imports and types

3. **Database Connection Error**

   - Check Neon DATABASE_URL format
   - Verify SSL connection settings
   - Test with Drizzle Studio

4. **ImageKit Upload Issues**
   - Check ImageKit keys and endpoint
   - Verify file size and format limits
   - Check Next.js image configuration

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
- Neon connection issues
- ImageKit rate limiting
- Temporary server overload
