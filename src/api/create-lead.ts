import { api } from '@/lib/axios'

export interface CreateLeadBody {
  name: string
  email: string
  phone: string
  status?: LeadStatus
}

export interface CreateLeadResponse {
  id: string
}

export async function createLead(body: CreateLeadBody) {
  const response = await api.post<CreateLeadResponse>('/leads', body)
  return response.data
}
