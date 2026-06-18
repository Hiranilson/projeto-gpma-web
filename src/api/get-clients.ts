import { api } from '@/lib/axios'

export interface GetClientsResponse {
  results: Client[]
  meta: PaginationMeta
}

export async function getClients(page = 1) {
  const response = await api.get<GetClientsResponse>('/clients', { params: { page } })
  return response.data
}
