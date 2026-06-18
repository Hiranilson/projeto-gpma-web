import { api } from '@/lib/axios'

// Body uses camelCase, while responses return snake_case.
export interface CreateClientBody {
  name: string
  email: string
  phone: string
  maritalStatus: string
  profession: string
  cpf: string
  rg: string
  issuingAgency: string
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

export interface CreateClientResponse {
  id: string
}

export async function createClient(body: CreateClientBody) {
  const response = await api.post<CreateClientResponse>('/clients', body)
  return response.data
}
