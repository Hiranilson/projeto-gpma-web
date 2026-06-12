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
}

export {}
