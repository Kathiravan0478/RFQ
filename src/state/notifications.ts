import { create } from 'zustand'

export type Toast = {
  id: string
  title: string
  message?: string
  createdAt: number
}

type NotificationState = {
  toasts: Toast[]
}

type NotificationActions = {
  push: (toast: Omit<Toast, 'id' | 'createdAt'>) => void
  remove: (id: string) => void
  clear: () => void
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const notificationStore = create<NotificationState & NotificationActions>((set) => ({
  toasts: [],
  push: (t) =>
    set((s) => ({
      toasts: [{ id: uid(), createdAt: Date.now(), ...t }, ...s.toasts].slice(0, 5),
    })),
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
  clear: () => set({ toasts: [] }),
}))

