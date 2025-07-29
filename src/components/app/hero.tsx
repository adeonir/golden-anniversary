'use client'

import { m as motion } from 'framer-motion'
import { MoveDown } from 'lucide-react'
import { Fragment } from 'react'
import { PulseHeart } from '~/components/ui/pulse-heart'
import { useReducedMotion } from '~/hooks/use-reduced-motion'
import { config } from '~/lib/config'

const content = {
  names: 'Iria e Ari',
  title: 'Bodas de Ouro',
  subtitle: 'Celebrando 50 anos de amor, cumplicidade e uma jornada extraordinária juntos!',
  dates: ['08 de novembro de 1975', '08 de novembro de 2025'],
}

export function Hero() {
  const prefersReducedMotion = useReducedMotion()

  const animationConfig = prefersReducedMotion
    ? { duration: config.animation.duration.fast, ease: 'easeOut' as const }
    : { duration: config.animation.duration.slow, ease: config.animation.easing.natural }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        delayChildren: prefersReducedMotion ? 0 : 0.5,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: animationConfig,
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ...animationConfig,
        duration: prefersReducedMotion ? config.animation.duration.fast : 2,
        delay: 0,
      },
    },
  }

  return (
    <header className="relative flex min-h-dvh items-center justify-center bg-linear-to-b from-gold-50 to-gold-200 px-4 pt-8 pb-24">
      <motion.div animate="visible" className="hero-container" initial="hidden" variants={containerVariants}>
        <motion.h1 className="font-script text-8xl text-gold-700 sm:text-10xl" variants={titleVariants}>
          {content.names}
        </motion.h1>

        <motion.div className="-mt-4" variants={itemVariants}>
          <div className="flex items-center space-x-6">
            <div className="h-0.5 w-20 bg-gold-400" />
            <PulseHeart size="lg" />
            <div className="h-0.5 w-20 bg-gold-400" />
          </div>
        </motion.div>

        <motion.h2 className="font-heading font-medium text-4xl text-zinc-700 sm:text-5xl" variants={itemVariants}>
          {content.title}
        </motion.h2>

        <motion.p
          className="max-w-md font-sans text-lg text-zinc-600 leading-relaxed sm:text-xl"
          variants={itemVariants}
        >
          {content.subtitle}
        </motion.p>

        <motion.div
          className="flex flex-col items-center space-y-2 pt-4 sm:flex-row sm:space-x-8 sm:space-y-0 sm:pt-8"
          variants={itemVariants}
        >
          {content.dates.map((date, index) => (
            <Fragment key={date}>
              <div className="flex items-center space-x-2">
                <div aria-hidden="true" className="size-2 rounded-full bg-gold-400" />
                <span className="font-normal font-sans text-sm text-zinc-600 uppercase tracking-wide">{date}</span>
              </div>
              {index === 0 && <div aria-hidden="true" className="hidden h-0.5 w-12 bg-zinc-300 sm:block" />}
            </Fragment>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="-translate-x-1/2 absolute bottom-8 left-1/2 transform"
        initial={{ opacity: 0, y: 20 }}
        transition={{ ...animationConfig, delay: prefersReducedMotion ? 0 : 0.6 }}
      >
        <MoveDown aria-hidden="true" className="size-8 animate-bounce text-gold-500" strokeWidth={1.5} />
      </motion.div>
    </header>
  )
}
