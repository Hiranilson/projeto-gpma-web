import { api } from '@/lib/axios'

export interface AuthenticateBody {
  email: string
  password: string
}

export interface AuthenticateResponse {
  access_token: string
  user: User
}

export async function authenticate(body: AuthenticateBody) {
  const response = await api.post('/users/authenticate', body)

  return response.data
}
