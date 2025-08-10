import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, isBefore } from 'date-fns'
import { useEffect, useState } from 'react'

export interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

export function useCountdown(targetDate: Date): CountdownTime {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setTimeLeft(calculateTimeLeft(targetDate))
  }, [targetDate])

  useEffect(() => {
    if (!isClient) return

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, isClient])

  return timeLeft
}

export function calculateTimeLeft(targetDate: Date): CountdownTime {
  const now = new Date()

  if (isBefore(targetDate, now)) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    }
  }

  const totalSeconds = differenceInSeconds(targetDate, now)
  const days = differenceInDays(targetDate, now)
  const hours = differenceInHours(targetDate, now) % 24
  const minutes = differenceInMinutes(targetDate, now) % 60
  const seconds = totalSeconds % 60

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
  }
}
