import { isAxiosError } from 'axios'

export const getApiError = (error: unknown, fallback: string): string => {
  if (!error) return ''
  if (isAxiosError(error)) return error.response?.data?.message ?? error.message ?? fallback
  return fallback
}
