import type { AxiosError } from 'axios'

interface ApiErrorData {
  message?: string
  issues?: { message: string }[]
}

/**
 * Extracts the backend error message to show the user.
 *
 * - On validation errors (400) the API sends an `issues` array — we join those
 *   field messages, since `message` is just the generic "Validation error.".
 * - Otherwise we surface `response.data.message` (covers 401/403/404/409/500).
 * - Falls back to a friendly default — e.g. on network errors with no response.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  const data = (error as AxiosError<ApiErrorData>)?.response?.data

  if (data?.issues?.length) {
    return data.issues.map((issue) => issue.message).join(' ')
  }

  return data?.message || fallback
}
