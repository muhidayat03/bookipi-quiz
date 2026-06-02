import { useEffect, useState } from 'react'
import { logEvent } from '@/api'

export interface AntiCheatCounts {
  tabSwitches: number
  pastes: number
}

export const useAntiCheat = (attemptId: number | null): AntiCheatCounts => {
  const [tabSwitches, setTabSwitches] = useState(0)
  const [pastes, setPastes] = useState(0)

  useEffect(() => {
    if (!attemptId) return

    const handleVisibility = () => {
      if (document.hidden) {
        logEvent(attemptId, 'window_blur')
        setTabSwitches((n) => n + 1)
      } else {
        logEvent(attemptId, 'window_focus')
      }
    }

    const handlePaste = () => {
      logEvent(attemptId, 'copy_paste_detected')
      setPastes((n) => n + 1)
    }

    document.addEventListener('visibilitychange', handleVisibility)
    document.addEventListener('paste', handlePaste)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      document.removeEventListener('paste', handlePaste)
      setTabSwitches(0)
      setPastes(0)
    }
  }, [attemptId])

  return { tabSwitches, pastes }
}
