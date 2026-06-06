import { api } from '@/lib/axios'

export interface ResetPasswordBody {
  password: string
  token: string
}

export async function resetPassword(body: ResetPasswordBody) {
  const response = await api.post('/users/reset-password', body)

  return response.data
}
