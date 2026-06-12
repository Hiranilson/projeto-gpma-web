import { api } from '@/lib/axios'

export interface GetUsersMeta {
  currentPage: number
  totalCount: number
  perPage: number
  totalPages: number
}

export interface GetUsersResponse {
  results: User[]
  meta: GetUsersMeta
}

export async function getUsers(page = 1) {
  const response = await api.get<GetUsersResponse>('/users', { params: { page } })
  return response.data
}
