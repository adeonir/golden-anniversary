# Golden Anniversary

A commemorative website celebrating Iria & Ari's 50th wedding anniversary.
**Celebration date**: November 8, 2025, 6:30 PM

A digital experience that allows family and friends to leave heartfelt messages and browse through the couple's special photo gallery.

## About the Project

This project was developed to celebrate a special milestone: 50 years of marriage. The website provides a platform where friends and family can share their memories and messages, creating a digital space of celebration and affection for this remarkable couple.

## Key Features

1. **Header/Hero** - Elegant couple presentation
2. **Countdown** - Timer to the celebration
3. **Photo Gallery** - Carousel + thumbnails with lazy loading
4. **Guestbook** - Messages with mandatory moderation
5. **Family Messages** - Special section for children and grandchildren
6. **Timeline** - Important milestones in the couple's life
7. **Footer** - Inspirational quote and credits
8. **Admin Panel** - Moderation via Supabase Auth

## Tech Stack

- **Framework**: Next.js (App Router) + React + TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **Database**: Supabase PostgreSQL + Auth + Storage
- **Email**: Nodemailer + Vercel Cron Jobs
- **Deployment**: Vercel
- **Code Quality**: Ultracite (BiomeJS)

## Quick Start

```bash
git clone https://github.com/adeonir/golden-anniversary.git
cd golden-anniversary
pnpm install
cp .env.example .env.local  # Configure your environment variables
pnpm dev
```

### Main Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Format and lint code
- `pnpm type-check` - TypeScript type checking

## MVVM Architecture

```
src/
├── actions/         # Model - Data layer and business logic
├── hooks/           # ViewModel - State management and presentation logic
├── components/      # View - User interface components
│   ├── app/         # Application-specific sections
│   └── ui/          # Reusable UI components
├── lib/             # Utilities and configurations
├── providers/       # Context Providers
└── types/           # TypeScript definitions
```

## Documentation

### Operational Guides

- [Development](docs/development.md) - Environment setup, security, troubleshooting
- [Deployment](docs/deployment.md) - Vercel deployment, monitoring
- [Database Setup](docs/setup-database.sql) - SQL scripts for tables
- [Storage Setup](docs/setup-storage.sql) - Supabase Storage configuration
- [Sample Data](docs/seed-messages.sql) - Seed data for development

### Design System & Conventions

- Golden color system (gold-50 to gold-950) using OKLCH
- Typography: Inter (body), Playfair Display (headings), Dancing Script (special text)
- Always maintain contrast ratio ≥ 4.5:1, mobile-first, WCAG 2.1 accessibility
- Git: Conventional Commits, structured PR templates

## Project Context

This is a personal project developed to honor my parents' 50th wedding anniversary, while also serving as a portfolio piece showcasing modern web development practices. The application combines emotional significance with technical excellence, demonstrating skills in:

- **Full-stack development** with Next.js and Supabase
- **User experience design** with accessibility-first approach
- **Content management** with role-based authentication
- **Email automation** with scheduled notifications
- **Performance optimization** with lazy loading and image optimization
- **Code quality** with TypeScript, linting, and architectural patterns

## License

Private and proprietary project.
