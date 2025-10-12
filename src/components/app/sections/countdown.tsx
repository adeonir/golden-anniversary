'use client'

import { AnimatePresence, m as motion } from 'framer-motion'
import { CalendarFold } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Card } from '~/components/ui/card'
import { Section } from '~/components/ui/section'
import { SectionHeader } from '~/components/ui/section-header'
import { useCountdown } from '~/hooks/use-countdown'
import { usePostHog } from '~/hooks/use-posthog'
import { useReducedMotion } from '~/hooks/use-reduced-motion'
import { analyticsEvents } from '~/lib/analytics/events'
import { config } from '~/lib/config'

const targetDate = new Date(config.event.targetDate)

const content = {
  title: 'Contagem Regressiva',
  subtitle: '50 anos de amor merecem ser festejados com todo carinho!',
  labels: {
    days: 'dias',
    hours: 'horas',
    minutes: 'minutos',
    seconds: 'segundos',
  },
}

export function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown(targetDate)
  const posthog = usePostHog()
  const hasCaptured = useRef(false)

  useEffect(() => {
    if (!hasCaptured.current && posthog) {
      posthog.capture(analyticsEvents.countdownView, {
        section: 'countdown',
        daysRemaining: days,
      })
      hasCaptured.current = true
    }
  }, [posthog, days])

  return (
    <Section className="bg-gold-50">
      <div className="mx-auto px-4">
        <div className="section-container text-center">
          <SectionHeader icon={CalendarFold} subtitle={content.subtitle} title={content.title} />

          <div
            aria-label="Contagem regressiva para a celebração dos 50 anos de casamento"
            aria-live="polite"
            className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4 md:gap-8"
            role="timer"
          >
            <TimeCard label={content.labels.days} value={days} />
            <TimeCard label={content.labels.hours} value={hours} />
            <TimeCard label={content.labels.minutes} value={minutes} />
            <TimeCard label={content.labels.seconds} value={seconds} />
          </div>
        </div>
      </div>
    </Section>
  )
}

type TimeCardProps = {
  value: number
  label: string
}

function TimeCard({ value, label }: TimeCardProps) {
  const prefersReducedMotion = useReducedMotion()

  const animationConfig = prefersReducedMotion
    ? { duration: config.animation.duration.fast, ease: 'easeOut' as const }
    : { duration: config.animation.duration.fast, ease: config.animation.easing.natural }

  return (
    <Card className="rounded-3xl pt-4 pb-6 sm:pt-6 sm:pb-8">
      <div className="font-heading font-semibold text-6xl text-gold-500 tabular-nums md:text-7xl">
        <AnimatePresence mode="wait">
          <motion.span
            animate={{ opacity: 1, y: 0 }}
            className="inline-block"
            exit={{ opacity: 0, y: -20 }}
            initial={{ opacity: 0, y: 20 }}
            key={value}
            transition={animationConfig}
          >
            {value.toString().padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="font-medium text-md text-zinc-400 uppercase tracking-widest">{label}</div>
    </Card>
  )
}
