# Site Bodas de Ouro - Iria & Ari

Site comemorativo para celebrar 50 anos de casamento. Uma experiência digital que permite família e amigos deixarem mensagens carinhosas e navegarem pela galeria de fotos.

## Sobre o Projeto

Este projeto foi desenvolvido para celebrar uma data especial: 50 anos de casamento. O site oferece uma plataforma onde amigos e familiares podem compartilhar suas memórias e mensagens, criando um espaço digital de celebração e carinho.

## Funcionalidades

- **Livro de Visitas**: Sistema de mensagens com moderação
- **Galeria de Fotos**: Carousel interativo com upload para administradores
- **Timeline**: Linha do tempo com momentos especiais do casal
- **Design Responsivo**: Experiência otimizada para todos os dispositivos
- **Painel Administrativo**: Interface para gerenciamento de conteúdo

## Stack Tecnológica

- **Frontend**: Next.js 15, React 19, TypeScript
- **Estilização**: Tailwind CSS 4, Shadcn/ui
- **Banco de Dados**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **Gerenciamento de Estado**: TanStack Query 5
- **Formulários**: React Hook Form + Zod 4
- **Deploy**: Vercel

## Início Rápido

```bash
git clone https://github.com/adeonir/golden-anniversary.git
cd golden-anniversary
pnpm install
pnpm dev
```

## Estrutura do Projeto

```
src/
├── actions/         # Server Actions
├── app/             # Next.js App Router
├── components/      # Componentes React
├── hooks/           # Custom Hooks
├── lib/             # Utilitários & Config
└── types/           # Tipos TypeScript
```

## Documentação

- [PRD](docs/prd.md)
- [Design](docs/design.md)
- [Arquitetura](docs/architecture.md)
- [Desenvolvimento](docs/development.md)
- [Setup Storage](docs/storage-setup.md)
- [Deploy](docs/deployment.md)

## Licença

Projeto privado e proprietário.
