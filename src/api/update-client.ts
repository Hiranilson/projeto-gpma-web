import { api } from '@/lib/axios'
import type { CreateClientBody } from './create-client'

// Any subset of the create fields (camelCase).
export type UpdateClientBody = Partial<CreateClientBody>

export async function updateClient(id: string, body: UpdateClientBody) {
  const response = await api.patch<Client>(`/clients/${id}`, body)
  return response.data
}
