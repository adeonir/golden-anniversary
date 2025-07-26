import { Users } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { Section } from '~/components/ui/section'
import { SectionHeader } from '~/components/ui/section-header'

const content = {
  title: 'Mensagens do Coração',
  subtitle: 'Palavras carregadas de amor e gratidão de quem teve o privilégio de crescer ao lado de vocês.',
  children: {
    title: 'Dos Filhos',
    message:
      'Vocês nos ensinaram que o amor verdadeiro não é apenas um sentimento, mas uma escolha diária. Cinquenta anos depois, continuam sendo nosso maior exemplo de dedicação, respeito e cumplicidade. Obrigado por nos mostrarem que os sonhos se realizam quando caminhamos juntos.',
    authors: 'Martina e Adeonir',
  },
  grandchildren: {
    title: 'Dos Netos',
    message:
      'Vocês são as raízes da nossa família e a prova viva de que o amor verdadeiro resiste ao tempo. Com suas histórias, abraços acolhedores e sorrisos sinceros, moldaram quem somos hoje. Que esta celebração seja mais um capítulo de uma linda história que continua a nos inspirar todos os dias.',
    authors: 'Hiandra e Douglas',
  },
}

export function FamilyMessages() {
  return (
    <Section className="bg-zinc-100">
      <div className="mx-auto max-w-5xl">
        <SectionHeader icon={Users} subtitle={content.subtitle} title={content.title} />

        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <MessageCard
            authors={content.children.authors}
            message={content.children.message}
            title={content.children.title}
          />
          <MessageCard
            authors={content.grandchildren.authors}
            message={content.grandchildren.message}
            title={content.grandchildren.title}
          />
        </div>
      </div>
    </Section>
  )
}

function MessageCard({ title, message, authors }: { title: string; message: string; authors: string }) {
  const cardId = `message-${title.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <article>
      <Card className="border-gold-300 bg-white py-8 shadow-lg">
        <CardContent className="space-y-6 px-8">
          <h3
            className="after:-translate-x-1/2 relative pb-4 text-center font-heading font-medium text-2xl text-gold-600 after:absolute after:bottom-1 after:left-1/2 after:h-0.5 after:w-20 after:bg-gold-400"
            id={`${cardId}-title`}
          >
            {title}
          </h3>
          <p className="text-base text-zinc-700 leading-relaxed">{message}</p>
          <div className="flex items-center justify-center space-x-2 pt-4">
            <div aria-hidden="true" className="size-2 rounded-full bg-gold-400" />
            <span className="text-sm text-zinc-500">Com amor, {authors}</span>
            <div aria-hidden="true" className="size-2 rounded-full bg-gold-400" />
          </div>
        </CardContent>
      </Card>
    </article>
  )
}
