import { createContext, useContext, useState } from 'react'
import type { Attempt, SubmitResult } from '../types'

interface QuizContextValue {
  attempt: Attempt | null
  answers: Record<number, string>
  result: SubmitResult | null
  setAttempt: (a: Attempt) => void
  setAnswers: (a: Record<number, string>) => void
  setResult: (r: SubmitResult) => void
  reset: () => void
}

const QuizContext = createContext<QuizContextValue | null>(null)

export const QuizProvider = ({ children }: { children: React.ReactNode }) => {
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [result, setResult] = useState<SubmitResult | null>(null)

  const reset = () => {
    setAttempt(null)
    setAnswers({})
    setResult(null)
  }

  return (
    <QuizContext.Provider value={{ attempt, answers, result, setAttempt, setAnswers, setResult, reset }}>
      {children}
    </QuizContext.Provider>
  )
}

export const useQuizContext = () => {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error('useQuizContext must be used within QuizProvider')
  return ctx
}
