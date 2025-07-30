import { MessageSquareText } from 'lucide-react'
import { Section } from '~/components/ui/section'
import { SectionHeader } from '~/components/ui/section-header'
import { GuestbookForm } from './guestbook-form'
import { GuestbookMessages } from './guestbook-messages'

const content = {
  title: 'Livro de Visitas',
  subtitle: 'Deixe sua mensagem de carinho para o casal.',
}

export function Guestbook() {
  return (
    <Section className="bg-gold-50">
      <div className="mx-auto max-w-4xl">
        <SectionHeader icon={MessageSquareText} subtitle={content.subtitle} title={content.title} />

        <div className="space-y-16">
          <GuestbookForm />
          <GuestbookMessages />
        </div>
      </div>
    </Section>
  )
}
