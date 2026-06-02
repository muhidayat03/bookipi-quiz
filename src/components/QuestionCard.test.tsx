import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import QuestionCard from './QuestionCard'
import type { Question } from '@/types'

const mcqQuestion: Omit<Question, 'correctAnswer'> = {
  id: 1,
  quizId: 1,
  type: 'mcq',
  prompt: 'What does typeof null return?',
  options: ['object', 'null', 'undefined', 'string'],
  position: 1,
}

const shortQuestion: Omit<Question, 'correctAnswer'> = {
  id: 2,
  quizId: 1,
  type: 'short',
  prompt: 'What method parses JSON?',
  position: 2,
}

describe('QuestionCard', () => {
  it('renders MCQ prompt and all options', () => {
    render(<QuestionCard question={mcqQuestion} value="" onChange={vi.fn()} />)
    expect(screen.getByText('What does typeof null return?')).toBeInTheDocument()
    ;['object', 'null', 'undefined', 'string'].forEach((opt) =>
      expect(screen.getByText(opt)).toBeInTheDocument()
    )
  })

  it('calls onChange with the option index string when an MCQ option is clicked', async () => {
    const onChange = vi.fn()
    render(<QuestionCard question={mcqQuestion} value="" onChange={onChange} />)
    await userEvent.click(screen.getByText('null'))
    expect(onChange).toHaveBeenCalledWith('1')
  })

  it('renders a short answer input with the current value', () => {
    render(<QuestionCard question={shortQuestion} value="JSON.parse" onChange={vi.fn()} />)
    expect(screen.getByPlaceholderText('Type your answer…')).toHaveValue('JSON.parse')
  })

  it('calls onChange when typing in the short answer input', async () => {
    const onChange = vi.fn()
    render(<QuestionCard question={shortQuestion} value="" onChange={onChange} />)
    await userEvent.type(screen.getByPlaceholderText('Type your answer…'), 'a')
    expect(onChange).toHaveBeenCalledWith('a')
  })
})
