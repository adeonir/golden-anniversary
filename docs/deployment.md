# Deployment Guide

## Overview

This guide covers the deployment process for the Golden Anniversary website using Vercel.

## Prerequisites

- Vercel account
- Configured Supabase project
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
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Admin
ADMIN_EMAIL=your_admin_email@gmail.com
```

### 3. Build Configuration

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

### Error Tracking

1. Configure error reporting in Vercel
2. Monitor function logs
3. Set up alerts for critical errors

## Troubleshooting

### Common Issues

1. **Build Failures**

   - Check environment variables
   - Verify TypeScript errors
   - Check dependency versions

2. **Database Connection Issues**

   - Verify Supabase URL and keys
   - Check network connectivity
   - Verify table structure

3. **Image Loading Issues**
   - Check Supabase Storage configuration
   - Verify CORS settings
   - Check image URLs

## Rollback Strategy

1. **Vercel Rollback**: Use Vercel dashboard to rollback to previous deployment
2. **Database Rollback**: Use Supabase migrations if needed
3. **Environment Variables**: Keep previous values as backup

## Maintenance

### Monitoring Checklist

- [ ] Vercel deployment status
- [ ] Supabase database health
- [ ] Environment variables validity
- [ ] Performance metrics
- [ ] Error rates
- [ ] User analytics