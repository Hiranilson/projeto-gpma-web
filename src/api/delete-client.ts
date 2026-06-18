import { api } from '@/lib/axios'

export async function deleteClient(id: string) {
  const response = await api.delete(`/clients/${id}`)
  return response.data
}
