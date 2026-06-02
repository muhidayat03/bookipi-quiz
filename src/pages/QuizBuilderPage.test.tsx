/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router'
import QuizBuilderPage from './QuizBuilderPage'
import * as queries from '@/queries'
import type { Quiz } from '@/types'

vi.mock('@/queries', () => ({
  useQuiz: vi.fn(),
  useCreateQuiz: vi.fn(),
  useUpdateQuiz: vi.fn(),
  useAddQuestion: vi.fn(),
  useDeleteQuestion: vi.fn(),
  useUpdateQuestion: vi.fn(),
}))

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router')
  return { ...actual, useNavigate: () => vi.fn() }
})

const mockMutation = {
  mutate: vi.fn(),
  mutateAsync: vi.fn().mockResolvedValue({}),
  isPending: false,
  isError: false,
  error: null,
  variables: undefined,
}

const mockQuiz: Quiz = {
  id: 5,
  title: 'My Quiz',
  description: 'A quiz',
  isPublished: true,
  createdAt: '2024-01-01',
  questions: [],
}

const renderPage = (route = '/builder') =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/builder" element={<QuizBuilderPage />} />
        <Route path="/builder/:id" element={<QuizBuilderPage />} />
      </Routes>
    </MemoryRouter>
  )

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(queries.useQuiz).mockReturnValue({
    data: mockQuiz,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  } as any)
  vi.mocked(queries.useCreateQuiz).mockReturnValue(mockMutation as any)
  vi.mocked(queries.useUpdateQuiz).mockReturnValue(mockMutation as any)
  vi.mocked(queries.useAddQuestion).mockReturnValue(mockMutation as any)
  vi.mocked(queries.useDeleteQuestion).mockReturnValue(mockMutation as any)
  vi.mocked(queries.useUpdateQuestion).mockReturnValue(mockMutation as any)
})

describe('QuizBuilderPage', () => {
  it('shows "Create quiz" heading in create mode', () => {
    renderPage('/builder')
    expect(screen.getByText('Create quiz')).toBeInTheDocument()
  })

  it('shows "Edit quiz" heading in edit mode', () => {
    renderPage('/builder/5')
    expect(screen.getByText('Edit quiz')).toBeInTheDocument()
  })

  it('shows an error card when the quiz fails to load', () => {
    vi.mocked(queries.useQuiz).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('fail'),
      refetch: vi.fn(),
    } as any)
    renderPage('/builder/5')
    expect(screen.getByText('Failed to load quiz')).toBeInTheDocument()
  })

  it('shows the question section in edit mode when loaded', () => {
    renderPage('/builder/5')
    expect(screen.getByText(/Questions \(\d+\)/)).toBeInTheDocument()
  })
})
