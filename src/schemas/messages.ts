import { z } from 'zod'

export const createMessageSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  message: z.string().min(1, 'Mensagem é obrigatória').max(500, 'Mensagem deve ter no máximo 500 caracteres'),
})

export type CreateMessageData = z.infer<typeof createMessageSchema>
