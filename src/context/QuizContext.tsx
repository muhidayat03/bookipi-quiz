import { useState } from 'react'
import type { Attempt, SubmitResult } from '@/types'
import { QuizContext } from './useQuizContext'

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
    <QuizContext.Provider
      value={{ attempt, answers, result, setAttempt, setAnswers, setResult, reset }}
    >
      {children}
    </QuizContext.Provider>
  )
}
