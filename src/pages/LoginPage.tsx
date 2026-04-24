import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { UserRole } from '../api/types'
import { authStore } from '../state/authStore'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [role, setRole] = useState<UserRole>('Buyer')
  const [email, setEmail] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)

  const canSubmit = useMemo(() => !!email && acceptTerms && acceptPrivacy, [email, acceptTerms, acceptPrivacy])

  return (
    <div className="min-h-dvh bg-slate-50 p-4 dark:bg-slate-950">
      <div className="mx-auto mt-10 w-full max-w-lg">
        <div className="role-ring rounded-2xl bg-white/80 p-6 backdrop-blur dark:bg-slate-900/60">
          <div className="text-xs font-semibold tracking-wide text-slate-500">RFQ AUCTIONS</div>
          <h1 className="mt-2 text-2xl font-bold">Login</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Backend integration-ready auth UI (JWT + role-based dashboard).
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (!canSubmit) return
              authStore.getState().login({
                token: 'demo.jwt.token',
                userId: 'usr-demo',
                role,
              })
              navigate(from, { replace: true })
            }}
          >
            <label className="block">
              <div className="text-sm font-semibold">Email</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300 dark:border-slate-700 dark:bg-slate-950"
              />
            </label>

            <label className="block">
              <div className="text-sm font-semibold">Role (for RBAC preview)</div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300 dark:border-slate-700 dark:bg-slate-950"
              >
                <option value="Admin">Admin</option>
                <option value="Seller">Seller</option>
                <option value="Buyer">Buyer</option>
              </select>
            </label>

            <div className="space-y-2">
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  I accept the <span className="role-accent">Terms of Service</span>.
                </span>
              </label>
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={acceptPrivacy}
                  onChange={(e) => setAcceptPrivacy(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  I accept the <span className="role-accent">Privacy Policy</span>.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white enabled:hover:bg-slate-800 disabled:opacity-40 dark:bg-slate-100 dark:text-slate-900 dark:enabled:hover:bg-white"
            >
              Continue
            </button>

            <p className="text-xs text-slate-500">
              This is a UI-only login. Replace with backend `/auth/login` when implemented.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

