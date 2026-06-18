declare global {
  type ExtractValueOf<T> = T extends string
    ? T
    : { [K in keyof T]: ExtractValueOf<T[K]> }[keyof T]

  interface ErrorResponse {
    message: string
    statusCode: number
  }

  type UserRole = 'ADMIN' | 'LAWYER' | 'CLIENT'

  interface User {
    created_at: string
    email: string
    id: string
    name: string
    role: UserRole
  }

  interface PaginationMeta {
    currentPage: number
    perPage: number
    totalCount: number
    totalPages: number
  }

  type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'LOST' | 'COMPLETED'

  interface Lead {
    id: string
    name: string
    email: string
    phone: string
    status: LeadStatus
    created_at: string
    updated_at: string
  }

  interface Client {
    id: string
    name: string
    email: string
    phone: string
    marital_status: string
    profession: string
    cpf: string
    rg: string
    issuing_agency: string
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    zip_code: string
    created_at: string
    updated_at: string
  }

  type CaseStatus = 'OPEN' | 'CLOSED' | 'PENDING'

  interface Case {
    id: string
    title: string
    description: string
    status: CaseStatus
    client_id: string
    created_at: string
    updated_at: string
  }
}

export {}
