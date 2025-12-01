# Testing - Golden Anniversary

## Overview

- **Frameworks**: Vitest + React Testing Library + jsdom
- **Database testing**: PGlite (in-memory PostgreSQL)
- **Mocking**: External dependencies mocked
- **Type safety**: TypeScript strict mode

### Commands

```bash
pnpm test        # Run tests once
pnpm test:watch  # Run tests in watch mode
```

## Test Architecture

### Directory Structure

```
tests/
├── mocks/             # Mock implementations
│   ├── database.ts    # PGlite database mock
│   ├── imagekit.ts    # ImageKit SDK mock
│   └── next.ts        # Next.js functions mock
├── utils/             # Test utilities
│   └── database.ts    # DB helpers (init, cleanup, seed)
└── setup.spec.ts      # Setup validation tests
```

### Policies

- Tests are co-located in `src/**/*.spec.ts(x)`.
- `tests/` is reserved for mocks and utilities.
- Do not test UI hooks (state/UX).
- Cover server actions, authentication/middleware, TanStack Query wrappers, and images/blur.

## Mocking Strategy

### Environment Variables

- Globally mocked in `vitest.setup.ts`
- All required env vars stubbed for tests
- `SKIP_ENV_VALIDATION=true` for test environment

### External Services

- **ImageKit**: Full SDK mock with realistic responses
- **Next.js**: revalidatePath, cookies, headers mocked
- **Database**: Real PGlite instead of mocks for integration tests

### Server Actions Testing

- Direct import and testing (no HTTP layer)
- Real database operations via PGlite
- Mock external APIs (ImageKit, email)
- Test complete data flows

## Scope

- Server actions (messages/photos): success/error, consistency, and cache invalidation via `revalidatePath`.
- Authentication/JWT and middleware.
- Images (client/blur) and related integrations.
- TanStack Query wrappers (queries/mutations, invalidation, loading/error states).
- Exclusions: UI hooks.

## Conventions

- Reset the database between tests (PGlite in-memory).
- Use isolated environment variables for tests.
- Validate cache effects via `revalidatePath` when applicable.
- Polyfill `File.arrayBuffer` in jsdom when needed.
- Prefer domain assertions over implementation details.

## Architecture-Specific Testing Patterns

### Server Actions (No API Routes)

- Server actions access database directly via Drizzle ORM
- Test by importing and calling functions directly
- Use real database (PGlite) for integration tests
- Mock external services (ImageKit, email)

### JWT Authentication

- Stateless authentication with httpOnly cookies
- Mock Next.js cookies API for tests
- Test token creation, validation, expiration
- Test middleware authentication flow

### Image Workflows

- ImageKit SDK for uploads, CDN, optimizations
- Mock SDK with realistic responses
- Test upload/delete workflows
- Test error handling and cleanup

### React Query Integration

- Test hooks that use server actions
- Test cache invalidation patterns
- Test optimistic updates
- Test error states and loading states

## Best Practices Implemented

1. **Real Database**: PGlite for realistic database testing
2. **Co-location**: Tests near source code when possible
3. **Clean Setup**: Database reset between tests
4. **Type Safety**: Full TypeScript coverage
5. **Mock Organization**: Structured mocks in dedicated directory
6. **Helper Functions**: Reusable test utilities
7. **Environment Isolation**: Comprehensive env variable mocking
