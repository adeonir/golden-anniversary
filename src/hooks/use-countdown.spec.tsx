/** biome-ignore-all lint/suspicious/noExplicitAny: acceptable for test mocking */

import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('date-fns', () => ({
  differenceInDays: vi.fn(),
  differenceInHours: vi.fn(),
  differenceInMinutes: vi.fn(),
  differenceInSeconds: vi.fn(),
  isBefore: vi.fn(),
}))

import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, isBefore } from 'date-fns'
import { calculateTimeLeft, useCountdown } from './use-countdown'

describe('Countdown Hook Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('calculateTimeLeft() logic', () => {
    const mockTargetDate = new Date('2025-11-08T18:30:00')

    it('should return expired state when target date is in the past', () => {
      vi.mocked(isBefore).mockReturnValue(true)

      const result = calculateTimeLeft(mockTargetDate)

      expect(result).toEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
      })
      expect(isBefore).toHaveBeenCalledWith(mockTargetDate, expect.any(Date))
    })

    it('should calculate correct time left for future date', () => {
      vi.mocked(isBefore).mockReturnValue(false)
      vi.mocked(differenceInSeconds).mockReturnValue(3665) // 1 hour, 1 minute, 5 seconds
      vi.mocked(differenceInDays).mockReturnValue(5)
      vi.mocked(differenceInHours).mockReturnValue(25) // 1 day + 1 hour
      vi.mocked(differenceInMinutes).mockReturnValue(61) // 1 hour + 1 minute

      const result = calculateTimeLeft(mockTargetDate)

      expect(result).toEqual({
        days: 5,
        hours: 1, // 25 % 24 = 1
        minutes: 1, // 61 % 60 = 1
        seconds: 5, // 3665 % 60 = 5
        isExpired: false,
      })
    })

    it('should handle exact zero values correctly', () => {
      vi.mocked(isBefore).mockReturnValue(false)
      vi.mocked(differenceInSeconds).mockReturnValue(0)
      vi.mocked(differenceInDays).mockReturnValue(0)
      vi.mocked(differenceInHours).mockReturnValue(0)
      vi.mocked(differenceInMinutes).mockReturnValue(0)

      const result = calculateTimeLeft(mockTargetDate)

      expect(result).toEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: false,
      })
    })

    it('should handle large time differences', () => {
      vi.mocked(isBefore).mockReturnValue(false)
      vi.mocked(differenceInSeconds).mockReturnValue(90_061) // 25 hours, 1 minute, 1 second
      vi.mocked(differenceInDays).mockReturnValue(30)
      vi.mocked(differenceInHours).mockReturnValue(745) // 31 days + 1 hour
      vi.mocked(differenceInMinutes).mockReturnValue(3601) // 60 hours + 1 minute

      const result = calculateTimeLeft(mockTargetDate)

      expect(result).toEqual({
        days: 30,
        hours: 1, // 745 % 24 = 1
        minutes: 1, // 3601 % 60 = 1
        seconds: 1, // 90061 % 60 = 1
        isExpired: false,
      })
    })
  })

  describe('useCountdown() hook', () => {
    const mockTargetDate = new Date('2025-11-08T18:30:00')

    it('should initialize with default values', () => {
      // Clear any previous mocks
      vi.mocked(isBefore).mockReturnValue(false)
      vi.mocked(differenceInSeconds).mockReturnValue(0)
      vi.mocked(differenceInDays).mockReturnValue(0)
      vi.mocked(differenceInHours).mockReturnValue(0)
      vi.mocked(differenceInMinutes).mockReturnValue(0)

      const { result } = renderHook(() => useCountdown(mockTargetDate))

      // Initial state before client-side hydration
      expect(result.current).toEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: false,
      })
    })

    it('should update time after client-side hydration', async () => {
      vi.mocked(isBefore).mockReturnValue(false)
      vi.mocked(differenceInSeconds).mockReturnValue(3661)
      vi.mocked(differenceInDays).mockReturnValue(1)
      vi.mocked(differenceInHours).mockReturnValue(25)
      vi.mocked(differenceInMinutes).mockReturnValue(61)

      const { result } = renderHook(() => useCountdown(mockTargetDate))

      // Simulate client-side hydration useEffect
      await act(async () => {
        // Let useEffect run
      })

      expect(result.current).toEqual({
        days: 1,
        hours: 1,
        minutes: 1,
        seconds: 1,
        isExpired: false,
      })
    })

    it('should update countdown every second', async () => {
      let secondsValue = 3661
      vi.mocked(isBefore).mockReturnValue(false)
      vi.mocked(differenceInSeconds).mockImplementation(() => secondsValue)
      vi.mocked(differenceInDays).mockReturnValue(1)
      vi.mocked(differenceInHours).mockReturnValue(25)
      vi.mocked(differenceInMinutes).mockReturnValue(61)

      const { result } = renderHook(() => useCountdown(mockTargetDate))

      // Initial client hydration
      await act(async () => {
        // Let useEffect run
      })

      expect(result.current.seconds).toBe(1)

      // Simulate time passing (1 second)
      secondsValue = 3660
      vi.mocked(differenceInMinutes).mockReturnValue(61)

      await act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current.seconds).toBe(0)
    })

    it('should handle target date change', async () => {
      const initialDate = new Date('2025-11-08T18:30:00')
      const newDate = new Date('2025-12-08T18:30:00')

      vi.mocked(isBefore).mockReturnValue(false)
      vi.mocked(differenceInSeconds).mockReturnValue(3600)
      vi.mocked(differenceInDays).mockReturnValue(1)
      vi.mocked(differenceInHours).mockReturnValue(1)
      vi.mocked(differenceInMinutes).mockReturnValue(0)

      const { rerender } = renderHook(({ targetDate }) => useCountdown(targetDate), {
        initialProps: { targetDate: initialDate },
      })

      // Update with new target date and different mock values
      vi.mocked(differenceInDays).mockReturnValue(30)

      rerender({ targetDate: newDate })

      await act(async () => {
        // Let useEffect run
      })

      expect(differenceInDays).toHaveBeenCalledWith(newDate, expect.any(Date))
    })

    it('should show expired state correctly', async () => {
      vi.mocked(isBefore).mockReturnValue(true)

      const { result } = renderHook(() => useCountdown(mockTargetDate))

      await act(async () => {
        // Let useEffect run
      })

      expect(result.current).toEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
      })
    })

    it('should cleanup timer on unmount', () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval')

      vi.mocked(isBefore).mockReturnValue(false)
      vi.mocked(differenceInSeconds).mockReturnValue(3600)
      vi.mocked(differenceInDays).mockReturnValue(1)
      vi.mocked(differenceInHours).mockReturnValue(1)
      vi.mocked(differenceInMinutes).mockReturnValue(0)

      const { unmount } = renderHook(() => useCountdown(mockTargetDate))

      unmount()

      expect(clearIntervalSpy).toHaveBeenCalled()
      clearIntervalSpy.mockRestore()
    })

    it('should create timer after client hydration', () => {
      // Clear all mocks first
      vi.mocked(isBefore).mockReturnValue(false)
      vi.mocked(differenceInSeconds).mockReturnValue(3600)
      vi.mocked(differenceInDays).mockReturnValue(5)
      vi.mocked(differenceInHours).mockReturnValue(5)
      vi.mocked(differenceInMinutes).mockReturnValue(0)

      const setIntervalSpy = vi.spyOn(global, 'setInterval')

      const { result } = renderHook(() => useCountdown(mockTargetDate))

      // After both useEffects run, state should be updated and timer created
      expect(result.current).toEqual({
        days: 5,
        hours: 5,
        minutes: 0,
        seconds: 0,
        isExpired: false,
      })

      // Timer gets set after client hydration useEffect runs
      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000)

      setIntervalSpy.mockRestore()
    })
  })
})
