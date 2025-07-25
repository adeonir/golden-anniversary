'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, MessageSquareText, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Section } from '~/components/ui/section'
import { SectionHeader } from '~/components/ui/section-header'
import { Textarea } from '~/components/ui/textarea'
import { useCreateMessage } from '~/hooks/use-messages'
import type { CreateMessageData } from '~/types/messages'

const content = {
  title: 'Livro de Visitas',
  subtitle: 'Deixe sua mensagem de carinho para o casal.',
}

const guestbookSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  message: z.string().min(1, 'Mensagem é obrigatória').max(500, 'Mensagem deve ter no máximo 500 caracteres'),
})

type GuestbookFormData = z.infer<typeof guestbookSchema>

export function Guestbook() {
  const createMessageMutation = useCreateMessage()

  const form = useForm<GuestbookFormData>({
    resolver: zodResolver(guestbookSchema),
    defaultValues: {
      name: '',
      message: '',
    },
  })

  const onSubmit = (data: GuestbookFormData) => {
    const messageData: CreateMessageData = {
      name: data.name.trim(),
      message: data.message.trim(),
    }

    createMessageMutation.mutate(messageData, {
      onSuccess: () => {
        form.reset()
      },
    })
  }

  return (
    <Section className="bg-gold-50">
      <div className="mx-auto max-w-4xl">
        <SectionHeader icon={MessageSquareText} subtitle={content.subtitle} title={content.title} />

        <Card className="border-gold-200 bg-white shadow-lg">
          <CardContent className="px-12 py-6">
            <Form {...form}>
              <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-zinc-700">Seu nome ou família</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: João e Maria Souza" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-zinc-700">Sua mensagem</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-40"
                          placeholder="Deixe aqui sua mensagem de carinho e felicitações..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="text-sm text-zinc-500">* Sua mensagem será analisada antes da publicação</div>

                <div className="flex justify-end">
                  <Button
                    className="w-48"
                    disabled={form.formState.isSubmitting}
                    size="lg"
                    type="submit"
                    variant="primary"
                  >
                    {form.formState.isSubmitting ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="mr-2 size-4" />
                        Enviar mensagem
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Section>
  )
}
