import { useEffect, useState } from 'react'

export function useViewportHeight() {
  const [viewportHeight, setViewportHeight] = useState(0)

  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight)
    }

    updateViewportHeight()
    window.addEventListener('resize', updateViewportHeight)

    return () => window.removeEventListener('resize', updateViewportHeight)
  }, [])

  return viewportHeight
}
