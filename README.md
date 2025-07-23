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

- **Next.js** (App Router) + React + TypeScript
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
├── app/              # View - Páginas
├── components/       # View - Componentes UI
├── database/         # Model - Dados
├── hooks/            # ViewModel - Lógica de negócio e dados
└── lib/              # Utilitários e configurações
```

### Separação de Responsabilidades

- **Actions**: CRUD operations, queries Supabase, validação de dados
- **Components**: UI rendering, interações do usuário
- **Database**: Supabase, Row Level Security, Storage
- **Hooks**: TanStack Query, business logic, side effects
- **Lib**: Utilitários e configurações

## Desenvolvimento

### Requisitos

- Node.js 22+
- pnpm 10+

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

## Documentação

Documentação técnica completa disponível em [`docs/`](docs/):

- **[PRD](docs/prd.md)** - Product Requirements Document
- **[Design System](docs/design.md)** - Guia de design, cores e componentes
- **[Arquitetura](docs/architecture.md)** - Estrutura do projeto e separação de responsabilidades
- **[Setup RLS](docs/rls-setup.md)** - Configuração de Row Level Security no Supabase
- **[Setup Storage](docs/storage-setup.md)** - Configuração do bucket de fotos

## Roadmap

O projeto está sendo desenvolvido em fases, com todas as funcionalidades planejadas e organizadas no Linear.

### Setup

- [x] Setup do projeto (DEV-15)
- [x] Configuração Supabase (DEV-16)
- [-] TanStack Query (DEV-17) - _In Progress_

### Visitantes

- [ ] Hero Banner (DEV-6)
- [ ] Countdown da festa (DEV-7)
- [ ] Navegar na galeria (DEV-8)
- [ ] Deixar mensagem no guestbook (DEV-9)
- [ ] Ler mensagens aprovadas (DEV-10)
- [ ] Mensagens da família (DEV-11)
- [ ] Timeline do casal (DEV-12)

### Admin

- [ ] Moderar mensagens (DEV-13)
- [ ] Receber notificações (DEV-14)
- [ ] Gerenciar galeria de fotos (DEV-32)

### Otimizações

- [ ] Framer Motion & Animações (DEV-28)
- [ ] Otimização de Imagens (DEV-29)
- [ ] PostHog Analytics (DEV-30)
- [ ] Deploy Final (DEV-31)

## Contribuição

Este é um projeto pessoal para celebração familiar. Desenvolvido com muito carinho para Iria & Ari!
