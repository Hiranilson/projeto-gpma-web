import { api } from '@/lib/axios'

export interface RequestResetPasswordRequest {
  email: string
}

export async function requestResetPassword(body: RequestResetPasswordRequest) {
  const response = await api.post('/users/forgot-password', body)

  return response.data
}
