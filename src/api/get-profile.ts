import { api } from '@/lib/axios'

export interface GetProfileResponse {
  user: User
}

export async function getProfile() {
  const response = await api.get<GetProfileResponse>('/users/profile')

  return response.data
}
