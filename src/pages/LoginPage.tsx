import { useMutation } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { login, updateProfile } from '../api/auth'
import { authStore } from '../state/authStore'

function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const r = err as { response?: { data?: { detail?: string } } }
    const d = r.response?.data?.detail
    if (typeof d === 'string') return d
  }
  if (err instanceof Error) return err.message
  return 'Login failed'
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)

  const canSubmit = useMemo(
    () => !!email && !!password && acceptTerms && acceptPrivacy,
    [email, password, acceptTerms, acceptPrivacy],
  )

  const loginMutation = useMutation({
    mutationFn: async () => {
      const session = await login({ email, password })
      authStore.getState().login(session)
      if (acceptTerms) {
        await updateProfile({ consentTerms: true })
      }
    },
    onSuccess: () => navigate(from, { replace: true }),
  })

  return (
    <div className="min-h-dvh bg-slate-50 p-4 dark:bg-slate-950">
      <div className="mx-auto mt-10 w-full max-w-lg">
        <div className="role-ring rounded-2xl bg-white/80 p-6 backdrop-blur dark:bg-slate-900/60">
          <div className="text-xs font-semibold tracking-wide text-slate-500">RFQ AUCTIONS</div>
          <h1 className="mt-2 text-2xl font-bold">Login</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Authenticates against the FastAPI backend (<code className="text-xs">POST /auth/login</code>).
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (!canSubmit) return
              loginMutation.reset()
              loginMutation.mutate()
            }}
          >
            <label className="block">
              <div className="text-sm font-semibold">Email</div>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300 dark:border-slate-700 dark:bg-slate-950"
              />
            </label>

            <label className="block">
              <div className="text-sm font-semibold">Password</div>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300 dark:border-slate-700 dark:bg-slate-950"
              />
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
                  I accept the <span className="role-accent">Terms of Service</span> (recorded via{' '}
                  <code className="text-xs">PUT /auth/profile</code>).
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

            {loginMutation.isError ? (
              <p className="text-sm text-red-600 dark:text-red-400">{getErrorMessage(loginMutation.error)}</p>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmit || loginMutation.isPending}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white enabled:hover:bg-slate-800 disabled:opacity-40 dark:bg-slate-100 dark:text-slate-900 dark:enabled:hover:bg-white"
            >
              {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
            </button>

            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              No account?{' '}
              <Link to="/register" className="role-accent font-semibold underline-offset-2 hover:underline">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
