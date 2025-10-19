# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [October 2025] - Analytics & Documentation

### Added

- PostHog analytics integration for user behavior tracking and error monitoring
- Comprehensive testing infrastructure with Vitest and PGlite
- Open Graph image generation for social media sharing
- Batch actions for message moderation (approve/reject/delete multiple messages)

### Changed

- Admin panel responsive design improvements
- Component extraction for better code organization

### Fixed

- Site meta description for better SEO

## [October 2025] - Infrastructure Migration

### Changed

- Migrated from Supabase to Neon PostgreSQL + Drizzle ORM
- Replaced Supabase Auth with JWT-based authentication
- Migrated from Supabase Storage to ImageKit CDN

### Added

- Testing infrastructure with unit tests
- In-memory database testing with PGlite

## [September 2025] - Feature Complete

### Added

- Complete admin panel with message and photo moderation
- Photo gallery with drag-and-drop reordering
- Photo upload modal with validation
- Framer Motion animations across components
- Image blur placeholders for better UX
- URL-based admin navigation

### Changed

- Renamed Gallery to Memories with category support
- Reorganized components structure (layout/sections)

## [August 2025] - Core Features

### Added

- Interactive photo gallery with carousel
- Guestbook with message submission and moderation
- Family messages section
- Timeline with couple's milestones
- Countdown timer to celebration
- Footer with inspirational quote
- SEO metadata and optimization

## [July 2025] - Initial Development

### Added

- Project setup with Next.js 15 and React 19
- MVVM architecture implementation
- Golden anniversary design system
- Typography system (Inter, Playfair Display, Dancing Script)
- TanStack Query for data management
- Code quality tooling (Ultracite/BiomeJS)
- Deployment automation
