import { useState, useCallback } from 'react'

import type { Attempt, SubmitResult } from '@/types'
import { useAntiCheat } from '@/hooks'
import { QuizContext } from './useQuizContext'

export const QuizProvider = ({ children }: { children: React.ReactNode }) => {
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [result, setResult] = useState<SubmitResult | null>(null)

  const antiCheat = useAntiCheat(attempt?.id ?? null)

  const reset = useCallback(() => {
    setAttempt(null)
    setAnswers({})
    setResult(null)
  }, [])

  console.log('skuyy', attempt)

  return (
    <QuizContext.Provider
      value={{ attempt, answers, result, antiCheat, setAttempt, setAnswers, setResult, reset }}
    >
      {children}
    </QuizContext.Provider>
  )
}
