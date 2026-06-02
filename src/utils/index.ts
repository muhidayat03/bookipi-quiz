import { isAxiosError } from 'axios'

export const getApiError = (error: unknown, fallback: string): string => {
  if (isAxiosError(error)) return error.response?.data?.message ?? error.message ?? fallback
  return fallback
}
