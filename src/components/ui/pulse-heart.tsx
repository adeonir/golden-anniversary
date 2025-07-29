'use client'

import { m as motion } from 'framer-motion'

interface PulseHeartProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const heartVariants = {
  pulse: {
    scale: [1, 1.2, 1],
    color: ['var(--color-gold-400)', 'var(--color-red-500)', 'var(--color-gold-400)'],
    transition: {
      scale: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut' as const,
      },
      color: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut' as const,
        times: [0, 0.5, 1],
      },
    },
  },
}

const sizeClasses = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
}

export function PulseHeart({ className, size = 'md' }: PulseHeartProps) {
  return (
    <motion.svg
      animate="pulse"
      aria-hidden="true"
      className={`${sizeClasses[size]} text-gold-400 ${className || ''}`}
      fill="currentColor"
      variants={heartVariants}
      viewBox="0 0 32 32"
    >
      <title>Coração decorativo</title>
      <path d="M16 28.47l-1.93-1.76C7.2 20.48 2.67 16.37 2.67 11.33 2.67 7.23 5.89 4 10 4c2.32 0 4.55 1.08 6 2.79C17.45 5.08 19.68 4 22 4c4.11 0 7.33 3.23 7.33 7.33 0 5.04-4.53 9.15-11.4 15.38L16 28.47z" />
    </motion.svg>
  )
}
