# Guia de Deploy

## Visão Geral

Este guia cobre o processo de deploy do site Bodas de Ouro usando Vercel.

## Pré-requisitos

- Conta Vercel
- Projeto Supabase configurado
- Repositório GitHub

## Deploy na Vercel

### 1. Conectar Repositório

1. Vá para o [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique em "New Project"
3. Importe seu repositório GitHub
4. Configure as configurações do projeto:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (padrão)
   - **Build Command**: `pnpm build:prod`
   - **Output Directory**: `.next` (padrão)

### 2. Configuração das Variáveis de Ambiente

1. Vá para as configurações do seu projeto na Vercel
2. Navegue até "Environment Variables"
3. Adicione as variáveis obrigatórias:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Admin
ADMIN_EMAIL=your_admin_email@gmail.com
```

### 3. Configuração de Build

```json
// vercel.json
{
  "buildCommand": "pnpm build:prod",
  "installCommand": "pnpm install --frozen-lockfile",
  "framework": "nextjs"
}
```

## Monitoramento

### Vercel Analytics

1. Habilite Vercel Analytics nas configurações do projeto
2. Visualize métricas de performance no dashboard
3. Monitore Core Web Vitals

### Rastreamento de Erros

1. Configure relatórios de erro na Vercel
2. Monitore logs de função
3. Configure alertas para erros críticos

## Troubleshooting

### Problemas Comuns

1. **Falhas de Build**

   - Verifique variáveis de ambiente
   - Verifique erros TypeScript
   - Verifique versões de dependências

2. **Problemas de Conexão com Banco**

   - Verifique URL e chaves do Supabase
   - Verifique conectividade de rede
   - Verifique estrutura das tabelas

3. **Problemas de Carregamento de Imagens**
   - Verifique configuração do Supabase Storage
   - Verifique configurações CORS
   - Verifique URLs das imagens

## Estratégia de Rollback

1. **Rollback da Vercel**: Use o dashboard da Vercel para fazer rollback para deploy anterior
2. **Rollback do Banco**: Use migrações do Supabase se necessário
3. **Variáveis de Ambiente**: Mantenha valores anteriores como backup

## Manutenção

### Checklist de Monitoramento

- [ ] Status de deploy da Vercel
- [ ] Saúde do banco Supabase
- [ ] Validade das variáveis de ambiente
- [ ] Métricas de performance
- [ ] Taxa de erros
- [ ] Analytics de usuários
