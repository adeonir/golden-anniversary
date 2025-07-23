# Row Level Security (RLS) Setup

Este documento contém as instruções para configurar as políticas de Row Level Security no Supabase.

## Visão Geral

O RLS garante que:

- **Messages**: Apenas o admin pode visualizar e gerenciar mensagens
- **Photos**: Público pode visualizar, apenas admin pode gerenciar
- **Service Role**: Pode inserir mensagens via API (formulário público)

## 1. Configurar RLS nas Tabelas

No **SQL Editor** do Supabase, execute:

```sql
-- Enable RLS on tables
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "photos" ENABLE ROW LEVEL SECURITY;
```

## 2. Políticas para Tabela `messages`

### Inserção via Service Role (Formulário Público)

```sql
-- Only service role can insert messages (via API route/server action only)
CREATE POLICY "Service role can insert messages" ON "messages"
  FOR INSERT
  TO service_role
  WITH CHECK (true);
```

### Visualização pelo Admin

```sql
-- Only admin can view messages (for moderation)
CREATE POLICY "Only admin can view messages" ON "messages"
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));
```

### Gerenciamento pelo Admin

```sql
-- Only admin can update messages
CREATE POLICY "Only admin can update messages" ON "messages"
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true))
  WITH CHECK (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- Only admin can delete messages
CREATE POLICY "Only admin can delete messages" ON "messages"
  FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));
```

## 3. Políticas para Tabela `photos`

### Visualização Pública

```sql
-- Anyone can view photos (public gallery)
CREATE POLICY "Anyone can view photos" ON "photos"
  FOR SELECT
  TO anon, authenticated
  USING (true);
```

### Gerenciamento pelo Admin

```sql
-- Only admin can manage photos
CREATE POLICY "Only admin can manage photos" ON "photos"
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true))
  WITH CHECK (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));
```

## 4. Configurar Admin Email

⚠️ **Importante**: Configure o email do admin no banco:

```sql
-- Set the admin email setting
-- This should match the ADMIN_EMAIL environment variable
ALTER DATABASE postgres SET app.admin_email = '[SEU_EMAIL_ADMIN_AQUI]';
```

Substitua `[SEU_EMAIL_ADMIN_AQUI]` pelo mesmo email da variável `ADMIN_EMAIL` do `.env.local`.

## 5. Fluxo de Funcionamento

### Mensagens (Messages)

1. **Visitantes**: Enviam mensagens via formulário → Server Action → Service Role insere no banco
2. **Admin**: Visualiza todas as mensagens pendentes no painel
3. **Admin**: Pode aprovar, rejeitar ou editar mensagens

### Fotos (Photos)

1. **Visitantes**: Visualizam galeria pública (leitura apenas)
2. **Admin**: Upload, edição, exclusão e reordenação de fotos
3. **Storage**: Integrado com RLS para controle de upload/download

## 6. Testando as Políticas

### Como Admin (Logado)

- ✅ Ver todas as mensagens
- ✅ Gerenciar mensagens (aprovar/rejeitar/editar)
- ✅ Ver todas as fotos
- ✅ Upload/editar/deletar fotos

### Como Visitante (Não logado)

- ❌ Ver mensagens (negado)
- ✅ Enviar mensagem via formulário
- ✅ Ver galeria de fotos
- ❌ Upload de fotos (negado)

### Via Service Role (Server Actions)

- ✅ Inserir mensagens no banco
- ✅ Ler dados para exibição pública

## 7. Segurança

- **Autenticação**: Baseada em JWT com email verificado
- **Autorização**: RLS garante acesso apenas ao admin correto
- **Inserção Segura**: Mensagens públicas passam pelo Service Role
- **Validação**: Server Actions validam dados antes da inserção
