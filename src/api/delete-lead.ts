import { api } from '@/lib/axios'

export async function deleteLead(id: string) {
  const response = await api.delete(`/leads/${id}`)
  return response.data
}
