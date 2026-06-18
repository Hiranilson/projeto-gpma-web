import { api } from '@/lib/axios'

export async function deleteCase(id: string) {
  const response = await api.delete(`/cases/${id}`)
  return response.data
}
