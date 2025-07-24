# Deployment Guide

## Overview

This project is configured for automatic deployment to Vercel with optimized GitHub Actions workflows. The deployment system includes CI/CD pipelines for both pull requests and production deployments.

## Prerequisites

1. **Vercel Account**: Set up a Vercel account connected to your GitHub repository
2. **GitHub Secrets**: Configure the required secrets in your GitHub repository settings
3. **1Password CLI**: Local environment variables are managed through 1Password CLI

## Required GitHub Secrets

Configure these secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions`):

### Vercel Configuration

- `VERCEL_TOKEN`: Your Vercel API token (generate at https://vercel.com/account/tokens)
- `VERCEL_ORG_ID`: Your Vercel organization ID (found in `.vercel/project.json` after initial setup)
- `VERCEL_PROJECT_ID`: Your Vercel project ID (found in `.vercel/project.json` after initial setup)

### Application Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `DATABASE_PASSWORD`: Your database password
- `SUPABASE_PROJECT_ID`: Your Supabase project identifier (renamed from PROJECT_ID)
- `ADMIN_EMAIL`: Admin email address for the application

## Deployment Workflows

### CI Workflow (Pull Requests)

**File**: `.github/workflows/ci.yml`

- **Trigger**: Pull requests to any branch
- **Concurrency**: Cancels previous runs on new pushes
- **Jobs**:
  - **Lint & Type Check**: Runs `pnpm lint` and `pnpm type-check`
  - **Build**: Builds the application with `pnpm build:prod`

**Features**:

- Node.js cache optimization through `setup-node`
- Centralized version management (Node 22.17.0, pnpm 10.13.1)
- Next.js build cache for faster subsequent builds

### Deploy Workflow (Production)

**File**: `.github/workflows/deploy.yml`

- **Trigger**: Pushes to `main` branch or manual dispatch
- **Concurrency**: No cancellation to ensure deployments complete
- **Jobs**:
  - **Lint & Type Check**: Same validation as CI
  - **Deploy**: Uses `amondnet/vercel-action` for streamlined deployment

**Features**:

- Automatic production deployment on main branch
- Manual deployment trigger via GitHub UI
- Vercel environment variables automatically passed

## Manual Deployment Setup

### Initial Vercel Setup

```bash
# Install Vercel CLI
pnpm add -g vercel@latest

# Login to Vercel
vercel login

# Link project (run in project root)
vercel link --yes

# Deploy manually (first time)
vercel --prod
```

### Environment Variables Setup with 1Password CLI

```bash
# Add all environment variables to Vercel using 1Password CLI
op run --env-file=.env.local -- bash -c 'echo "$NEXT_PUBLIC_SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL production'
op run --env-file=.env.local -- bash -c 'echo "$NEXT_PUBLIC_SUPABASE_ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production'
op run --env-file=.env.local -- bash -c 'echo "$SUPABASE_SERVICE_ROLE_KEY" | vercel env add SUPABASE_SERVICE_ROLE_KEY production'
op run --env-file=.env.local -- bash -c 'echo "$DATABASE_PASSWORD" | vercel env add DATABASE_PASSWORD production'
op run --env-file=.env.local -- bash -c 'echo "$PROJECT_ID" | vercel env add SUPABASE_PROJECT_ID production'
op run --env-file=.env.local -- bash -c 'echo "$ADMIN_EMAIL" | vercel env add ADMIN_EMAIL production'
```

### GitHub Secrets Configuration

1. Add all required secrets listed above to GitHub repository settings
2. Get `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` from `.vercel/project.json`
3. Environment variables should be set to "All Environments" in Vercel dashboard

## Project Configuration

### Vercel Configuration (`vercel.json`)

```json
{
  "buildCommand": "pnpm build:prod",
  "installCommand": "pnpm install --frozen-lockfile",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "src/app/**/*.tsx": {
      "maxDuration": 30
    },
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 2 * * *"
    }
  ]
}
```

### Environment Variables Structure

Local development uses 1Password CLI references in `.env.local`:

```bash
# Supabase Configuration (using 1Password CLI)
NEXT_PUBLIC_SUPABASE_URL="op://Golden Anniversary/Variables/NEXT_PUBLIC_SUPABASE_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="op://Golden Anniversary/Variables/NEXT_PUBLIC_SUPABASE_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="op://Golden Anniversary/Variables/SUPABASE_SERVICE_ROLE_KEY"

# Database components
DATABASE_PASSWORD="op://Golden Anniversary/Variables/DATABASE_PASSWORD"
PROJECT_ID="op://Golden Anniversary/Variables/SUPABASE_PROJECT_ID"

# Admin configuration
ADMIN_EMAIL="op://Golden Anniversary/Variables/ADMIN_EMAIL"
```

## Custom Domain Configuration

1. **Add Domain in Vercel**:

   - Go to your project settings in Vercel dashboard
   - Navigate to "Domains" section
   - Add your custom domain

2. **DNS Configuration**:
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or A record pointing to Vercel's IP addresses

## Workflow Optimizations

### Performance Features

- **Concurrency Control**: Prevents redundant builds and manages deployment flow
- **Node.js Caching**: Built-in pnpm cache through `setup-node`
- **Next.js Build Cache**: Speeds up subsequent builds
- **Centralized Versioning**: All workflows use consistent Node.js and pnpm versions

### Security Features

- **Environment Variable Isolation**: All secrets managed through GitHub secrets
- **No Hardcoded Values**: All sensitive data through encrypted secrets
- **1Password Integration**: Local development secured with 1Password CLI

## Monitoring and Maintenance

### Build Optimization

- Build command: `pnpm build:prod`
- Build artifacts cached between deployments
- Function timeout set to 30 seconds
- Region: US East (iad1) for optimal performance

### Cron Jobs

- Cleanup cron job runs daily at 2 AM UTC
- Configured in `vercel.json`

## Troubleshooting

### Common Issues

1. **Build Failures**:

   - Check environment variables are properly set in Vercel dashboard
   - Verify all dependencies are in `package.json`
   - Review build logs in Vercel dashboard or GitHub Actions

2. **Runtime Errors**:

   - Check function logs in Vercel dashboard
   - Verify environment variables match expected format (email/URL validation)
   - Test locally with production build: `pnpm build:prod && pnpm start`

3. **Database Connection Issues**:

   - Verify `SUPABASE_PROJECT_ID` is correctly set (renamed from `PROJECT_ID`)
   - Check Row Level Security policies in Supabase
   - Validate database connection from Vercel edge

4. **GitHub Actions Failures**:
   - Ensure all required secrets are configured
   - Check workflow logs in GitHub Actions tab
   - Verify `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` match `.vercel/project.json`

### Debug Commands

```bash
# Test production build locally
pnpm build:prod
pnpm start

# Check environment variables in Vercel
vercel env ls

# View deployment logs
vercel logs [deployment-url]

# Redeploy current version
vercel --prod

# Check GitHub Actions logs
# Go to Actions tab in GitHub repository

# Test environment variables locally
op run --env-file=.env.local -- pnpm type-check
```

## Security Considerations

- Never commit environment variables to repository
- Use GitHub encrypted secrets for all sensitive data
- Supabase RLS policies protect database access
- Service role key limited to server-side operations only
- 1Password CLI secures local development environment
- All environment variables validated through `@t3-oss/env-nextjs`
