/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router'
import HomePage from './HomePage'
import * as queries from '@/queries'
import type { Quiz } from '@/types'

vi.mock('@/queries', () => ({ useQuizzes: vi.fn() }))

const mockNavigate = vi.hoisted(() => vi.fn())
vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router')
  return { ...actual, useNavigate: () => mockNavigate }
})

const renderPage = (route = '/quiz') =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/quiz" element={<HomePage />} />
        <Route path="/build" element={<HomePage />} />
      </Routes>
    </MemoryRouter>
  )

const mockQuiz: Quiz = {
  id: 1,
  title: 'JS Fundamentals',
  description: 'Test your JS',
  isPublished: true,
  createdAt: '2024-01-01',
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(queries.useQuizzes).mockReturnValue({
    data: undefined,
    isLoading: false,
    error: null,
  } as any)
})

describe('HomePage', () => {
  it('shows Player tab content at /quiz', () => {
    renderPage('/quiz')
    expect(screen.getByText('Play a quiz')).toBeInTheDocument()
    expect(screen.getByLabelText('Quiz ID')).toBeInTheDocument()
  })

  it('shows Builder tab content at /build', () => {
    renderPage('/build')
    expect(screen.getByText('Your quizzes')).toBeInTheDocument()
  })

  it('shows loading skeletons while quizzes are loading', () => {
    vi.mocked(queries.useQuizzes).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any)
    renderPage()
    expect(screen.getAllByTestId('quiz-card-loading').length).toBeGreaterThan(0)
  })

  it('shows error message when quizzes fail to load', () => {
    vi.mocked(queries.useQuizzes).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('fail'),
    } as any)
    renderPage()
    expect(screen.getByText('Failed to load quizzes.')).toBeInTheDocument()
  })

  it('shows empty state when there are no published quizzes', () => {
    vi.mocked(queries.useQuizzes).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any)
    renderPage()
    expect(screen.getByText('No quizzes yet')).toBeInTheDocument()
  })

  it('renders a quiz card for each published quiz', () => {
    vi.mocked(queries.useQuizzes).mockReturnValue({
      data: [mockQuiz],
      isLoading: false,
      error: null,
    } as any)
    renderPage()
    expect(screen.getByText('JS Fundamentals')).toBeInTheDocument()
  })

  it('navigates to the quiz when a valid ID is submitted', async () => {
    renderPage()
    await userEvent.type(screen.getByLabelText('Quiz ID'), '42')
    await userEvent.click(screen.getByRole('button', { name: 'Take Quiz' }))
    expect(mockNavigate).toHaveBeenCalledWith('/quiz/42')
  })

  it('shows a validation error for an invalid quiz ID', async () => {
    renderPage()
    await userEvent.type(screen.getByLabelText('Quiz ID'), 'abc')
    await userEvent.click(screen.getByRole('button', { name: 'Take Quiz' }))
    expect(screen.getByText('Enter a valid quiz ID (a positive number).')).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
