# Tech Details - Golden Anniversary

## Tech Stack

### Frontend

- **Framework**: Next.js (App Router) + React + TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **State**: TanStack Query for server state
- **Carousel**: Embla Carousel for gallery

### Backend & Services

- **Database**: Supabase PostgreSQL + Auth + Storage
- **Email**: Nodemailer with Vercel Cron Jobs
- **Deployment**: Vercel
- **Monitoring**: Vercel Analytics

### Development Tools

- **Code Quality**: Ultracite (BiomeJS) - linting + formatting
- **Package Manager**: pnpm
- **Version Control**: GitHub + Linear for issues
- **Hooks**: Lefthook for git hooks

## MVVM Architecture

### Folder Structure

```
src/
├── actions/           # Model - Data layer and business logic
├── hooks/             # ViewModel - State management and presentation logic
├── components/        # View - User interface components
│   ├── app/           # Application-specific sections
│   └── ui/            # Reusable UI components (Shadcn/ui)
├── lib/               # Utilities and configurations
├── providers/         # Context Providers
├── types/             # TypeScript definitions
└── middleware.ts      # Next.js middleware
```

### MVVM Separation of Concerns

- **Model** (`src/actions/`): Data operations, server actions, business rules
- **ViewModel** (`src/hooks/`): State management, data transformation, presentation logic
- **View** (`src/components/`): User interface rendering and user interactions
  - `app/` - Application-specific sections and layouts
  - `ui/` - Reusable design system components

## Database Schema

### Tables

**messages** (Guestbook):

```sql
- id (UUID) - Unique identifier
- name (TEXT) - Author name
- message (TEXT) - Message content
- status (TEXT) - 'pending' | 'approved' | 'rejected'
- createdAt (TIMESTAMPTZ) - Creation date
```

**photos** (Gallery):

```sql
- id (UUID) - Unique identifier
- filename (TEXT) - File name in storage
- title (TEXT, nullable) - Optional photo title
- url (TEXT) - Public image URL
- size (INTEGER) - Size in bytes
- order (INTEGER) - Position in gallery
- createdAt (TIMESTAMPTZ) - Upload date
```

### Storage

**Bucket `photos`** (public):

- Structure: `gallery/{uuid}.{ext}`
- RLS policies configured for controlled access
- Automatic image optimization by Supabase

### Row Level Security (RLS)

- **messages**: Public read (only 'approved'), authenticated write for admin
- **photos**: Public read, admin-only authenticated write
- **storage.objects**: Admin-only upload, public read from photos bucket

## Environment Variables

### Development (.env.local)

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_TO=admin@example.com

NODE_ENV=development
```

### Production (Vercel)

Same variables with production values + additional Vercel Cron configurations.

## Development Commands

```bash
# Development
pnpm dev              # Start dev server (localhost:3000)
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Format + lint with Ultracite/BiomeJS
pnpm type-check       # TypeScript type checking

# Dependencies
pnpm install          # Install dependencies
pnpm add <package>    # Add new dependency
```

## SQL Setup Scripts

### Database Setup

```sql
-- Execute in Supabase SQL Editor:
-- 1. docs/setup-database.sql (create tables)
-- 2. docs/setup-storage.sql (configure bucket)
-- 3. docs/seed-messages.sql (sample data - optional)
```

### Backup Commands

```bash
# Complete backup via Supabase CLI
supabase db dump --file backup.sql
supabase storage cp --recursive supabase://photos ./backup-photos/
```

## Integrations and APIs

### Supabase Client Configuration

- **Auth**: Email/password login for admin
- **Database**: TypeScript-typed queries
- **Storage**: Optimized image upload/download

### Email System

- **Provider**: Nodemailer with Gmail SMTP
- **Schedule**: Vercel Cron (daily at 8 PM UTC-3)
- **Template**: Simple HTML with pending messages list
- **Fallback**: GitHub Actions as cron backup

### Monitoring & Analytics

- **Vercel Analytics**: Core Web Vitals, traffic, performance
- **Error Tracking**: Vercel error pages + console logs
- **Uptime**: Monitoring via Vercel dashboard

## Performance Optimization

### Images

- Next.js Image component with lazy loading
- Blur placeholders for better UX
- Automatic WebP formats via Supabase Storage
- Responsive images with srcSet

### Bundle

- Automatic code splitting via App Router
- Dynamic imports for heavy components
- Tree shaking configured in next.config.ts

### Database

- Optimized indexes for frequent queries
- Efficient RLS policies
- Connection pooling via Supabase

## Security

### Authentication

- Supabase Auth with JWT tokens
- Automatic session management
- Middleware for protected routes (/admin)

### Data Protection

- RLS policies on all tables
- Input validation with Zod schemas
- CSRF protection via Next.js
- Environment variables never exposed on client

### Content Security

- Mandatory manual moderation for messages
- File uploads restricted to images only
- Input sanitization before database saves
