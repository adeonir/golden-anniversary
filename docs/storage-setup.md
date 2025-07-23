# Storage Bucket Setup Instructions

Este documento contém as instruções para configurar o bucket de fotos no Supabase.

## 1. Criar o Bucket

No Supabase Dashboard:

1. Vá para **Storage** no menu lateral
2. Clique em **New bucket**
3. Configure:
   - **Name**: `photos`
   - **Public bucket**: ✅ Enabled
   - **File size limit**: `1048576` (1MB)
   - **Allowed MIME types**: `image/jpeg`

## 2. Configurar RLS Policies

No **SQL Editor** do Supabase, execute os seguintes comandos:

```sql
-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Public can view photos
CREATE POLICY "Public can view photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'photos');

-- Policy: Only admin can upload photos
CREATE POLICY "Only admin can upload photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'photos'
  AND auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
);

-- Policy: Only admin can update photos
CREATE POLICY "Only admin can update photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'photos'
  AND auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
);

-- Policy: Only admin can delete photos
CREATE POLICY "Only admin can delete photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'photos'
  AND auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
);
```

## 3. Configurar Admin Email

Execute este comando substituindo pelo email do admin real:

```sql
-- Set the admin email setting (replace with actual admin email)
-- This should match the ADMIN_EMAIL environment variable
ALTER DATABASE postgres SET app.admin_email = 'your-admin@email.com';
```

⚠️ **Importante**: Substitua `'your-admin@email.com'` pelo mesmo email configurado na variável `ADMIN_EMAIL` do arquivo `.env.local`.

## 4. Testar Configuração

Após a configuração, você pode testar:

1. **Upload (como admin)**: Deve funcionar quando logado com o email admin
2. **Visualização pública**: URLs públicas devem funcionar:
   ```
   https://your-project.supabase.co/storage/v1/object/public/photos/filename.jpg
   ```
3. **Upload (não-admin)**: Deve ser rejeitado

## 5. Estrutura dos Arquivos

- **Nomes dos arquivos**: Gerados automaticamente com timestamp
- **Formato**: `{timestamp}-{nome-original}.jpg`
- **Exemplo**: `1703123456789-foto-casamento.jpg`

## 6. Integração com Database

A tabela `photos` armazena:

- `file_path`: Nome do arquivo no Storage (ex: `1703123456789-foto-casamento.jpg`)
- `title`: Título opcional para a foto
- `order_position`: Posição para ordenação (drag & drop)

## 7. URLs das Fotos

Para obter a URL pública de uma foto:

```typescript
import { getPhotoUrl } from "~/lib/supabase/storage";

const photoUrl = getPhotoUrl("1703123456789-foto-casamento.jpg");
// Result: https://your-project.supabase.co/storage/v1/object/public/photos/1703123456789-foto-casamento.jpg
```
