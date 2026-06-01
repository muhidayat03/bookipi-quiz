import { createContext, useContext } from 'react'
import type { Attempt, SubmitResult } from '@/types'

interface QuizContextValue {
  attempt: Attempt | null
  answers: Record<number, string>
  result: SubmitResult | null
  setAttempt: (a: Attempt) => void
  setAnswers: (a: Record<number, string>) => void
  setResult: (r: SubmitResult) => void
  reset: () => void
}

export const QuizContext = createContext<QuizContextValue | null>(null)

export const useQuizContext = () => {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error('useQuizContext must be used within QuizProvider')
  return ctx
}
