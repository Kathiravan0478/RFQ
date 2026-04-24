import { apiClient } from './apiClient'
import type { UserRole } from './types'

export type LoginRequest = { email: string; password: string }
export type LoginResponse = { token: string; userId: string; role: UserRole }

export async function login(req: LoginRequest) {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', req)
  return data
}

export async function me() {
  const { data } = await apiClient.get<{ userId: string; role: UserRole; status: 'Pending' | 'Approved' }>(
    '/auth/me',
  )
  return data
}

