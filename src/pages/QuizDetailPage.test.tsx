/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router'
import QuizDetailPage from './QuizDetailPage'
import * as queries from '@/queries'
import * as contextModule from '@/context'
import type { Quiz } from '@/types'

vi.mock('@/queries', () => ({ useQuiz: vi.fn(), useStartAttempt: vi.fn() }))
vi.mock('@/context', () => ({ useQuizContext: vi.fn() }))

const mockNavigate = vi.hoisted(() => vi.fn())
vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router')
  return { ...actual, useNavigate: () => mockNavigate }
})

const renderPage = (id = '10') =>
  render(
    <MemoryRouter initialEntries={[`/quiz/${id}`]}>
      <Routes>
        <Route path="/quiz/:id" element={<QuizDetailPage />} />
      </Routes>
    </MemoryRouter>
  )

const mockQuiz: Quiz = {
  id: 10,
  title: 'Test Quiz',
  description: 'A quiz description',
  isPublished: true,
  createdAt: '2024-01-01',
  questions: [
    { id: 1, quizId: 10, type: 'mcq', prompt: 'Q1?', options: ['A', 'B'], correctAnswer: 0, position: 1 },
  ],
}

const mockSetAttempt = vi.fn()
const mockReset = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(contextModule.useQuizContext).mockReturnValue({ setAttempt: mockSetAttempt, reset: mockReset } as any)
  vi.mocked(queries.useQuiz).mockReturnValue({ data: mockQuiz, isLoading: false, isError: false, error: null, refetch: vi.fn() } as any)
  vi.mocked(queries.useStartAttempt).mockReturnValue({ mutateAsync: vi.fn().mockResolvedValue({ id: 99, quizId: 10 }), isPending: false, isError: false, error: null } as any)
})

describe('QuizDetailPage', () => {
  it('shows an error card for an invalid quiz ID', () => {
    renderPage('abc')
    expect(screen.getByText('Invalid quiz URL')).toBeInTheDocument()
  })

  it('shows a loading skeleton while the quiz is loading', () => {
    vi.mocked(queries.useQuiz).mockReturnValue({ data: undefined, isLoading: true, isError: false, error: null, refetch: vi.fn() } as any)
    renderPage()
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
  })

  it('shows an error card when the quiz fails to load', () => {
    vi.mocked(queries.useQuiz).mockReturnValue({ data: undefined, isLoading: false, isError: true, error: new Error('fail'), refetch: vi.fn() } as any)
    renderPage()
    expect(screen.getByText('Error loading quiz')).toBeInTheDocument()
  })

  it('renders the quiz title and question count', () => {
    renderPage()
    expect(screen.getByText('Test Quiz')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('Questions')).toBeInTheDocument()
  })

  it('disables Start Quiz when the quiz has no questions', () => {
    vi.mocked(queries.useQuiz).mockReturnValue({ data: { ...mockQuiz, questions: [] }, isLoading: false, isError: false, error: null, refetch: vi.fn() } as any)
    renderPage()
    expect(screen.getByRole('button', { name: 'Start Quiz' })).toBeDisabled()
  })

  it('stores the attempt and navigates to play on start', async () => {
    const mockAttempt = { id: 99, quizId: 10 }
    vi.mocked(queries.useStartAttempt).mockReturnValue({ mutateAsync: vi.fn().mockResolvedValue(mockAttempt), isPending: false, isError: false, error: null } as any)
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: 'Start Quiz' }))
    await waitFor(() => {
      expect(mockSetAttempt).toHaveBeenCalledWith(mockAttempt)
      expect(mockNavigate).toHaveBeenCalledWith('/quiz/10/play')
    })
  })
})
