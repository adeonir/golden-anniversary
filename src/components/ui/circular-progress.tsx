'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '~/lib/utils'

const circularProgressVariants = cva('transition-all duration-300', {
  variants: {
    intent: {
      default: 'stroke-gold-600',
      admin: 'stroke-zinc-700',
      success: 'stroke-green-500',
      danger: 'stroke-red-500',
    },
  },
  defaultVariants: {
    intent: 'default',
  },
})

const circularProgressTextVariants = cva('font-medium transition-all duration-300', {
  variants: {
    intent: {
      default: 'fill-gold-600',
      admin: 'fill-zinc-700',
      success: 'fill-green-500',
      danger: 'fill-red-500',
    },
  },
  defaultVariants: {
    intent: 'default',
  },
})

function CircularProgress({
  value = 0,
  size = 80,
  strokeWidth = 8,
  intent,
  className,
  ...props
}: React.ComponentProps<'svg'> &
  VariantProps<typeof circularProgressVariants> & {
    value?: number
    size?: number
    strokeWidth?: number
  }) {
  const normalizedValue = Math.min(Math.max(value, 0), 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (normalizedValue / 100) * circumference

  return (
    <svg
      className={cn('-rotate-90 transform', className)}
      data-slot="circular-progress"
      height={size}
      width={size}
      {...props}
    >
      <title>Upload progress: {Math.round(normalizedValue)}%</title>
      <circle
        className="stroke-zinc-200"
        cx={size / 2}
        cy={size / 2}
        fill="none"
        r={radius}
        strokeWidth={strokeWidth}
      />
      <circle
        className={cn(circularProgressVariants({ intent }))}
        cx={size / 2}
        cy={size / 2}
        fill="none"
        r={radius}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        style={{
          transition: 'stroke-dashoffset 0.3s ease',
        }}
      />
      <text
        className={cn(circularProgressTextVariants({ intent }), 'text-sm')}
        dominantBaseline="middle"
        textAnchor="middle"
        transform={`rotate(90 ${size / 2} ${size / 2})`}
        x={size / 2}
        y={size / 2}
      >
        {Math.round(normalizedValue)}%
      </text>
    </svg>
  )
}

export { CircularProgress }
