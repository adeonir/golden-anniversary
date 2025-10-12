import { cn } from '~/lib/utils'

type DividerProps = {
  className?: string
}

export function Divider({ className }: DividerProps) {
  return (
    <div className={cn('flex items-center space-x-6', className)}>
      <div className="h-0.5 w-20 bg-gold-400" />
      <div className="size-6 rounded-full bg-gold-400" />
      <div className="h-0.5 w-20 bg-gold-400" />
    </div>
  )
}
