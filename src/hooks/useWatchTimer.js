import { useRef, useCallback } from 'react'

export function useWatchTimer() {
  const startRef = useRef(null)
  const totalRef = useRef(0)  // accumulated minutes across pauses

  const start = useCallback(() => {
    startRef.current = Date.now()
  }, [])

  const pause = useCallback(() => {
    if (startRef.current) {
      totalRef.current += (Date.now() - startRef.current) / 60000
      startRef.current = null
    }
  }, [])

  const getMinutes = useCallback(() => {
    let total = totalRef.current
    if (startRef.current) {
      total += (Date.now() - startRef.current) / 60000
    }
    return Math.round(total * 10) / 10   // 1 decimal place
  }, [])

  const reset = useCallback(() => {
    startRef.current = null
    totalRef.current = 0
  }, [])

  return { start, pause, getMinutes, reset }
}
