import { api } from '@/lib/axios'

export interface GetLeadsResponse {
  results: Lead[]
  meta: PaginationMeta
}

export async function getLeads(page = 1) {
  const response = await api.get<GetLeadsResponse>('/leads', { params: { page } })
  return response.data
}
