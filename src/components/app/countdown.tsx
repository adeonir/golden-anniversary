'use client'

import { CalendarFold } from 'lucide-react'
import { Card } from '~/components/ui/card'
import { Divider } from '~/components/ui/divider'
import { useCountdown } from '~/hooks/use-countdown'

const TARGET_DATE = new Date('2025-11-08T18:30:00')

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
    <section className="bg-gold-50 px-4 py-24">
      <div className="mx-auto px-4">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-16 flex flex-col items-center space-y-6 sm:space-y-8">
            <CalendarFold className="mx-auto mb-12 size-16 text-gold-500 sm:mb-16" strokeWidth={1} />
            <h2 className="font-heading font-semibold text-4xl text-zinc-700 leading-tight sm:text-5xl">
              {content.title}
            </h2>
            <Divider />
            <p className="mx-auto max-w-md text-lg text-slate-600 leading-relaxed sm:text-xl">{content.subtitle}</p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            <TimeCard label={content.labels.days} value={days} />
            <TimeCard label={content.labels.hours} value={hours} />
            <TimeCard label={content.labels.minutes} value={minutes} />
            <TimeCard label={content.labels.seconds} value={seconds} />
          </div>
        </div>
      </div>
    </section>
  )
}

interface TimeCardProps {
  value: number
  label: string
}

function TimeCard({ value, label }: TimeCardProps) {
  return (
    <Card className="border border-gold-200 bg-white py-6 shadow-lg sm:py-8">
      <div className="font-heading font-semibold text-6xl text-gold-500 tabular-nums md:text-7xl">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="font-medium text-md text-slate-400 uppercase tracking-widest">{label}</div>
    </Card>
  )
}
