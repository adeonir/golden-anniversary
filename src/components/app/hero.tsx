import { MoveDown } from 'lucide-react'
import { Fragment } from 'react'
import { Divider } from '~/components/ui/divider'

const content = {
  names: 'Iria e Ari',
  title: 'Bodas de Ouro',
  subtitle: 'Celebrando 50 anos de amor, cumplicidade e uma jornada extraordinária juntos!',
  dates: ['08 de novembro de 1975', '08 de novembro de 2025'],
}

export function Hero() {
  return (
    <header className="relative flex min-h-dvh items-center justify-center bg-linear-to-b from-gold-50 to-gold-200 px-4 pt-8 pb-24">
      <div className="hero-container">
        <h1 className="font-script text-8xl text-gold-700 sm:text-10xl">{content.names}</h1>
        <Divider />
        <h2 className="font-heading font-medium text-4xl text-zinc-700 sm:text-5xl">{content.title}</h2>
        <p className="max-w-md font-sans text-lg text-zinc-600 leading-relaxed sm:text-xl">{content.subtitle}</p>

        <div className="flex flex-col items-center space-y-2 pt-4 sm:flex-row sm:space-x-8 sm:space-y-0 sm:pt-8">
          {content.dates.map((date, index) => (
            <Fragment key={date}>
              <div className="flex items-center space-x-2">
                <div aria-hidden="true" className="size-2 rounded-full bg-gold-400" />
                <span className="font-normal font-sans text-sm text-zinc-600 uppercase tracking-wide">{date}</span>
              </div>
              {index === 0 && <div aria-hidden="true" className="hidden h-0.5 w-12 bg-zinc-300 sm:block" />}
            </Fragment>
          ))}
        </div>
      </div>

      <div className="-translate-x-1/2 absolute bottom-8 left-1/2 transform">
        <MoveDown aria-hidden="true" className="size-8 animate-bounce text-gold-500" strokeWidth={1.5} />
      </div>
    </header>
  )
}
