import { describe, it, expect } from 'vitest'
import { getApiError } from './index'

const makeAxiosError = (message: string, responseMessage?: string) =>
  Object.assign(new Error(message), {
    isAxiosError: true,
    response: responseMessage ? { data: { message: responseMessage } } : undefined,
  })

describe('getApiError', () => {
  it('returns empty string for a falsy error', () => {
    expect(getApiError(null, 'fallback')).toBe('')
    expect(getApiError(undefined, 'fallback')).toBe('')
  })

  it('returns response.data.message for an axios error with a response', () => {
    expect(getApiError(makeAxiosError('Request failed', 'Email already exists'), 'fallback')).toBe(
      'Email already exists'
    )
  })

  it('returns error.message when the axios error has no response', () => {
    expect(getApiError(makeAxiosError('Network Error'), 'fallback')).toBe('Network Error')
  })

  it('returns the fallback for a non-axios error', () => {
    expect(getApiError(new Error('unexpected'), 'fallback')).toBe('fallback')
  })
})
