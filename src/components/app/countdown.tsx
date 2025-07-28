'use client'

import { CalendarFold } from 'lucide-react'
import { Card } from '~/components/ui/card'
import { Section } from '~/components/ui/section'
import { SectionHeader } from '~/components/ui/section-header'
import { useCountdown } from '~/hooks/use-countdown'
import { config } from '~/lib/config'

const TARGET_DATE = new Date(config.event.targetDate)

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
  const { days, hours, minutes, seconds } = useCountdown(TARGET_DATE)

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

interface TimeCardProps {
  value: number
  label: string
}

function TimeCard({ value, label }: TimeCardProps) {
  return (
    <Card className="rounded-3xl pt-4 pb-6 sm:pt-6 sm:pb-8">
      <div className="font-heading font-semibold text-6xl text-gold-500 tabular-nums md:text-7xl">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="font-medium text-md text-zinc-400 uppercase tracking-widest">{label}</div>
    </Card>
  )
}
