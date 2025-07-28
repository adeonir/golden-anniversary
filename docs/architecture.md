# Guia de Arquitetura - Site Bodas de Ouro

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
- **Email**: Server Actions + Nodemailer
- **Scheduling**: Vercel Cron Jobs
- **Analytics**: TBD (PostHog/Vercel Analytics)

### Development & Deploy

- **Code Quality**: Ultracite (linting + formatting)
- **Package Manager**: pnpm
- **Version Control**: GitHub + Linear
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
├── hooks/               # React Hooks (ViewModel)
├── lib/                 # Utilitários e Configurações
│   ├── supabase/        # Configuração Supabase
│   └── utils.ts         # Funções utilitárias gerais
├── providers/           # Context Providers
├── env.ts               # Validação de variáveis de ambiente (T3 Env)
└── middleware.ts        # Middleware do Next.js
```

### Separação de Responsabilidades

**Actions (Model)**:

- Server Actions do Next.js
- Operações assíncronas server-side
- Integração com Supabase Client
- Validação de dados e redirecionamentos

**Database (Camada de Dados)**:

- Supabase PostgreSQL
- Schema consistente
- Queries via Supabase Client
- Acesso direto sem complexidade de RLS

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

### Tabelas

**Messages** - Mensagens do livro de visitas:

- `id` (UUID) - Identificador único
- `name` (TEXT) - Nome do autor
- `message` (TEXT) - Conteúdo da mensagem
- `status` (TEXT) - Status: 'pending', 'approved', 'rejected'
- `createdAt` (TIMESTAMPTZ) - Data de criação

**Photos** - Fotos da galeria:

- `id` (UUID) - Identificador único
- `filename` (TEXT) - Nome do arquivo no storage
- `title` (TEXT, nullable) - Título opcional da foto
- `url` (TEXT) - URL pública da imagem
- `size` (INTEGER) - Tamanho em bytes
- `order` (INTEGER) - Posição na galeria (para reordenação)
- `createdAt` (TIMESTAMPTZ) - Data de upload

### Storage

**Bucket `photos`** - Armazenamento de imagens:

- Configurado como público para acesso direto
- Estrutura: `gallery/{uuid}.{ext}`
- Políticas de acesso configuradas via SQL

### Scripts de Setup

Execute os scripts SQL no Supabase:

- `docs/setup-database.sql` - Criação das tabelas (messages e photos)
- `docs/setup-storage.sql` - Configuração do bucket de fotos
- `docs/seed-messages.sql` - Dados de exemplo (opcional)

## Environment Variables

Veja `docs/deployment.md` para configuração completa das variáveis de ambiente.
