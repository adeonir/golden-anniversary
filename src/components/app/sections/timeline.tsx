'use client'

import { m as motion, useScroll, type Variants } from 'framer-motion'
import { Baby, Clock, Crown, Heart, type LucideIcon, Sparkles, Users } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '~/components/ui/card'
import { Section } from '~/components/ui/section'
import { SectionHeader } from '~/components/ui/section-header'
import { usePostHog } from '~/hooks/use-posthog'
import { useReducedMotion } from '~/hooks/use-reduced-motion'
import { analyticsEvents } from '~/lib/analytics/events'
import { config } from '~/lib/config'
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
  const prefersReducedMotion = useReducedMotion()
  const posthog = usePostHog()
  const containerRef = useRef<HTMLDivElement>(null)
  const hasCaptured = useRef(false)
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down')
  const [lastScrollY, setLastScrollY] = useState(0)

  const { scrollY } = useScroll()

  useEffect(() => {
    if (!hasCaptured.current && posthog) {
      posthog.capture(analyticsEvents.timelineSectionView, {
        section: 'timeline',
      })
      hasCaptured.current = true
    }
  }, [posthog])

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      const direction = latest > lastScrollY ? 'down' : 'up'
      setScrollDirection(direction)
      setLastScrollY(latest)
    })

    return () => unsubscribe()
  }, [scrollY, lastScrollY])

  const animationConfig = prefersReducedMotion
    ? { duration: config.animation.duration.fast, ease: 'easeOut' as const }
    : { duration: config.animation.duration.slow, ease: config.animation.easing.natural }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: animationConfig,
    },
  }

  return (
    <Section className="bg-white" ref={containerRef}>
      <div className="timeline-container">
        <SectionHeader icon={Clock} subtitle={content.subtitle} title={content.title} />

        <div className="relative py-4">
          <div className="-translate-x-1/2 -inset-y-4 absolute left-1/2 w-1 transform bg-gold-300" />

          <div className="timeline-spacing">
            {content.events.map((event, index) => (
              <TimelineEvent
                event={event}
                index={index}
                key={event.year}
                prefersReducedMotion={prefersReducedMotion}
                scrollDirection={scrollDirection}
                variants={itemVariants}
              />
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

function TimelineEvent({
  event,
  index,
  variants,
  scrollDirection,
  prefersReducedMotion,
}: {
  event: TimelineEvent
  index: number
  variants?: Variants
  scrollDirection: 'down' | 'up'
  prefersReducedMotion: boolean
}) {
  const isLeft = index % 2 === 0
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  return (
    <motion.article
      animate={isVisible ? 'visible' : 'hidden'}
      className="relative"
      initial="hidden"
      onViewportEnter={() => {
        // Only animate when scrolling down
        if (scrollDirection === 'down' && !isVisible && !prefersReducedMotion) {
          setIsVisible(true)
        }
      }}
      onViewportLeave={() => {
        // Reset visibility when element leaves viewport on scroll up
        if (scrollDirection === 'up') {
          setIsVisible(false)
        }
      }}
      variants={variants}
      viewport={{ margin: '-150px' }}
    >
      <div className="-translate-x-1/2 absolute top-6 left-1/2 hidden md:block">
        <TimelineIcon icon={event.icon} isHovered={isHovered} />
      </div>

      <div className="grid grid-cols-1 items-center gap-0 md:grid-cols-2 md:gap-20">
        <div
          className={cn(
            'order-2',
            isLeft ? 'order-1 pr-16 text-left md:pr-0 md:text-right' : 'order-2 pl-16 text-right md:pl-0 md:text-left',
          )}
        >
          <Card
            className="bg-gold-50 transition-all duration-300 hover:border-gold-600 hover:shadow-2xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <CardContent className="card-content-spacing relative">
              <TimelineIcon
                className={cn('absolute top-0 flex md:hidden', isLeft ? 'right-6' : 'left-6')}
                icon={event.icon}
              />

              <div>
                <span className="block text-2xl text-gold-600 md:text-3xl">{event.year}</span>
                <h3 className="font-semibold text-xl text-zinc-700" id={`timeline-${event.year}`}>
                  {event.title}
                </h3>
              </div>
              <p className="text-lg text-zinc-600">{event.description}</p>
            </CardContent>
          </Card>
        </div>
        <div className={cn('order-1', isLeft ? 'md:order-2' : 'md:order-1')} />
      </div>
    </motion.article>
  )
}

interface TimelineIconProps {
  icon: LucideIcon
  className?: string
  isHovered?: boolean
}

function TimelineIcon({ icon: Icon, className, isHovered }: TimelineIconProps) {
  return (
    <div
      className={cn(
        'z-10 flex size-12 transform items-center justify-center rounded-full border border-gold-500 bg-gold-500 text-white shadow-lg transition-all duration-300',
        isHovered && 'border-gold-600 shadow-xl',
        className,
      )}
    >
      <Icon className="size-6" strokeWidth={1.5} />
    </div>
  )
}
