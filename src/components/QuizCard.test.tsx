import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import QuizCard from './QuizCard'
import type { Quiz } from '@/types'

const quiz: Quiz = {
  id: 42,
  title: 'JavaScript Fundamentals',
  description: 'Test your JS knowledge',
  isPublished: false,
  createdAt: '2024-01-01',
}

describe('QuizCard', () => {
  it('renders quiz title, description, and ID', () => {
    render(<QuizCard quiz={quiz} action={null} />)
    expect(screen.getByText('JavaScript Fundamentals')).toBeInTheDocument()
    expect(screen.getByText('Test your JS knowledge')).toBeInTheDocument()
    expect(screen.getByText(/Quiz ID: 42/)).toBeInTheDocument()
  })

  it('renders the action slot', () => {
    render(<QuizCard quiz={quiz} action={<button>Take Quiz</button>} />)
    expect(screen.getByRole('button', { name: 'Take Quiz' })).toBeInTheDocument()
  })

  it('renders the loading skeleton', () => {
    render(<QuizCard.Loading />)
    expect(screen.getByTestId('quiz-card-loading')).toBeInTheDocument()
  })
})
