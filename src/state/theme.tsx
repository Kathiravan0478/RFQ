/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

type ThemeContextValue = {
  mode: ThemeMode
  resolvedMode: 'light' | 'dark'
  setMode: (mode: ThemeMode) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'rfq.theme.v1'

function resolve(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'light' || mode === 'dark') return mode
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
    return stored ?? 'system'
  })

  const resolvedMode = useMemo(() => resolve(mode), [mode])

  useEffect(() => {
    const html = document.documentElement
    if (resolvedMode === 'dark') html.classList.add('dark')
    else html.classList.remove('dark')
    localStorage.setItem(STORAGE_KEY, mode)
  }, [mode, resolvedMode])

  useEffect(() => {
    if (mode !== 'system') return
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mq) return
    const handler = () => {
      const next = resolve('system')
      const html = document.documentElement
      if (next === 'dark') html.classList.add('dark')
      else html.classList.remove('dark')
    }
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [mode])

  const value: ThemeContextValue = useMemo(
    () => ({
      mode,
      resolvedMode,
      setMode: (m) => setModeState(m),
      toggle: () => setModeState((prev) => (resolve(prev) === 'dark' ? 'light' : 'dark')),
    }),
    [mode, resolvedMode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

