export type UserRole = 'ADMIN'

export interface AuthUser {
  id: string
  email: string
  name?: string
  role: UserRole
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  user: AuthUser
}

export interface MeResponse {
  success: boolean
  user: AuthUser
}

export interface LogoutResponse {
  success: boolean
  message: string
}
