import { Baby, Clock, Crown, Heart, type LucideIcon, Sparkles, Users } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { Section } from '~/components/ui/section'
import { SectionHeader } from '~/components/ui/section-header'
import { cn } from '~/lib/utils'

const content = {
  title: 'Nossa História',
  subtitle: 'A jornada de uma vida construída a dois.',
  events: [
    {
      year: '1975',
      title: 'O grande sim',
      description: 'Duas almas se encontraram e prometeram amor numa cerimônia repleta de sonhos e esperanças.',
      icon: Heart,
    },
    {
      year: '1977',
      title: 'Papai e mamãe',
      description: 'Adeonir trouxe ainda mais luz para o lar, transformando o casal em família.',
      icon: Baby,
    },
    {
      year: '1981',
      title: 'A princesa chegou',
      description: 'Martina chegou para completar a alegria da casa, enchendo cada canto de risadas.',
      icon: Baby,
    },
    {
      year: '1997',
      title: 'Vovô e vovó',
      description: 'Douglas, o primeiro neto, abriu um novo capítulo de avós apaixonados.',
      icon: Users,
    },
    {
      year: '2000',
      title: 'Uma florzinha',
      description: 'Hiandra trouxe doçura e ternura, conquistando o coração dos avós desde o primeiro olhar.',
      icon: Users,
    },
    {
      year: '2022',
      title: 'Renovando energias',
      description: 'Lucas chegou para renovar a energia da família e trazer novas aventuras.',
      icon: Users,
    },
    {
      year: '2024',
      title: 'Bisavós de primeira',
      description: 'Gael chegou para mostrar que o amor sempre se multiplica a cada geração.',
      icon: Sparkles,
    },
    {
      year: '2025',
      title: 'Bodas de ouro',
      description: 'Cinco décadas de cumplicidade, amor incondicional e uma família linda construída juntos.',
      icon: Crown,
    },
  ],
}

export function Timeline() {
  return (
    <Section className="bg-white">
      <div className="mx-auto max-w-6xl">
        <SectionHeader icon={Clock} subtitle={content.subtitle} title={content.title} />

        <div className="relative py-4">
          <div className="-translate-x-1/2 -inset-y-4 absolute left-1/2 w-1 transform bg-gold-300" />

          <div className="space-y-8 md:space-y-12">
            {content.events.map((event, index) => (
              <TimelineEvent event={event} index={index} key={event.year} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}

interface TimelineEvent {
  year: string
  title: string
  description: string
  icon: LucideIcon
}

function TimelineEvent({ event, index }: { event: TimelineEvent; index: number }) {
  const isLeft = index % 2 === 0

  return (
    <div className="relative">
      <TimelineIcon className="-translate-x-1/2 absolute top-6 left-1/2 hidden md:flex" icon={event.icon} />

      <div className="grid grid-cols-1 items-center gap-0 md:grid-cols-2 md:gap-20">
        <div
          className={cn(
            'order-2',
            isLeft ? 'order-1 pr-16 text-left md:pr-0 md:text-right' : 'order-2 pl-16 text-right md:pl-0 md:text-left',
          )}
        >
          <Card className="border-gold-300 bg-gold-50 shadow-lg">
            <CardContent className="relative space-y-4 px-8 py-4">
              <TimelineIcon
                className={cn('absolute top-0 flex md:hidden', isLeft ? 'right-6' : 'left-6')}
                icon={event.icon}
              />

              <div>
                <span className="block text-2xl text-gold-600 md:text-3xl">{event.year}</span>
                <h3 className="font-semibold text-xl text-zinc-700">{event.title}</h3>
              </div>
              <p className="text-lg text-zinc-600">{event.description}</p>
            </CardContent>
          </Card>
        </div>
        <div className={cn('order-1', isLeft ? 'md:order-2' : 'md:order-1')} />
      </div>
    </div>
  )
}

interface TimelineIconProps {
  icon: LucideIcon
  className?: string
}

function TimelineIcon({ icon: Icon, className }: TimelineIconProps) {
  return (
    <div
      className={cn(
        'z-10 size-12 transform items-center justify-center rounded-full bg-gold-500 text-white shadow-lg',
        className,
      )}
    >
      <Icon className="size-6" strokeWidth={1.5} />
    </div>
  )
}
