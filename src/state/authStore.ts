import { create } from 'zustand'
import type { AuthStatus, UserRole } from '../api/types'

type AuthState = {
  authStatus: AuthStatus
  userRole: UserRole
  token: string | null
  userId: string | null
}

type AuthActions = {
  login: (args: { token: string; userId: string; role: UserRole }) => void
  logout: () => void
  setRole: (role: UserRole) => void
}

const STORAGE_KEY = 'rfq.auth.v1'

function safeParseStored(): Partial<AuthState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Partial<AuthState>
  } catch {
    return null
  }
}

export const authStore = create<AuthState & AuthActions>((set, get) => {
  const stored = typeof window !== 'undefined' ? safeParseStored() : null

  const initial: AuthState = {
    authStatus: stored?.token ? 'authenticated' : 'anonymous',
    userRole: stored?.userRole ?? 'Buyer',
    token: stored?.token ?? null,
    userId: stored?.userId ?? null,
  }

  return {
    ...initial,
    login: ({ token, userId, role }) => {
      set({ token, userId, userRole: role, authStatus: 'authenticated' })
      const next = { ...get(), token, userId, userRole: role, authStatus: 'authenticated' as const }
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ token: next.token, userId: next.userId, userRole: next.userRole }),
      )
    },
    logout: () => {
      set({ token: null, userId: null, authStatus: 'anonymous' })
      localStorage.removeItem(STORAGE_KEY)
    },
    setRole: (role) => {
      set({ userRole: role })
      const next = get()
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ token: next.token, userId: next.userId, userRole: next.userRole }),
      )
    },
  }
})

