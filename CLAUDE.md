# Golden Anniversary - Commemorative Site

Commemorative website for Iria e Ari's 50th wedding anniversary.
**Celebration date**: November 8, 2025, 6:30 PM

## Tech Stack

- **Framework**: Next.js v15 (App Router) + React v19 + TypeScript v5
- **Styling**: Tailwind CSS v4 + Shadcn/ui
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Auth**: JWT + bcrypt (stateless, httpOnly cookies)
- **Storage**: ImageKit CDN (with automatic optimizations)
- **Analytics & Monitoring**: PostHog (user analytics + error tracking)
- **Email**: Nodemailer + Vercel Cron Jobs
- **Deployment**: Vercel
- **Testing**: Vitest + React Testing Library + PGlite
- **Code Quality**: Ultracite (BiomeJS)

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Format and lint code
- `pnpm check` - TypeScript type checking
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode

## Architecture Pattern

This project follows MVVM architecture:

- **Model** (`src/actions/`) - Data layer and business logic
- **ViewModel** (`src/hooks/`) - State management and presentation logic
- **View** (`src/components/`) - User interface components
  - `app/` - Application-specific sections
  - `ui/` - Reusable UI components (Shadcn/ui)
- **Infrastructure** (`src/lib/`) - Database, auth, and storage utilities
  - `database/` - Neon connection + Drizzle schemas
  - `auth/` - JWT tokens + authentication utilities
  - `images/` - ImageKit client + blur placeholders
- **Testing** (`tests/`) - Test infrastructure and utilities
  - `mocks/` - Mock implementations (database, ImageKit, Next.js)
  - `utils/` - Test utilities and helpers

## Project-Specific Rules

### Design System

- Use golden theme colors (gold-50 through gold-950)
- Typography: Inter (body), Playfair Display (headings), Dancing Script (special text)
- Always ensure color contrast ratio ≥ 4.5:1

### Database & API

- Use Drizzle ORM for type-safe database operations
- Database schemas: `users`, `messages`, `photos`
- Use JWT authentication with bcrypt for password hashing
- Admin credentials stored in `users` table (bcrypt hashed)
- JWT stateless authentication with httpOnly cookies
- Middleware validates JWT and checks user existence
- Authorization handled at application level (no RLS)
- Environment variables must be validated using `@t3-oss/env-nextjs`
- All API routes require proper error handling and type safety

### Image Handling

- Always use Next.js Image component with optimization
- Use ImageKit for storage, CDN delivery and automatic optimizations
- Automatic blur placeholders via plaiceholder + ImageKit
- Upload/delete operations via ImageKit SDK
- Use lazy loading for gallery images

### Analytics & Error Monitoring

- PostHog for user analytics and error tracking
- All data hooks must use `useErrorTracking` for error capture
- Track user interactions: section views, form submissions, link clicks
- Capture errors with context before showing user-facing messages
- Error events: `apiError`, `mutationError`, `queryError`
- Error properties: message, type, context, stack trace, URL

## Environment Variables

- `DATABASE_URL` - Neon PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT token signing (min. 32 chars)
- `IMAGEKIT_PUBLIC_KEY` - ImageKit public key
- `IMAGEKIT_PRIVATE_KEY` - ImageKit private key
- `IMAGEKIT_URL_ENDPOINT` - ImageKit URL endpoint
- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog project API key
- `NEXT_PUBLIC_POSTHOG_HOST` - PostHog host URL (default: https://app.posthog.com)

## Testing Infrastructure

- **Framework**: Vitest + React Testing Library + jsdom
- **Database Testing**: PGlite (in-memory PostgreSQL) following Drizzle ORM docs
- **Test Organization**:
  - `tests/mocks/` - Mock implementations (database, ImageKit, Next.js)
  - `tests/utils/` - Database utilities and test helpers
- **Setup**: Comprehensive environment variable mocking
- **Status**: 83 unit tests passing, integration test infrastructure ready

## Key Architecture Points

- Admin user managed via database (created with seed script)
- JWT authentication with httpOnly cookies
- Middleware validates JWT and checks user existence
- Database operations via Drizzle ORM
- Image storage and CDN via ImageKit
- Authorization handled at application level

## Core Features

1. **Header/Hero** - Couple presentation
2. **Countdown** - Timer to celebration (November 8, 2025, 6:30 PM)
3. **Photo Gallery** - Carousel + thumbnails with lazy loading
4. **Guestbook** - Messages with mandatory moderation
5. **Family Messages** - Special section for children/grandchildren
6. **Timeline** - Important milestones in the couple's life
7. **Footer** - Inspirational quote and credits
8. **Admin Panel** - Moderation via JWT authentication

## Git & PR Conventions

### Commit Messages

#### Commit Message Structure

- **Commit message**: concise and descriptive, focusing on WHAT functionality is being added/changed
- **Commit body**: concise explanation of HOW the changes were implemented (optional); prefer 3–4 list items max

#### Message Format

- Use Conventional Commits types (no scope in this project)
- Be specific about functionality, not generic
- Focus on WHAT is added/fixed, not HOW
- For dependencies, specify the purpose
- For fixes, describe the problem being solved
- Use imperative mood (e.g., "add", "fix", "implement")
- Keep it concise; avoid details visible in the diff
- Do not describe changes not in the staged area
- Do not mention future tasks, architectural decisions, or reasoning
- Describe what is being committed, not what was planned or considered

#### Body Format

- Optional when the message is clear enough
- Use list items for multiple changes (3–4 max)
- Focus on HOW the changes were implemented
- Keep items direct and concise
- Do not list files or packages
- Do not mention development decisions
- Do not reference phases or temporary task lists

#### Example

```text
feat: add user profile management

- Create profile edit form with validation
- Add avatar upload with image optimization
- Implement email verification flow
- Extract validation logic to reusable helper
```

### Pull Request Format

**Title**: `type(ISSUE-ID): a concise description about the feature/change`

- **scope**: Must be the Linear issue ID (e.g., DEV-XX, DEV-YY)
- **Example**: `feat(DEV-XX): add feature description`

**Body template**:

```markdown
## Summary

Brief description of changes and context.

## Changes

- ✅ Feature/change 1
- ✅ Feature/change 2
- ✅ Feature/change 3

## Test Plan

- [x] Test case 1
- [x] Test case 2
- [x] All configurations validated

Closes DEV-XX
```

## Before Writing Code

1. Analyze existing patterns in the codebase
2. Consider edge cases and error scenarios
3. Follow the rules below strictly
4. Validate accessibility requirements

## Important Instruction Reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.
