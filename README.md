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
8. **Admin Panel** - Moderation via JWT authentication

## Tech Stack

- **Framework**: Next.js (App Router) + React + TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Auth**: JWT + bcrypt (stateless, httpOnly cookies)
- **Storage**: ImageKit CDN (with automatic optimizations)
- **Analytics**: PostHog
- **Email**: Nodemailer + Vercel Cron Jobs
- **Deployment**: Vercel
- **Testing**: Vitest + React Testing Library + PGlite
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
- `pnpm check` - TypeScript type checking

## MVVM Architecture

```
src/
├── actions/         # Data layer and business logic (Model)
├── hooks/           # State management and presentation logic (ViewModel)
├── components/      # User interface components (View)
│   ├── app/         # Application-specific sections
│   └── ui/          # Reusable UI components
├── lib/             # Utilities and configurations
├── providers/       # Context Providers
└── types/           # TypeScript definitions
```

## Documentation

For detailed setup instructions, start with the [Development Guide](docs/development.md).

### Docs

- **[Development](docs/development.md)** - Complete environment setup, database configuration, security, and troubleshooting
- **[Deployment](docs/deployment.md)** - Vercel deployment process, environment variables, and monitoring
- **[Changelog](docs/changelog.md)** - Project history and notable changes

## Design System

### Colors

- **Golden palette**: 11 shades from gold-50 (lightest) to gold-950 (darkest) using OKLCH color space
- **Neutral palette**: Zinc scale for backgrounds and secondary elements
- All color combinations maintain WCAG 2.1 AA contrast ratio (≥ 4.5:1)

### Typography

- **Body text**: Inter - clean, readable sans-serif
- **Headings**: Playfair Display - elegant serif for titles
- **Special text**: Dancing Script - handwritten style for emotional touches

### Accessibility

- Mobile-first responsive design
- WCAG 2.1 Level AA compliance
- Semantic HTML structure
- Screen reader optimized
- Reduced motion support for animations

## License

Private and proprietary project.
