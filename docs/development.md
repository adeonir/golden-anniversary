# Guia de Desenvolvimento

## Visão Geral

Este guia cobre a configuração do ambiente de desenvolvimento para o site Bodas de Ouro.

## Pré-requisitos

- Node.js 22+
- pnpm
- Conta Supabase
- Editor de código (Cursor recomendado)

## Configuração Inicial

### 1. Clone e Instalação

```bash
git clone https://github.com/adeonir/golden-anniversary.git
cd golden-anniversary
pnpm install
```

### 2. Variáveis de Ambiente

#### Opção 1: Arquivo .env.local

Crie o arquivo `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Admin
ADMIN_EMAIL=your_admin_email@gmail.com
```

#### Opção 2: 1Password CLI (Recomendado)

```bash
# Instalar 1Password CLI
brew install 1password-cli

# Autenticar
op signin

# Executar com variáveis do 1Password
op run --env-file=.env.local -- pnpm dev
```

### 3. Configuração do Banco

Execute no SQL Editor do Supabase:

- `docs/create-tables.sql` - Criação das tabelas
- `docs/seed-messages.sql` - Dados de exemplo (opcional)

## Scripts de Desenvolvimento

```bash
# Desenvolvimento
pnpm dev          # Inicia servidor de desenvolvimento
pnpm build        # Build para desenvolvimento
pnpm build:prod   # Build para produção
pnpm start        # Inicia servidor de produção

# Qualidade de Código
pnpm lint         # Formata e faz lint do código
pnpm type-check   # Executa verificações TypeScript
```

## Estrutura do Projeto

```
src/
├── actions/         # Server Actions
├── app/            # Next.js App Router
├── components/     # Componentes React
├── hooks/          # React Hooks
├── lib/            # Utilitários & Config
├── providers/      # Context Providers
├── types/          # Tipos TypeScript
└── env.ts          # Validação de variáveis
```

## Ferramentas de Desenvolvimento

### Code Quality

- **Ultracite**: Linting e formatação automática
- **TypeScript**: Verificação de tipos rigorosa
- **Git Hooks**: Lefthook para verificações pre-commit

### Extensões VS Code Recomendadas

- TypeScript Importer
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter

## Workflow de Desenvolvimento

### 1. Nova Feature

**Commit Message**: `feat: descrição da feature`
**PR Title**: `feat(DEV-XX): descrição da feature com verbo imperativo`

```bash
# Criar branch com ticket do Linear
git checkout -b feat/DEV-XX-nome-da-feature

# Desenvolver...
pnpm lint
pnpm type-check
git add .
git commit -m "feat: descrição da feature"
git push origin feat/DEV-XX-nome-da-feature
```

### 2. Debugging

```bash
# Desenvolvimento com logs
pnpm dev

# Verificar tipos
pnpm type-check

# Build local
pnpm build
```

### 3. Testes

- **Testes Manuais**: Navegar pela aplicação
- **Verificação de Tipos**: `pnpm type-check`
- **Linting**: `pnpm lint`

## Configuração do Supabase

### 1. Projeto Local

1. Crie um projeto no [Supabase](https://supabase.com)
2. Configure as variáveis de ambiente
3. Execute os scripts SQL

### 2. Storage

1. Crie o bucket `photos`
2. Configure como público
3. Teste upload de imagens

### 3. Autenticação

1. Habilite autenticação por email
2. Configure templates de email
3. Teste login admin

## Troubleshooting

### Problemas Comuns

1. **Erro de Variáveis de Ambiente**

   - Verifique `.env.local`
   - Reinicie o servidor de desenvolvimento

2. **Erro de Tipos TypeScript**

   - Execute `pnpm type-check`
   - Verifique imports e tipos

3. **Erro de Conexão Supabase**
   - Verifique URL e chaves
   - Teste no SQL Editor

### Comandos Úteis

```bash
# Limpar cache
rm -rf .next
pnpm dev

# Reinstalar dependências
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Verificar versões
node --version
pnpm --version
```

## Boas Práticas

### Código

- Use TypeScript rigorosamente
- Siga convenções de nomenclatura
- Mantenha componentes pequenos
- Use Server Actions para operações server-side

### Git

- Commits atômicos e descritivos
- Use conventional commits
- Mantenha branch main limpa
- Faça PRs para mudanças significativas

### Performance

- Use React Query para cache
- Otimize imagens
- Implemente lazy loading
- Monitore Core Web Vitals

### Network Resilience

#### Retry Logic com Backoff Exponencial

O projeto implementa retry automático com backoff exponencial para melhorar a resiliência da rede:

**Configuração Global (TanStack Query Provider):**

- **Queries**: 3 tentativas com delays 1s → 2s → 4s (máximo 30s)
- **Mutations**: 2 tentativas com delays 1s → 2s (máximo 10s)

**Por que Backoff Exponencial?**

- **Problema do delay fixo**: Sobrecarga constante no servidor durante instabilidade
- **Solução inteligente**: Aumenta progressivamente o tempo entre tentativas
- **Benefícios**:
  - Reduz carga no servidor durante picos de erro
  - Evita "thundering herd effect" (todos tentando simultaneamente)
  - Dá tempo para serviços se recuperarem
  - Respeita naturalmente rate limits de APIs

**Implementação:**

```typescript
// src/providers/query-client.tsx
queries: {
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
}
```

**Cenários de uso:**

- Falhas temporárias de API
- Instabilidade de rede
- Rate limiting do Supabase
- Sobrecarga temporária do servidor
