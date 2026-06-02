/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router'
import QuizPlayerPage from './QuizPlayerPage'
import * as queries from '@/queries'
import * as contextModule from '@/context'
import type { Attempt } from '@/types'

vi.mock('@/queries', () => ({ useSaveAnswer: vi.fn(), useSubmitAttempt: vi.fn() }))
vi.mock('@/context', () => ({ useQuizContext: vi.fn() }))

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router')
  return { ...actual, useNavigate: () => vi.fn() }
})

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/quiz/1/play']}>
      <Routes>
        <Route path="/quiz/:id/play" element={<QuizPlayerPage />} />
      </Routes>
    </MemoryRouter>
  )

const mockAttempt: Attempt = {
  id: 1,
  quizId: 1,
  startedAt: '2024-01-01T00:00:00Z',
  submittedAt: null,
  answers: [],
  quiz: {
    id: 1,
    title: 'Test Quiz',
    description: '',
    questions: [
      { id: 1, quizId: 1, type: 'short', prompt: 'What is 1 + 1?', position: 1 },
      { id: 2, quizId: 1, type: 'short', prompt: 'What is 2 + 2?', position: 2 },
    ],
  },
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(contextModule.useQuizContext).mockReturnValue({
    attempt: mockAttempt,
    answers: {},
    setAnswers: vi.fn(),
    setResult: vi.fn(),
  } as any)
  vi.mocked(queries.useSaveAnswer).mockReturnValue({
    mutateAsync: vi.fn().mockResolvedValue({}),
    isPending: false,
    isError: false,
    error: null,
  } as any)
  vi.mocked(queries.useSubmitAttempt).mockReturnValue({
    mutateAsync: vi.fn().mockResolvedValue({ score: 1, details: [] }),
    isPending: false,
    isError: false,
    error: null,
  } as any)
})

describe('QuizPlayerPage', () => {
  it('redirects when attempt is null', () => {
    vi.mocked(contextModule.useQuizContext).mockReturnValue({
      attempt: null,
      answers: {},
      setAnswers: vi.fn(),
      setResult: vi.fn(),
    } as any)
    renderPage()
    expect(screen.queryByRole('button', { name: /next|submit/i })).not.toBeInTheDocument()
  })

  it('shows the current question and progress counter', () => {
    renderPage()
    expect(screen.getByText('What is 1 + 1?')).toBeInTheDocument()
    expect(screen.getByText('1 / 2')).toBeInTheDocument()
  })

  it('disables the Previous button on the first question', () => {
    renderPage()
    expect(screen.getByRole('button', { name: '← Previous' })).toBeDisabled()
  })

  it('shows "Next →" on non-last questions and not "Submit Quiz"', () => {
    renderPage()
    expect(screen.getByRole('button', { name: 'Next →' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Submit Quiz' })).not.toBeInTheDocument()
  })

  it('disables Next when no answer has been entered', () => {
    renderPage()
    expect(screen.getByRole('button', { name: 'Next →' })).toBeDisabled()
  })

  it('enables Next when an answer is present', () => {
    vi.mocked(contextModule.useQuizContext).mockReturnValue({
      attempt: mockAttempt,
      answers: { 1: 'some answer' },
      setAnswers: vi.fn(),
      setResult: vi.fn(),
    } as any)
    renderPage()
    expect(screen.getByRole('button', { name: 'Next →' })).toBeEnabled()
  })
})
