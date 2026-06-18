import { api } from '@/lib/axios'

export interface GetCasesResponse {
  results: Case[]
  meta: PaginationMeta
}

export async function getCases(page = 1) {
  const response = await api.get<GetCasesResponse>('/cases', { params: { page } })
  return response.data
}
