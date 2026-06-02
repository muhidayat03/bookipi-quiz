import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import QuizForm from './QuizForm'

describe('QuizForm', () => {
  it('shows a skeleton and hides the form when isLoading is true', () => {
    render(<QuizForm onSubmit={vi.fn()} isLoading />)
    expect(screen.queryByLabelText(/title/i)).not.toBeInTheDocument()
  })

  it('shows "Create Quiz" when no defaultValues are provided', () => {
    render(<QuizForm onSubmit={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Create Quiz' })).toBeInTheDocument()
  })

  it('shows "Save Quiz" when editing an existing quiz', () => {
    render(<QuizForm onSubmit={vi.fn()} defaultValues={{ title: 'Existing Quiz' }} />)
    expect(screen.getByRole('button', { name: 'Save Quiz' })).toBeInTheDocument()
  })

  it('calls onSubmit with form values when valid', async () => {
    const onSubmit = vi.fn()
    render(<QuizForm onSubmit={onSubmit} />)
    await userEvent.type(screen.getByLabelText(/title/i), 'My Quiz')
    await userEvent.type(screen.getByLabelText(/description/i), 'A fun quiz')
    await userEvent.click(screen.getByRole('button', { name: 'Create Quiz' }))
    // react-hook-form calls onSubmit(data, event) — match first arg only
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        { title: 'My Quiz', description: 'A fun quiz' },
        expect.anything()
      )
    )
  })

  it('shows validation error when submitted with an empty title', async () => {
    render(<QuizForm onSubmit={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: 'Create Quiz' }))
    expect(await screen.findByText('A title is required.')).toBeInTheDocument()
  })

  it('disables the submit button and shows "Saving…" when isSubmitting', () => {
    render(<QuizForm onSubmit={vi.fn()} isSubmitting />)
    expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled()
  })

  it('shows the API error message', () => {
    render(<QuizForm onSubmit={vi.fn()} error="Failed to save quiz." />)
    expect(screen.getByText('Failed to save quiz.')).toBeInTheDocument()
  })
})
