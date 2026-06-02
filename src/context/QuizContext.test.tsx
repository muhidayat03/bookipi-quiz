import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { QuizProvider } from './QuizContext'
import { useQuizContext } from './useQuizContext'
import type { Attempt, SubmitResult } from '@/types'

vi.mock('@/hooks', () => ({
  useAntiCheat: vi.fn(() => ({ tabSwitches: 0, pastes: 0 })),
}))

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QuizProvider>{children}</QuizProvider>
)

const mockAttempt: Attempt = {
  id: 1,
  quizId: 10,
  startedAt: '2024-01-01T00:00:00Z',
  submittedAt: null,
  answers: [],
  quiz: { id: 10, title: 'My Quiz', description: 'A quiz', questions: [] },
}

describe('QuizContext', () => {
  it('throws when useQuizContext is used outside QuizProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useQuizContext())).toThrow(
      'useQuizContext must be used within QuizProvider'
    )
    spy.mockRestore()
  })

  it('provides null initial state', () => {
    const { result } = renderHook(() => useQuizContext(), { wrapper })
    expect(result.current.attempt).toBeNull()
    expect(result.current.answers).toEqual({})
    expect(result.current.result).toBeNull()
  })

  it('setAttempt updates the attempt', () => {
    const { result } = renderHook(() => useQuizContext(), { wrapper })
    act(() => result.current.setAttempt(mockAttempt))
    expect(result.current.attempt).toEqual(mockAttempt)
  })

  it('setAnswers updates the answers map', () => {
    const { result } = renderHook(() => useQuizContext(), { wrapper })
    act(() => result.current.setAnswers({ 1: '0', 2: 'Paris' }))
    expect(result.current.answers).toEqual({ 1: '0', 2: 'Paris' })
  })

  it('setResult updates the result', () => {
    const { result } = renderHook(() => useQuizContext(), { wrapper })
    const mockResult: SubmitResult = { score: 80, details: [{ questionId: 1, correct: true }] }
    act(() => result.current.setResult(mockResult))
    expect(result.current.result).toEqual(mockResult)
  })

  it('reset clears attempt, answers, and result', () => {
    const { result } = renderHook(() => useQuizContext(), { wrapper })

    act(() => {
      result.current.setAttempt(mockAttempt)
      result.current.setAnswers({ 1: '0' })
      result.current.setResult({ score: 100, details: [] })
    })

    act(() => result.current.reset())

    expect(result.current.attempt).toBeNull()
    expect(result.current.answers).toEqual({})
    expect(result.current.result).toBeNull()
  })
})
