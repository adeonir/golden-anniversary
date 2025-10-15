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

- **Database**: Neon PostgreSQL + Drizzle ORM
- **Auth**: JWT + bcrypt (stateless, httpOnly cookies)
- **Storage**: ImageKit CDN (with automatic optimizations)
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
│   ├── database/      # Neon connection + Drizzle schemas
│   ├── auth/          # JWT tokens + authentication utilities
│   └── images/        # ImageKit client + blur placeholders
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

## Database Schema (Drizzle ORM)

### Tables

**users** (Authentication):

```typescript
- id (UUID) - Unique identifier
- email (TEXT) - Admin email
- password (TEXT) - bcrypt hashed password
- createdAt (TIMESTAMPTZ) - Creation date
```

**messages** (Guestbook):

```typescript
- id (UUID) - Unique identifier
- name (TEXT) - Author name
- message (TEXT) - Message content
- status (ENUM) - 'pending' | 'approved' | 'rejected'
- createdAt (TIMESTAMPTZ) - Creation date
```

**photos** (Gallery):

```typescript
- id (UUID) - Unique identifier
- filename (TEXT) - File name in ImageKit
- title (TEXT, nullable) - Optional photo title
- url (TEXT) - ImageKit CDN URL
- fileId (TEXT) - ImageKit file ID for deletion
- size (INTEGER) - Size in bytes
- order (INTEGER) - Position in gallery
- category (ENUM) - 'memory' | 'event'
- createdAt (TIMESTAMPTZ) - Upload date
```

### Storage

**ImageKit CDN**:

- Structure: `memories/{uuid}.{ext}` for memories, `event/{uuid}.{ext}` for event photos
- Automatic image optimization and CDN delivery
- Blur placeholders generated with plaiceholder
- File operations via ImageKit SDK

### Authentication & Authorization

- **JWT**: Stateless authentication with httpOnly cookies
- **Middleware**: Validates JWT tokens and checks user existence
- **messages**: Public read (only 'approved'), authenticated write for admin
- **photos**: Public read, admin-only authenticated write

## Environment Variables

### Development (.env.local)

```bash
# Database
DATABASE_URL=postgresql://username:password@ep-example.us-east-2.aws.neon.tech/dbname?sslmode=require

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-at-least-32-chars

# ImageKit
IMAGEKIT_PRIVATE_KEY=private_your-private-key-here
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_your-public-key-here
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id

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
pnpm check            # TypeScript type checking

# Dependencies
pnpm install          # Install dependencies
pnpm add <package>    # Add new dependency
```

## SQL Setup Scripts

### Database Setup

```bash
# Push schema to Neon database
pnpm db:push

# Generate Drizzle migrations
pnpm db:generate

# View database with Drizzle Studio
pnpm db:studio

# Seed database with sample data
pnpm db:seed
```

## Integrations and APIs

### Integration Configuration

- **Auth**: JWT tokens with bcrypt password hashing
- **Database**: Drizzle ORM with TypeScript-typed queries
- **Storage**: ImageKit CDN with automatic optimizations

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
- Automatic WebP formats via ImageKit CDN
- Responsive images with srcSet

### Bundle

- Automatic code splitting via App Router
- Dynamic imports for heavy components
- Tree shaking configured in next.config.ts

### Database

- Optimized indexes for frequent queries
- Efficient RLS policies
- Connection pooling via Neon

## Security

### Authentication

- JWT authentication with httpOnly cookies
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
