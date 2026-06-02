import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAntiCheat } from './useAntiCheat'
import * as api from '@/api'

vi.mock('@/api', () => ({ logEvent: vi.fn() }))

describe('useAntiCheat', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns zero counts initially', () => {
    const { result } = renderHook(() => useAntiCheat(1))
    expect(result.current).toEqual({ tabSwitches: 0, pastes: 0 })
  })

  it('does not attach event listeners when attemptId is null', () => {
    const spy = vi.spyOn(document, 'addEventListener')
    renderHook(() => useAntiCheat(null))
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  it('increments tabSwitches and logs window_blur when tab becomes hidden', () => {
    const { result } = renderHook(() => useAntiCheat(5))

    Object.defineProperty(document, 'hidden', { value: true, configurable: true })
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'))
    })

    expect(result.current.tabSwitches).toBe(1)
    expect(api.logEvent).toHaveBeenCalledWith(5, 'window_blur')

    Object.defineProperty(document, 'hidden', { value: false, configurable: true })
  })

  it('logs window_focus without incrementing when returning to the tab', () => {
    const { result } = renderHook(() => useAntiCheat(5))

    Object.defineProperty(document, 'hidden', { value: false, configurable: true })
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'))
    })

    expect(result.current.tabSwitches).toBe(0)
    expect(api.logEvent).toHaveBeenCalledWith(5, 'window_focus')
  })

  it('increments pastes and logs copy_paste_detected on paste', () => {
    const { result } = renderHook(() => useAntiCheat(5))

    act(() => {
      document.dispatchEvent(new Event('paste'))
    })

    expect(result.current.pastes).toBe(1)
    expect(api.logEvent).toHaveBeenCalledWith(5, 'copy_paste_detected')
  })

  it('resets counts when attemptId changes to null', () => {
    const { result, rerender } = renderHook(({ id }: { id: number | null }) => useAntiCheat(id), {
      initialProps: { id: 5 as number | null },
    })

    act(() => {
      document.dispatchEvent(new Event('paste'))
    })
    expect(result.current.pastes).toBe(1)

    rerender({ id: null })

    expect(result.current.tabSwitches).toBe(0)
    expect(result.current.pastes).toBe(0)
  })
})
