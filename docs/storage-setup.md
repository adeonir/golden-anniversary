# Configuração do Supabase Storage

Este documento contém instruções para configurar o bucket de storage do Supabase para fotos.

## Visão Geral

A configuração do storage garante que:

- **Visualização pública**: Qualquer pessoa pode ver fotos na galeria
- **Gerenciamento admin**: Apenas admin pode fazer upload, editar ou deletar fotos
- **Performance**: URLs públicas para cache otimizado

## 1. Criar Bucket de Storage

No **Supabase Dashboard**:

1. Vá para a seção **Storage**
2. Clique em **Create a new bucket**
3. Configure:
   - **Name**: `photos`
   - **Public bucket**: ✅ **Enabled** (para visualização pública)
   - **File size limit**: 10MB (ajuste conforme necessário)
   - **Allowed MIME types**: `image/*`

## 2. Configuração do Storage

### Configurações do Bucket

```sql
-- Sem políticas RLS necessárias - usando bucket público para simplicidade
-- Bucket de storage é público para visualização
-- Acesso admin controlado através da lógica da aplicação
```

### Estrutura de Arquivos

```
photos/
├── photo1.jpg
├── photo2.jpg
├── photo3.jpg
└── ...
```

## 3. Configuração de Upload

### Upload Server-Side

```typescript
// lib/supabase/storage.ts
import { createClient } from "~/lib/supabase/server";

export async function uploadPhoto(file: File, title?: string) {
  const supabase = await createClient();

  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("photos")
    .upload(fileName, file);

  if (error) throw error;

  return data.path;
}
```

### Upload Client-Side (Apenas Admin)

```typescript
// components/app/admin/photo-upload.tsx
import { createClient } from "~/lib/supabase/client";

export async function uploadPhoto(file: File) {
  const supabase = createClient();

  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("photos")
    .upload(fileName, file);

  if (error) throw error;

  return data.path;
}
```

## 4. Geração de URLs das Fotos

### URLs Públicas

```typescript
// lib/supabase/storage.ts
export function getPhotoUrl(filePath: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/photos/${filePath}`;
}
```

### Uso em Componentes

```typescript
// components/app/gallery/photo-carousel.tsx
import { getPhotoUrl } from "~/lib/supabase/storage";

export function PhotoCarousel({ photos }: { photos: Photo[] }) {
  return (
    <div>
      {photos.map((photo) => (
        <img
          key={photo.id}
          src={getPhotoUrl(photo.filePath)}
          alt={photo.title || "Foto da galeria"}
        />
      ))}
    </div>
  );
}
```

## 5. Integração com Banco de Dados

### Tabela Photos

```sql
CREATE TABLE photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  filePath text NOT NULL,
  orderPosition integer DEFAULT 0,
  createdAt timestamptz DEFAULT now()
);
```

### Inserir Registro de Foto

```typescript
// actions/photo-actions.ts
export async function createPhotoRecord(filePath: string, title?: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("photos")
    .insert({
      filePath,
      title,
      orderPosition: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

## 6. URLs das Fotos

### Estrutura da URL

```
https://your-project.supabase.co/storage/v1/object/public/photos/filename.jpg
```

### Benefícios das URLs Públicas

1. **Performance**: Cache do navegador funciona otimamente
2. **CDN**: CDN do Supabase fornece entrega global rápida
3. **Simplicidade**: Não precisa de URLs assinadas para visualização
4. **SEO**: URLs diretas de imagem para melhor indexação

### Considerações de Segurança

1. **Controle de Upload**: Apenas admin pode fazer upload (controlado na app)
2. **Validação de Arquivo**: Valide tipos e tamanhos de arquivo
3. **Moderação de Conteúdo**: Revise conteúdo enviado
4. **Limites de Storage**: Monitore uso do storage

## 7. Testes

### Teste de Upload

```typescript
// Teste de upload de foto
const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
const filePath = await uploadPhoto(file);
console.log("Uploaded:", filePath);
```

### Teste de URL

```typescript
// Teste de geração de URL de foto
const url = getPhotoUrl("test.jpg");
console.log("Photo URL:", url);
```

## 8. Manutenção

### Tarefas Regulares

1. **Monitoramento de Storage**: Verifique uso do storage mensalmente
2. **Limpeza de Arquivos**: Remova fotos não utilizadas
3. **Performance**: Monitore tempos de carregamento de imagens
4. **Backup**: Exporte fotos importantes

### Monitoramento

- **Uso de Storage**: Supabase Dashboard > Storage
- **Bandwidth**: Monitore uso do CDN
- **Performance**: Use ferramentas de dev do navegador
- **Erros**: Verifique logs de upload/acesso
