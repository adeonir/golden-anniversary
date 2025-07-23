'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { signIn } from '~/actions/sign-in'
import { Button } from '~/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'

const loginSchema = z.object({
  email: z.email({ error: 'Email inválido' }),
  password: z.string({ error: 'Senha é obrigatória' }).min(8, { error: 'Senha deve ter no mínimo 8 caracteres' }),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)

    await signIn(formData)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="border-zinc-200 focus:border-zinc-400! focus-visible:ring-zinc-400/30"
                  placeholder="seu-email@exemplo.com"
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="border-zinc-200 focus:border-zinc-400! focus-visible:ring-zinc-400/30"
                  placeholder="••••••••"
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full bg-zinc-600 hover:bg-zinc-700" disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>
        <div className="mt-4 text-center">
          <a className="text-sm text-zinc-600 hover:text-zinc-800 hover:underline" href="/">
            ← Voltar para o site
          </a>
        </div>
      </form>
    </Form>
  )
}
