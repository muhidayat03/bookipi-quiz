import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ErrorCard from './ErrorCard'

describe('ErrorCard', () => {
  it('renders the title', () => {
    render(<ErrorCard title="Something went wrong" />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('renders message when provided', () => {
    render(<ErrorCard title="Error" message="Please try again later" />)
    expect(screen.getByText('Please try again later')).toBeInTheDocument()
  })

  it('does not render message when omitted', () => {
    render(<ErrorCard title="Error" />)
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument()
  })

  it('renders retry button when onRetry is provided', () => {
    render(<ErrorCard title="Error" onRetry={() => {}} />)
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })

  it('does not render retry button when onRetry is omitted', () => {
    render(<ErrorCard title="Error" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('calls onRetry when retry button is clicked', async () => {
    const onRetry = vi.fn()
    render(<ErrorCard title="Error" onRetry={onRetry} />)
    await userEvent.click(screen.getByRole('button', { name: /retry/i }))
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
