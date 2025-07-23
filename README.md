# Site Bodas de Ouro

Site comemorativo para celebrar 50 anos de casamento de Iria & Ari. Uma experiência digital elegante que permite família e amigos deixarem mensagens carinhosas, navegarem pela galeria de fotos e acompanharem a jornada do casal.

## Funcionalidades

### Para Visitantes

- **Hero Section**: Apresentação elegante com tema dourado
- **Countdown Timer**: Contador regressivo até a festa (08/11/2025)
- **Galeria Interativa**: Carousel de fotos ao longo dos anos
- **Timeline do Casal**: Marcos importantes da jornada juntos
- **Mensagens da Família**: Seção especial para filhos e netos
- **Livro de Visitas**: Sistema para enviar mensagens carinhosas
- **Mensagens Aprovadas**: Leitura das mensagens de outros visitantes

### Para Admin

- **Painel de Moderação**: Interface para aprovar/rejeitar mensagens
- **Notificações por Email**: Digest diário de mensagens pendentes (20h)
- **Estatísticas**: Métricas básicas de engajamento

## Stack Tecnológica

### Frontend

- **Next.js 14** (App Router) + React 18 + TypeScript
- **Tailwind CSS** + **Shadcn/ui** para design system
- **Framer Motion** para animações elegantes
- **TanStack Query** para gerenciamento de estado
- **React Hook Form** + **Zod** para formulários
- **Embla Carousel** para galeria de fotos

### Backend & Services

- **Supabase** (PostgreSQL, Auth, Storage)
- **Nodemailer** + Gmail para envio de emails
- **Vercel Cron Jobs** para automação

### DevOps & Monitoring

- **Vercel** para deploy e hospedagem
- **PostHog** para analytics e insights
- **Ultracite** (BiomeJS) para linting e formatação

## Arquitetura

O projeto segue uma arquitetura **MVVM** (Model-View-ViewModel):

```
src/
├── actions/          # Model - Operações Supabase
├── app/              # Next.js App Router
├── components/       # View - Componentes UI
├── hooks/            # ViewModel - Lógica de negócio
└── lib/              # Utilitários e configurações
```

### Separação de Responsabilidades

- **Actions**: CRUD operations, queries Supabase, validação de dados
- **Hooks**: TanStack Query, business logic, side effects
- **Components**: UI rendering, interações do usuário

## Desenvolvimento

### Requisitos

- Node.js 20+
- pnpm (recomendado)

### Setup Local

```bash
# Clone o repositório
git clone <repo-url>
cd golden-anniversary

# Instale dependências
pnpm install

# Configure variáveis de ambiente
cp .env.example .env.local
# Preencha as variáveis do Supabase, Gmail, etc.

# Execute o servidor de desenvolvimento
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### Scripts Disponíveis

```bash
pnpm dev          # Servidor de desenvolvimento (com Turbopack)
pnpm build        # Build para produção
pnpm start        # Servidor de produção
pnpm lint         # Linting e formatação com Ultracite
pnpm type-check   # Verificação de tipos TypeScript
```

## Analytics & Monitoring

Implementação com **PostHog** para tracking de:

- **Conversion Funnel**: Visita → Engajamento → Mensagem
- **User Journey**: Scroll depth, tempo por seção, navegação
- **Performance**: Core Web Vitals, loading times
- **Admin Metrics**: Taxa de aprovação, tempo de moderação

## Deploy

O projeto está configurado para deploy automático na **Vercel**:

1. **Staging**: Deploy automático de PRs
2. **Production**: Deploy automático da branch `main`
3. **Cron Jobs**: Configurados para digest de emails

### Variáveis de Ambiente

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_PASSWORD=your_database_password
PROJECT_ID=your_project_id

# Authentication
ADMIN_EMAIL=admin@exemplo.com
```

Para setup detalhado das configurações, consulte a [documentação técnica](docs/).

## Documentação

Documentação técnica completa disponível em [`docs/`](docs/):

- **[PRD](docs/prd.md)** - Product Requirements Document
- **[Design System](docs/design.md)** - Guia de design, cores e componentes
- **[Arquitetura](docs/architecture.md)** - Estrutura do projeto e separação de responsabilidades
- **[Setup RLS](docs/rls-setup.md)** - Configuração de Row Level Security no Supabase
- **[Setup Storage](docs/storage-setup.md)** - Configuração do bucket de fotos

## Roadmap

O projeto está sendo desenvolvido em fases, com todas as funcionalidades planejadas e organizadas.

- [x] Setup do projeto (DEV-15)
- [ ] Configuração Supabase (DEV-16)
- [ ] TanStack Query + Componentes Base (DEV-17)
- [ ] Hero Section (DEV-18)
- [ ] Galeria Estática (DEV-19)
- [ ] Formulário GuestBook (DEV-20)
- [ ] Sistema de Email (DEV-22)
- [ ] Painel de Moderação (DEV-27)
- [ ] Deploy Final (DEV-31)

## Contribuição

Este é um projeto pessoal para celebração familiar. Desenvolvido com muito carinho para Iria & Ari!
