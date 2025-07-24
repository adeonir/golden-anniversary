import type { LucideIcon } from 'lucide-react'
import { cn } from '~/lib/utils'
import { Divider } from './divider'

interface SectionHeaderProps {
  icon: LucideIcon
  title: string
  subtitle: string
  className?: string
}

export function SectionHeader({ icon: Icon, title, subtitle, className = '' }: SectionHeaderProps) {
  return (
    <div className={cn('mb-16 flex flex-col items-center space-y-6 text-center sm:space-y-8', className)}>
      <Icon className="mx-auto mb-12 size-16 text-gold-500 sm:mb-16" strokeWidth={1} />
      <h2 className="font-heading font-semibold text-4xl text-zinc-700 leading-tight sm:text-5xl">{title}</h2>
      <Divider />
      <p className="mx-auto max-w-md text-lg text-slate-600 leading-relaxed sm:text-xl">{subtitle}</p>
    </div>
  )
}
