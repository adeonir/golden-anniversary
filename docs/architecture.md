# Architecture Guide - Site Bodas de Ouro

## Stack Tecnológica

### Frontend

- **Framework**: Next.js (App Router) + React + TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **Animation**: Framer Motion
- **Forms**: React Hook Form + Zod
- **State Management**: TanStack Query
- **Carousel**: Embla Carousel

### Backend & Services

- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (fotos da galeria)
- **Email**: Next.js API Routes + Nodemailer
- **Scheduling**: Vercel Cron Jobs
- **Analytics**: TBD (PostHog/Vercel Analytics)

### Development & Deploy

- **Code Quality**: Ultracite (BiomeJS + linting + formatting)
- **Package Manager**: pnpm
- **Version Control**: GitHub + Linear integration
- **Deployment**: Vercel
- **Monitoring**: Vercel Analytics / PostHog (TBD)
- **Design**: Figma

## Arquitetura MVVM

### Estrutura de Pastas

```
src/
├── actions/             # Server Actions (Model)
├── app/                 # Next.js App Router (Rotas)
│   ├── admin/           # Painel administrativo
│   ├── login/           # Autenticação
│   ├── layout.tsx       # Layout raiz da aplicação
│   └── page.tsx         # Homepage/landing page
├── components/          # Componentes React (View)
│   ├── app/             # Componentes específicos da aplicação
│   └── ui/              # Componentes reutilizáveis (Shadcn/ui)
├── database/            # Camada de Dados
├── hooks/               # React Hooks (ViewModel)
├── lib/                 # Utilitários e Configurações
│   ├── supabase/        # Configuração Supabase
│   └── utils.ts         # Funções utilitárias gerais
├── env.ts               # Validação de variáveis de ambiente (T3 Env)
└── middleware.ts        # Middleware do Next.js
```

### Separação de Responsabilidades

**Actions (Model)**:

- Server Actions do Next.js
- Operações assíncronas server-side
- Integração com Supabase Auth
- Validação de dados e redirecionamentos

**Database (Camada de Dados)**:

- Schema do banco de dados (Drizzle)
- Migrações e estrutura
- Políticas de segurança (RLS)
- Conexões e queries

**Hooks (ViewModel)**:

- Estado da aplicação
- Side effects e integração com APIs
- Lógica de apresentação
- Gerenciamento de sessão

**Components (View)**:

- Interface do usuário
- Renderização e interações
- Componentes específicos da aplicação
- Design system reutilizável

## Database Schema

### Supabase Tables

```sql
-- Mensagens do livro de visitas
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  message text NOT NULL CHECK (length(message) <= 500),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Fotos da galeria (metadados)
CREATE TABLE gallery_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  alt_text text,
  caption text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Configurações do admin
CREATE TABLE admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb,
  updated_at timestamptz DEFAULT now()
);
```

### Row Level Security (RLS)

```sql
-- Habilitar RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Policies para messages
CREATE POLICY "Public can read approved messages" ON messages
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Anyone can insert messages" ON messages
  FOR INSERT WITH CHECK (status = 'pending');

CREATE POLICY "Admin can manage all messages" ON messages
  FOR ALL USING (auth.jwt() ->> 'email' = 'admin@exemplo.com');

-- Policies para gallery_photos
CREATE POLICY "Public can read photos" ON gallery_photos
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage photos" ON gallery_photos
  FOR ALL USING (auth.jwt() ->> 'email' = 'admin@exemplo.com');
```

## Sistema de Email

### Configuração Nodemailer

```typescript
// lib/email.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendDigestEmail = async (messages: Message[]) => {
  const html = generateDigestTemplate(messages);

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `[BODAS] ${messages.length} mensagens pendentes`,
    html,
  });
};
```

### Cron Job Implementation

```typescript
// app/api/cron/email-digest/route.ts
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];
  const { data: pendingMessages } = await supabase
    .from("messages")
    .select("*")
    .eq("status", "pending")
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`);

  if (pendingMessages?.length > 0) {
    await sendDigestEmail(pendingMessages);
  }

  return Response.json({
    success: true,
    count: pendingMessages?.length || 0,
  });
}
```

### Vercel Cron Configuration

```json
{
  "crons": [
    {
      "path": "/api/cron/email-digest",
      "schedule": "0 20 * * *"
    }
  ]
}
```

## Otimização de Imagens

### Next.js Image Component

Using Next.js built-in image optimization for the photo carousel:

```typescript
// lib/image-utils.ts
export const getBlurDataUrl = (imageUrl: string) => {
  return `/_next/image?url=${encodeURIComponent(imageUrl)}&w=16&q=10`;
};
```

```typescript
// components/app/gallery/gallery-image.tsx
import Image from "next/image";
import { cn } from "~/lib/utils";
import { getBlurDataUrl } from "~/lib/image-utils";

interface GalleryImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export function GalleryImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
}: GalleryImageProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        placeholder="blur"
        blurDataURL={getBlurDataUrl(src)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
}
```

### Carousel Implementation

```typescript
// components/app/gallery/photo-carousel.tsx
import { GalleryImage } from "./gallery-image";

interface Photo {
  id: string;
  filename: string;
  alt_text?: string;
  display_order: number;
}

export function PhotoCarousel({ photos }: { photos: Photo[] }) {
  return (
    <div className="space-y-4">
      <div className="aspect-video max-w-4xl mx-auto">
        <GalleryImage
          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${photos[0]?.filename}`}
          alt={photos[0]?.alt_text || "Foto da galeria"}
          width={800}
          height={600}
          priority
          className="w-full h-full"
        />
      </div>

      <div className="flex gap-2 justify-center overflow-x-auto pb-2">
        {photos.map((photo, index) => (
          <GalleryImage
            key={photo.id}
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${photo.filename}`}
            alt={photo.alt_text || "Foto da galeria"}
            width={150}
            height={100}
            className="flex-shrink-0 cursor-pointer"
          />
        ))}
      </div>
    </div>
  );
}
```

## Autenticação & Segurança

### Supabase Auth Setup

```typescript
// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isAdmin = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.email === process.env.ADMIN_EMAIL;
};
```

### Route Protection

```typescript
// components/AdminRoute.tsx
export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const authorized = await isAdmin();
    setIsAuthorized(authorized);
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!isAuthorized) return <LoginForm />;

  return <>{children}</>;
};
```

## Analytics & Monitoring

### PostHog Setup

```typescript
// lib/analytics.ts
import posthog from "posthog-js";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });
}

export const trackEvent = (event: string, properties?: any) => {
  if (typeof window !== "undefined") {
    posthog.capture(event, properties);
  }
};

export const trackMessageSubmit = (messageLength: number) => {
  trackEvent("message_submitted", { message_length: messageLength });
};

export const trackGalleryView = (photoId: string) => {
  trackEvent("gallery_photo_viewed", { photo_id: photoId });
};
```

## Environment Variables

**Installation**:

```bash
pnpm add @t3-oss/env-nextjs zod
```

**Setup** (`env/index.ts`):

```javascript
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Supabase
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

    // Email
    ADMIN_EMAIL: z.string().email(),
    SMTP_USER: z.string().email(),
    SMTP_PASS: z.string().min(1),

    // Cron
    CRON_SECRET: z.string().min(16),

    // Analytics (optional)
    POSTHOG_KEY: z.string().optional(),
  },

  client: {
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),

    // Analytics (optional)
    NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
  },

  runtimeEnv: {
    // Server
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    CRON_SECRET: process.env.CRON_SECRET,
    POSTHOG_KEY: process.env.POSTHOG_KEY,

    // Client
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },
});
```

**Usage**:

```typescript
// lib/supabase.ts
import { env } from "~/env";

export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
```

**.env.local**:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email Configuration
ADMIN_EMAIL=seu-email+bodas@gmail.com
SMTP_USER=seu-email+bodas@gmail.com
SMTP_PASS=your_app_password

# Cron
CRON_SECRET=your_random_secret

# Analytics (optional)
POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## Performance Considerations

### TanStack Query Configuration

**Installation**:

```bash
pnpm add @tanstack/react-query
pnpm add -D @tanstack/react-query-devtools
```

**Provider Setup** (`src/providers/query-client.tsx`):

```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useRef } from 'react'

interface QueryProviderProps {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          refetchOnMount: false,
          retry: 3,
          retryDelay: 1000, // 1 second
          staleTime: 5 * 60 * 1000, // 5 minutes
        },
      },
    }),
  ).current

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
```

### Data Layer Architecture

**Types** (`src/types/[entity].ts`):
```typescript
// Centralized interfaces for data shapes
export interface CreateEntityData { ... }
export interface Entity { id, ...fields, createdAt }
```

**Server Actions** (`src/actions/[entity].ts`):
```typescript
'use server'
// Database operations with error handling
export async function getEntities(): Promise<Entity[]> {
  try { return db.select()... } 
  catch { throw new Error(...) }
}
export async function createEntity(data): Promise<Entity> {
  // Insert + revalidatePath + error handling
}
```

**Hooks** (`src/hooks/use-[entity].ts`):
```typescript
// Query key factories for type-safe cache management
const entityKeys = {
  all: ['entity'] as const,
  lists: () => [...entityKeys.all, 'list'] as const,
  detail: (id) => [...entityKeys.details(), id] as const,
}

// Clean hooks using server actions
export function useEntities() {
  return useQuery({ queryKey: entityKeys.lists(), queryFn: getEntities })
}
export function useCreateEntity() {
  return useMutation({ 
    mutationFn: createEntity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: entityKeys.all })
  })
}
```

### Architecture Benefits

- **Centralized Types**: Shared across actions, hooks, and components
- **Server Actions**: Handle error handling and data validation
- **Clean Hooks**: No direct DB calls, focus on cache management
- **Query Key Factories**: Type-safe cache invalidation strategies
- **MVVM Pattern**: Clear separation between Model (actions), ViewModel (hooks), View (components)

### Next.js Optimizations

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "your-supabase-project.supabase.co",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["@supabase/supabase-js"],
  },
};

module.exports = nextConfig;
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint & Format
        run: pnpm lint

      - name: Type check
        run: pnpm type-check

      - name: Build
        run: pnpm build

  deploy:
    needs: setup
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Development Workflow

### Branch Naming Convention

```bash
# Formato: feature/LIN-{issue-number}-{description}
git checkout -b feature/LIN-123-hero-section
```

### Commit Convention

```bash
git commit -m "LIN-123: Implementa hero section

- Adiciona componente Header
- Configura tema dourado
- Implementa responsividade

Fixes: LIN-123"
```

### Code Quality Setup

**Installation**:

```bash
pnpm add -D ultracite
```

**Configuration** (`biome.jsonc`):

```jsonc
{
  "$schema": "https://biomejs.dev/schemas/2.1.2/schema.json",
  "extends": ["ultracite"],
  "linter": {
    "rules": {
      "nursery": {
        "noUnknownAtRule": "off",
        "useSortedClasses": {
          "fix": "safe",
          "level": "warn",
          "options": {
            "attributes": ["className"],
            "functions": ["cn", "clsx", "cva"]
          }
        }
      },
      "performance": {
        "noNamespaceImport": "off"
      }
    }
  },
  "css": {
    "linter": {
      "enabled": false
    }
  },
  "javascript": {
    "formatter": {
      "indentStyle": "space",
      "indentWidth": 2,
      "quoteStyle": "single",
      "jsxQuoteStyle": "double",
      "trailingCommas": "all",
      "semicolons": "asNeeded",
      "lineWidth": 120,
      "arrowParentheses": "always"
    }
  }
}
```

**Package.json Scripts**:

```json
{
  "scripts": {
    "lint": "ultracite format",
    "type-check": "tsc --noEmit"
  }
}
```

## Vercel Deployment Configuration

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/email-digest",
      "schedule": "0 20 * * *"
    }
  ]
}
```
