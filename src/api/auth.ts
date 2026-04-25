import { apiClient } from './apiClient'
import type { UserRole } from './types'

export type LoginRequest = { email: string; password: string }

/** FastAPI returns OAuth2-style token fields; the UI stores `token` in authStore. */
type LoginApiResponse = {
  access_token: string
  token_type: string
  userId: string
  role: UserRole
}

export type LoginResult = { token: string; userId: string; role: UserRole }

export async function login(req: LoginRequest): Promise<LoginResult> {
  const { data } = await apiClient.post<LoginApiResponse>('/auth/login', req)
  return { token: data.access_token, userId: data.userId, role: data.role }
}

export type RegisterRequest = {
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
}

export type RegisterResponse = {
  userId: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  status: string
}

export async function register(req: RegisterRequest) {
  const { data } = await apiClient.post<RegisterResponse>('/auth/register', req)
  return data
}

export async function updateProfile(body: { firstName?: string; lastName?: string; consentTerms?: boolean }) {
  const { data } = await apiClient.put<{
    userId: string
    role: UserRole
    status: string
    consentTerms: boolean
  }>('/auth/profile', body)
  return data
}

export async function me() {
  const { data } = await apiClient.get<{
    userId: string
    role: UserRole
    status: 'Pending' | 'Approved' | 'Rejected' | 'Suspended'
    consentTerms?: boolean
  }>('/auth/me')
  return data
}

