declare global {
  type ExtractValueOf<T> = T extends string
    ? T
    : { [K in keyof T]: ExtractValueOf<T[K]> }[keyof T]

  interface ErrorResponse {
    message: string
    statusCode: number
  }

  interface User {
    created_at: string
    email: string
    id: string
    name: 'ADMIN' | 'CLIENT' | 'LAWYER'
    role: string
  }
}

export {}
