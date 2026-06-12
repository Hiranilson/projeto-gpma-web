import { api } from '@/lib/axios'

export interface UpdateUserRoleBody {
  role: UserRole
}

export type UpdateUserRoleResponse = User

export async function updateUserRole(id: string, body: UpdateUserRoleBody) {
  const response = await api.patch<UpdateUserRoleResponse>(`/users/${id}`, body)
  return response.data
}
