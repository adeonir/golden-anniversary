'use client'

import { domAnimation, LazyMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type MotionProviderProps = {
  children: ReactNode
}

export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  )
}
