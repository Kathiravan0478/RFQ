import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { UserRole } from '../api/types'
import { register } from '../api/auth'

function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const r = err as { response?: { data?: { detail?: string } } }
    const d = r.response?.data?.detail
    if (typeof d === 'string') return d
  }
  if (err instanceof Error) return err.message
  return 'Registration failed'
}

export function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [role, setRole] = useState<UserRole>('Buyer')

  const mut = useMutation({
    mutationFn: () => register({ email, password, firstName, lastName, role }),
  })

  if (mut.isSuccess && mut.data) {
    return (
      <div className="min-h-dvh bg-slate-50 p-4 dark:bg-slate-950">
        <div className="mx-auto mt-10 w-full max-w-lg">
          <div className="role-ring rounded-2xl bg-white/80 p-6 backdrop-blur dark:bg-slate-900/60">
            <h1 className="text-xl font-bold">Account created</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Status: <span className="font-semibold">{mut.data.status}</span>. Buyers and sellers must be approved
              by an admin before login. The first <span className="font-semibold">Admin</span> may sign in while
              pending (bootstrap).
            </p>
            <Link
              to="/login"
              className="mt-6 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
            >
              Go to login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-slate-50 p-4 dark:bg-slate-950">
      <div className="mx-auto mt-10 w-full max-w-lg">
        <div className="role-ring rounded-2xl bg-white/80 p-6 backdrop-blur dark:bg-slate-900/60">
          <div className="text-xs font-semibold tracking-wide text-slate-500">RFQ AUCTIONS</div>
          <h1 className="mt-2 text-2xl font-bold">Register</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Maps to POST /auth/register on the API.</p>

          <form
            className="mt-6 grid gap-3"
            onSubmit={(e) => {
              e.preventDefault()
              mut.mutate()
            }}
          >
            <label className="block">
              <span className="text-sm font-semibold">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Password (min 8)</span>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold">First name</span>
                <input
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Last name</span>
                <input
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-semibold">Role</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              >
                <option value="Buyer">Buyer</option>
                <option value="Seller">Seller</option>
                <option value="Admin">Admin</option>
              </select>
            </label>

            {mut.isError ? <p className="text-sm text-red-600 dark:text-red-400">{getErrorMessage(mut.error)}</p> : null}

            <button
              type="submit"
              disabled={mut.isPending}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40 dark:bg-slate-100 dark:text-slate-900"
            >
              {mut.isPending ? 'Creating…' : 'Create account'}
            </button>
            <Link to="/login" className="text-center text-sm text-slate-600 underline dark:text-slate-400">
              Back to login
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}
