import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PromptDisplay from './PromptDisplay'

describe('PromptDisplay', () => {
  it('renders plain text', () => {
    render(<PromptDisplay prompt="What is 2 + 2?" />)
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument()
  })

  it('renders a code block inside a pre element', () => {
    const { container } = render(<PromptDisplay prompt={'```\nconsole.log(x)\n```'} />)
    const pre = container.querySelector('pre')
    expect(pre).toBeInTheDocument()
    expect(pre?.textContent).toContain('console.log(x)')
  })

  it('renders text with the code block', () => {
    const { container } = render(
      <PromptDisplay prompt={'Look at this:\n```\nconst x = 1\n```\nWhat is x?'} />
    )
    expect(container.textContent).toContain('Look at this:')
    expect(container.querySelector('pre')?.textContent).toContain('const x = 1')
    expect(container.textContent).toContain('What is x?')
  })
})
