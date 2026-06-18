import { api } from '@/lib/axios'

export interface UpdateLeadBody {
  name?: string
  email?: string
  phone?: string
  status?: LeadStatus
}

export async function updateLead(id: string, body: UpdateLeadBody) {
  const response = await api.patch<Lead>(`/leads/${id}`, body)
  return response.data
}
