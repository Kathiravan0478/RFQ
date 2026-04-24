import { Link, NavLink, Outlet } from 'react-router-dom'
import { ThemeToggle } from '../components/ThemeToggle'
import { authStore } from '../state/authStore'

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'block rounded-lg px-3 py-2 text-sm font-medium',
          isActive
            ? 'role-ring bg-white dark:bg-slate-900'
            : 'text-slate-700 hover:bg-white/70 dark:text-slate-200 dark:hover:bg-slate-900/60',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  )
}

export function DashboardLayout() {
  const { userRole, logout } = authStore()

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 p-4 md:grid-cols-[260px_1fr]">
        <aside className="role-ring rounded-2xl bg-white/80 p-4 backdrop-blur dark:bg-slate-900/60">
          <Link to="/" className="block">
            <div className="text-xs font-semibold tracking-wide text-slate-500">RFQ AUCTIONS</div>
            <div className="mt-1 text-lg font-bold">
              Dashboard <span className="role-accent">· {userRole}</span>
            </div>
          </Link>

          <nav className="mt-4 space-y-1">
            <NavItem to="/" label="Overview" />
            <NavItem to="/auctions/evt-demo" label="Auction Details" />
          </nav>

          <div className="mt-6 border-t border-slate-200/60 pt-4 dark:border-slate-700/60">
            <button
              type="button"
              onClick={logout}
              className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="space-y-4">
          <header className="role-ring flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/80 p-4 backdrop-blur dark:bg-slate-900/60">
            <div className="min-w-0">
              <div className="text-sm font-semibold">RFQ Auction System</div>
              <div className="truncate text-sm text-slate-600 dark:text-slate-300">
                UI separated from API layer for microservices integration
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="role-ring rounded-lg bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800"
                aria-label="Notification center"
                title="Notification Center"
              >
                Notifications
              </button>
              <ThemeToggle />
            </div>
          </header>

          <Outlet />
        </main>
      </div>
    </div>
  )
}

