import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import QuestionForm from './QuestionForm'

describe('QuestionForm', () => {
  it('defaults to MCQ type with 4 option fields', () => {
    render(<QuestionForm onSubmit={vi.fn()} />)
    expect(screen.getByRole('radio', { name: /multiple choice/i })).toBeChecked()
    expect(screen.getAllByPlaceholderText(/^Option \d+$/)).toHaveLength(4)
  })

  it('switching to short answer shows the accepted answer field and hides option inputs', async () => {
    render(<QuestionForm onSubmit={vi.fn()} />)
    await userEvent.click(screen.getByRole('radio', { name: /short answer/i }))
    expect(screen.getByLabelText(/accepted answer/i)).toBeInTheDocument()
    expect(screen.queryByPlaceholderText(/^Option \d+$/)).not.toBeInTheDocument()
  })

  it('shows a prompt validation error when submitted empty', async () => {
    render(<QuestionForm onSubmit={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /add question/i }))
    expect(await screen.findByText('A question prompt is required.')).toBeInTheDocument()
  })

  it('shows a correct answer error when no MCQ option is selected', async () => {
    render(<QuestionForm onSubmit={vi.fn()} />)
    await userEvent.type(screen.getByLabelText(/prompt/i), 'Question?')
    const options = screen.getAllByPlaceholderText(/^Option \d+$/)
    for (const [i, opt] of options.entries()) {
      await userEvent.type(opt, `Choice ${i + 1}`)
    }
    await userEvent.click(screen.getByRole('button', { name: /add question/i }))
    expect(await screen.findByText('Select the correct answer')).toBeInTheDocument()
  })

  it('submits MCQ values and resets the prompt after success', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<QuestionForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText(/prompt/i), 'Question?')
    const options = screen.getAllByPlaceholderText(/^Option \d+$/)
    await userEvent.type(options[0], 'A')
    await userEvent.type(options[1], 'B')
    await userEvent.type(options[2], 'C')
    await userEvent.type(options[3], 'D')

    // The correctAnswerIndex radios have numeric values; type radios have 'mcq'/'short'
    const correctAnswerRadio = screen
      .getAllByRole('radio')
      .find((r) => (r as HTMLInputElement).value === '0')!
    await userEvent.click(correctAnswerRadio)
    await userEvent.click(screen.getByRole('button', { name: /add question/i }))

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'mcq', prompt: 'Question?', correctAnswerIndex: '0' })
      )
    )
    await waitFor(() => expect(screen.getByLabelText(/prompt/i)).toHaveValue(''))
  })

  it('submits short answer values', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<QuestionForm onSubmit={onSubmit} />)

    await userEvent.click(screen.getByRole('radio', { name: /short answer/i }))
    await userEvent.type(screen.getByLabelText(/prompt/i), 'What does typeof null return?')
    await userEvent.type(screen.getByLabelText(/accepted answer/i), 'object')
    await userEvent.click(screen.getByRole('button', { name: /add question/i }))

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'short',
          prompt: 'What does typeof null return?',
          correctAnswerText: 'object',
        })
      )
    )
  })

  it('adds a new option when the add option button is clicked', async () => {
    render(<QuestionForm onSubmit={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: '+ Add option' }))
    expect(screen.getAllByPlaceholderText(/^Option \d+$/)).toHaveLength(5)
  })

  it('removes an option when the remove button is clicked', async () => {
    render(<QuestionForm onSubmit={vi.fn()} />)
    await userEvent.click(screen.getAllByRole('button', { name: 'Remove option' })[0])
    expect(screen.getAllByPlaceholderText(/^Option \d+$/)).toHaveLength(3)
  })

  it('hides the add option button when 6 options exist', async () => {
    render(<QuestionForm onSubmit={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: '+ Add option' }))
    await userEvent.click(screen.getByRole('button', { name: '+ Add option' }))
    expect(screen.getAllByPlaceholderText(/^Option \d+$/)).toHaveLength(6)
    expect(screen.queryByRole('button', { name: '+ Add option' })).not.toBeInTheDocument()
  })

  it('calls onCancel when the cancel button is clicked', async () => {
    const onCancel = vi.fn()
    render(<QuestionForm onSubmit={vi.fn()} onCancel={onCancel} />)
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('shows error message and disables submit button when isLoading', () => {
    render(<QuestionForm onSubmit={vi.fn()} error="Failed to add question." isLoading />)
    expect(screen.getByText('Failed to add question.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled()
  })
})
