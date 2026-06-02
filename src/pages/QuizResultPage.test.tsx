/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router'
import QuizResultPage from './QuizResultPage'
import * as contextModule from '@/context'
import type { SubmitResult } from '@/types'

vi.mock('@/context', () => ({ useQuizContext: vi.fn() }))

const mockNavigate = vi.hoisted(() => vi.fn())
vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router')
  return { ...actual, useNavigate: () => mockNavigate }
})

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/quiz/1/results']}>
      <Routes>
        <Route path="/quiz/:id/results" element={<QuizResultPage />} />
      </Routes>
    </MemoryRouter>
  )

const makeResult = (score: number): SubmitResult => ({
  score,
  details: Array.from({ length: 10 }, (_, i) => ({
    questionId: i + 1,
    correct: i < score,
    expected: i >= score ? 'expected answer' : undefined,
  })),
})

const makeContext = (score: number, overrides: object = {}) => ({
  result: makeResult(score),
  attempt: null,
  antiCheat: { tabSwitches: 0, pastes: 0 },
  ...overrides,
})

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(contextModule.useQuizContext).mockReturnValue(makeContext(8) as any)
})

describe('QuizResultPage', () => {
  it('redirects when result is null', () => {
    vi.mocked(contextModule.useQuizContext).mockReturnValue({
      result: null,
      attempt: null,
      antiCheat: { tabSwitches: 0, pastes: 0 },
    } as any)
    renderPage()
    expect(screen.queryByText('Try Again')).not.toBeInTheDocument()
  })

  it('shows the score and total', () => {
    renderPage()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('/ 10')).toBeInTheDocument()
  })

  it('shows "Excellent work!" for scores ≥ 80%', () => {
    renderPage()
    expect(screen.getByText(/Excellent work!/)).toBeInTheDocument()
  })

  it('shows "Nice effort." for scores between 50% and 79%', () => {
    vi.mocked(contextModule.useQuizContext).mockReturnValue(makeContext(6) as any)
    renderPage()
    expect(screen.getByText(/Nice effort\./)).toBeInTheDocument()
  })

  it('shows "Keep practicing!" for scores below 50%', () => {
    vi.mocked(contextModule.useQuizContext).mockReturnValue(makeContext(4) as any)
    renderPage()
    expect(screen.getByText(/Keep practicing!/)).toBeInTheDocument()
  })

  it('shows correct and incorrect breakdown for each question', () => {
    vi.mocked(contextModule.useQuizContext).mockReturnValue({
      result: {
        score: 1,
        details: [
          { questionId: 1, correct: true },
          { questionId: 2, correct: false, expected: 'Paris' },
        ],
      },
      attempt: null,
      antiCheat: { tabSwitches: 0, pastes: 0 },
    } as any)
    renderPage()
    expect(screen.getByText('✓ Correct')).toBeInTheDocument()
    expect(screen.getByText('✗ Incorrect')).toBeInTheDocument()
    expect(screen.getByText('Paris')).toBeInTheDocument()
  })

  it('shows a suspicious activity warning when tab switches are detected', () => {
    vi.mocked(contextModule.useQuizContext).mockReturnValue(
      makeContext(8, { antiCheat: { tabSwitches: 2, pastes: 0 } }) as any
    )
    renderPage()
    expect(screen.getByText('Suspicious activity detected')).toBeInTheDocument()
    expect(screen.getByText('Tab switches: 2')).toBeInTheDocument()
  })

  it('clicking Try Again navigates back to the quiz detail page', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: 'Try Again' }))
    expect(mockNavigate).toHaveBeenCalledWith('/quiz/1', { replace: true })
  })
})
