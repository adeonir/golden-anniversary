# Design & Conventions - Golden Anniversary

## Design System

### Golden Colors (OKLCH)

**Complete palette**: gold-50 to gold-900 using OKLCH for better color consistency.

```css
:root {
  --gold-50: oklch(98% 0.02 85); /* Very subtle backgrounds */
  --gold-100: oklch(95% 0.04 85); /* Secondary cards */
  --gold-200: oklch(88% 0.08 85); /* Hover borders */
  --gold-300: oklch(82% 0.12 85); /* Default borders */
  --gold-400: oklch(75% 0.15 85); /* Muted text */
  --gold-500: oklch(68% 0.18 85); /* Primary accent */
  --gold-600: oklch(60% 0.15 85); /* Primary hover */
  --gold-700: oklch(52% 0.12 85); /* Primary (--primary) */
  --gold-800: oklch(44% 0.09 85); /* Dark text */
  --gold-900: oklch(36% 0.06 85); /* Darkest text */
}
```

**Validated combinations** (contrast ≥ 4.5:1):

- ✅ gold-600 + white (4.8:1)
- ✅ gold-700 + white (6.2:1)
- ✅ gold-800 + gold-50 (4.6:1)
- ⚠️ gold-400 + white (3.8:1) - Avoid

### Typography

**Font families** (next/font/google):

```tsx
// Inter - Long texts, UI elements, general legibility
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

// Playfair Display - Section titles, elegant text
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

// Dancing Script - Couple names, special details
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-script",
});
```

**Usage in code**:

```tsx
<h1 className="font-script text-gold-500">Iria & Ari</h1>      // Special names
<h2 className="font-heading text-gold-700">Golden Anniversary</h2>   // Main titles
<p className="font-body text-muted-foreground">Body text</p>   // General content
```

### Responsiveness & Accessibility

**Breakpoints** (mobile-first):

- Mobile: 375px+ (base)
- Tablet: 768px+ (md:)
- Desktop: 1024px+ (lg:)

**Mandatory accessibility**:

- Touch targets: Minimum 44px (`min-h-11` in Tailwind)
- Focus visible: `ring-2 ring-ring` always present
- Contrast: Always ≥ 4.5:1 ratio
- Keyboard navigation: Logical tab order
- Text scaling: Functional up to 200% zoom

## Micro-interactions & Animations

### Component States

**Buttons**:

```tsx
// Default → Hover → Active → Disabled
bg-primary → bg-primary/90 + scale-105 → bg-primary/80 → bg-muted
```

**Cards**:

```tsx
// Default → Hover → Focus
border-border → border-gold-200 + shadow-lg → ring-2 ring-ring
```

**Images**:

```tsx
// Loading → Default → Hover → Error
skeleton gold-100 → normal → scale-105 + brightness-110 → bg-muted + icon
```

### Framer Motion Patterns

**Scroll animations**: Timeline appears gradually using `useInView`

**Hover effects**: Lift + shadow on cards with `whileHover={{ y: -4, scale: 1.02 }}`

**Loading states**: Pulse animation on skeleton loaders

**Success feedback**: Checkmark animation for confirmations

## Shadcn/ui Components

### Base components used

- **Button**: primary, secondary, outline, ghost variants
- **Card**: with CardHeader, CardContent, CardFooter
- **Input**: text, email fields with validation
- **Textarea**: guestbook messages
- **Badge**: status indicators (pending, approved, rejected)
- **Dialog**: confirmation and upload modals
- **Tabs**: admin panel navigation

### Custom components created

- **TimeCard**: countdown timer with animation
- **PhotoCarousel**: gallery with Embla + thumbnails
- **MessageCard**: guestbook message display
- **TimelineItem**: couple's milestones with special design

**Always define states**: default, hover, active, disabled, loading

## Git & Commit Conventions

### Conventional Commits Format

```bash
type(scope): description

# Main types:
feat: new functionality
fix: bug fix
docs: documentation
chore: maintenance, deps, config
```

**Examples**:

```bash
feat: implement photo carousel with lazy loading
fix: resolve countdown timer timezone issues
docs: update deployment instructions
chore: upgrade dependencies to latest versions
```

### Pull Request Format

**Title**: `type(scope): concise description`

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

## Critical Code Rules

### Next.js Specific

- ❌ NEVER use `<img>` - always `<Image>` from Next.js
- ❌ NEVER use `<head>` - use App Router metadata API
- ✅ Always implement blur placeholders for images
- ✅ Use loading.tsx and error.tsx for special states

### TypeScript & Code Quality

- ✅ Strict mode always enabled
- ✅ Validate props with Zod schemas
- ✅ Prefer `const` over `let`, never `var`
- ✅ Use arrow functions for consistency
- ❌ NEVER use `any` type - always type correctly
- ✅ Organize imports: external → internal → relative

### React & Performance

- ✅ Lazy loading for heavy components (`lazy()` + `Suspense`)
- ✅ Memoization when appropriate (`memo`, `useMemo`, `useCallback`)
- ✅ Unique keys in lists (never use array index)
- ❌ NEVER define components inside other components
- ✅ Extract custom hooks for reusable logic

### Accessibility (a11y)

- ✅ Always include meaningful `alt` text for images
- ✅ Associate labels with inputs (`htmlFor` + `id`)
- ✅ Use appropriate semantic roles (`button`, `main`, `nav`)
- ✅ `tabIndex` only when necessary (never positive)
- ❌ NEVER use `accessKey` attribute
- ✅ `aria-*` attributes when ARIA is needed

### Security & Environment

- ✅ JWT authentication with bcrypt password hashing
- ✅ Environment variables validated with `@t3-oss/env-nextjs`
- ❌ NEVER expose secrets on client-side
- ✅ Input sanitization before database saves
- ✅ CSRF protection via Next.js (automatic)

## Quality Validation

### Pre-commit Checklist

- ✅ `pnpm lint` passes without errors
- ✅ `pnpm type-check` passes without errors
- ✅ Component tested on real mobile device
- ✅ Contrast validated (≥ 4.5:1)
- ✅ Keyboard navigation functional
- ✅ Loading states implemented

### Recommended Tools

- **Accessibility**: WAVE, axe DevTools
- **Color contrast**: Figma + browser DevTools
- **Performance**: Lighthouse, Vercel Speed Insights
- **Mobile**: BrowserStack or physical device

### Code Review Standards

- ✅ Follow all CLAUDE.md rules
- ✅ Consistent design system (colors, typography, spacing)
- ✅ Error and loading states handled
- ✅ Responsive design validated
- ✅ Performance implications considered
