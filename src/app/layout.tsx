import './globals.css'

import type { Metadata } from 'next'
import { Inter, MonteCarlo, Playfair_Display } from 'next/font/google'
import type { ReactNode } from 'react'
import { Toaster } from '~/components/ui/sonner'
import { env } from '~/env'
import { cn } from '~/lib/utils'
import { QueryProvider } from '~/providers/query-client'

// Validate environment variables on app start
env

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
})

const monteCarlo = MonteCarlo({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-script',
})

export const metadata: Metadata = {
  title: 'Iria & Ari - Bodas de Ouro',
  description:
    'Site comemorativo dos 50 anos de casamento de Iria e Ari. Uma celebração de amor, família e memórias que atravessaram meio século.',
  keywords: 'bodas de ouro, 50 anos de casamento, Iria e Ari, aniversário de casamento, celebração, família',
  authors: [{ name: 'Adeonir Kohl' }],
  openGraph: {
    title: 'Iria & Ari - Bodas de Ouro',
    description: 'Celebrando 50 anos de amor e união. Uma jornada de vida compartilhada em família.',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Iria & Ari - Bodas de Ouro',
    description: 'Celebrando 50 anos de amor e união.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html className={cn(inter.variable, playfair.variable, monteCarlo.variable)} lang="pt-BR">
      <body className="min-w-80 font-sans">
        <QueryProvider>{children}</QueryProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
