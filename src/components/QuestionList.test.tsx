/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import QuestionList from './QuestionList'
import * as queries from '@/queries'
import type { Question } from '@/types'

vi.mock('@/queries', () => ({
  useDeleteQuestion: vi.fn(),
  useUpdateQuestion: vi.fn(),
}))

const questions: Question[] = [
  {
    id: 1,
    quizId: 10,
    type: 'mcq',
    prompt: 'What does typeof null return?',
    options: ['object', 'null', 'undefined'],
    correctAnswer: 0,
    position: 1,
  },
  {
    id: 2,
    quizId: 10,
    type: 'short',
    prompt: 'What method parses JSON?',
    correctAnswer: 'JSON.parse',
    position: 2,
  },
]

let mockDeleteMutate: ReturnType<typeof vi.fn>
let mockUpdateMutateAsync: ReturnType<typeof vi.fn>

beforeEach(() => {
  mockDeleteMutate = vi.fn()
  mockUpdateMutateAsync = vi.fn().mockResolvedValue(undefined)

  vi.mocked(queries.useDeleteQuestion).mockReturnValue({
    mutate: mockDeleteMutate,
    isError: false,
    variables: undefined,
    error: null,
  } as any)
  vi.mocked(queries.useUpdateQuestion).mockReturnValue({
    mutateAsync: mockUpdateMutateAsync,
    isPending: false,
    isError: false,
    error: null,
  } as any)
})

const defaultProps = {
  quizId: 10,
  editingQuestionId: null,
  setEditingQuestionId: vi.fn(),
}

describe('QuestionList', () => {
  it('shows an empty state when there are no questions', () => {
    render(<QuestionList {...defaultProps} questions={[]} />)
    expect(screen.getByText('No questions yet')).toBeInTheDocument()
  })

  it('renders question prompts and type badges', () => {
    render(<QuestionList {...defaultProps} questions={questions} />)
    expect(screen.getByText('What does typeof null return?')).toBeInTheDocument()
    expect(screen.getByText('What method parses JSON?')).toBeInTheDocument()
    expect(screen.getByText('Multiple choice')).toBeInTheDocument()
    expect(screen.getByText('Short answer')).toBeInTheDocument()
  })

  it('renders MCQ options', () => {
    render(<QuestionList {...defaultProps} questions={[questions[0]]} />)
    ;['object', 'null', 'undefined'].forEach((opt) =>
      expect(screen.getByText(new RegExp(`^${opt}`))).toBeInTheDocument()
    )
  })

  it('renders the accepted answer for short answer questions', () => {
    render(<QuestionList {...defaultProps} questions={[questions[1]]} />)
    expect(screen.getByText('JSON.parse')).toBeInTheDocument()
  })

  it('calls setEditingQuestionId with the question id when edit is clicked', async () => {
    const setEditingQuestionId = vi.fn()
    render(<QuestionList {...defaultProps} questions={questions} setEditingQuestionId={setEditingQuestionId} />)
    await userEvent.click(screen.getAllByTitle('Edit')[0])
    expect(setEditingQuestionId).toHaveBeenCalledWith(1)
  })

  it('calls deleteQuestion.mutate with the question id when delete is clicked', async () => {
    render(<QuestionList {...defaultProps} questions={questions} />)
    await userEvent.click(screen.getAllByTitle('Delete')[0])
    expect(mockDeleteMutate).toHaveBeenCalledWith(1)
  })

  it('shows the edit form when editingQuestionId matches a question', () => {
    render(<QuestionList {...defaultProps} questions={questions} editingQuestionId={1} />)
    expect(screen.getByText(/editing question 1/i)).toBeInTheDocument()
  })

  it('calls setEditingQuestionId with null when cancel is clicked in edit mode', async () => {
    const setEditingQuestionId = vi.fn()
    render(<QuestionList {...defaultProps} questions={questions} editingQuestionId={1} setEditingQuestionId={setEditingQuestionId} />)
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(setEditingQuestionId).toHaveBeenCalledWith(null)
  })
})
