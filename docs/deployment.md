# Deployment Guide

## Overview

This guide covers the deployment process for the Golden Anniversary website using Vercel with the new tech stack (Neon + JWT + ImageKit).

## Prerequisites

- Vercel account
- Configured Neon database
- ImageKit account and configuration
- GitHub repository

## Vercel Deployment

### 1. Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `pnpm build:prod`
   - **Output Directory**: `.next` (default)

### 2. Environment Variables Configuration

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add required variables:

```bash
# JWT Authentication
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

### 3. Database Setup

After deployment, you may need to run database migrations:

```bash
# Push schema changes to Neon database
pnpm db:push

# View and manage database with Drizzle Studio
pnpm db:studio

# Generate migrations (if using migration files instead of push)
pnpm db:generate

# Seed database with sample data (optional)
pnpm db:seed
```

### 4. Build Configuration

```json
// vercel.json
{
  "buildCommand": "pnpm build:prod",
  "installCommand": "pnpm install --frozen-lockfile",
  "framework": "nextjs"
}
```

## Monitoring

### Vercel Analytics

1. Enable Vercel Analytics in project settings
2. View performance metrics in dashboard
3. Monitor Core Web Vitals

### PostHog Analytics & Error Monitoring

PostHog provides comprehensive analytics and error tracking:

**User Analytics:**
- Section views and user journey tracking
- Guestbook form interactions and abandonment
- Message submission success rates
- Footer link click tracking

**Error Monitoring:**
- All API, mutation, and query errors captured automatically
- Full error context with stack traces
- Error grouping by type and context
- URL tracking for error occurrence location

**Accessing PostHog:**
1. Log in to your [PostHog dashboard](https://app.posthog.com)
2. Navigate to your project
3. Use Insights to create custom dashboards
4. Set up alerts for critical errors

### Vercel Function Logs

1. Configure error reporting in Vercel
2. Monitor function logs for server-side issues
3. Set up alerts for critical errors

## Troubleshooting

### Common Issues

1. **Build Failures**

   - Check environment variables
   - Verify TypeScript errors
   - Check dependency versions

2. **Database Connection Issues**

   - Verify Neon DATABASE_URL
   - Check network connectivity and SSL settings
   - Verify Drizzle schema matches database
   - Run `drizzle-kit push` to sync schema

3. **Image Loading Issues**
   - Check ImageKit configuration and keys
   - Verify ImageKit URL endpoint
   - Check Next.js `remotePatterns` configuration
   - Verify ImageKit file IDs in database

## Rollback Strategy

1. **Vercel Rollback**: Use Vercel dashboard to rollback to previous deployment
2. **Database Rollback**: Use Drizzle migrations or Neon branch restore if needed
3. **Environment Variables**: Keep previous values as backup

## Maintenance

### Monitoring Checklist

- [ ] Vercel deployment status
- [ ] Neon database health and compute usage
- [ ] ImageKit bandwidth and storage usage
- [ ] PostHog error rates and user analytics
- [ ] Environment variables validity
- [ ] JWT authentication functionality
- [ ] Performance metrics and CDN delivery
- [ ] Error rates and function logs
