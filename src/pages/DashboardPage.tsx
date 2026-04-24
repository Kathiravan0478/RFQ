import { Link } from 'react-router-dom'
import { authStore } from '../state/authStore'

function SellerCreateAuctionCard() {
  return (
    <div className="role-ring rounded-2xl bg-white/80 p-4 dark:bg-slate-900/60">
      <div className="text-sm font-semibold">Create Auction (Seller)</div>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Form stub for seamless integration with `POST /auctions`.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <input
          placeholder="RFQ name"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
        <input
          placeholder="Bid close time (ISO)"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
        <input
          placeholder="Forced close time (ISO)"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
        <button
          type="button"
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          Create (demo)
        </button>
      </div>
    </div>
  )
}

function BuyerActiveAuctionsCard() {
  return (
    <div className="role-ring rounded-2xl bg-white/80 p-4 dark:bg-slate-900/60">
      <div className="text-sm font-semibold">Active Auctions (Buyer)</div>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        List stub for seamless integration with `GET /auctions?status=Live`.
      </p>
      <div className="mt-4 space-y-2">
        <Link
          to="/auctions/evt-demo"
          className="block rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <div className="font-semibold">evt-demo</div>
            <div className="text-xs text-slate-500">View</div>
          </div>
          <div className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
            RFQ: Demo auction · live timer + bid list
          </div>
        </Link>
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { userRole } = authStore()

  return (
    <div className="space-y-4">
      <section className="role-ring rounded-2xl bg-white/80 p-4 dark:bg-slate-900/60">
        <div className="text-sm font-semibold">Overview</div>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Role-based UI differentiation active. Your current role is <span className="role-accent">{userRole}</span>.
        </p>
      </section>

      {userRole === 'Seller' ? <SellerCreateAuctionCard /> : null}
      {userRole === 'Buyer' ? <BuyerActiveAuctionsCard /> : null}
      {userRole === 'Admin' ? (
        <div className="role-ring rounded-2xl bg-white/80 p-4 dark:bg-slate-900/60">
          <div className="text-sm font-semibold">Admin Console</div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Placeholder for user approvals / platform settings.
          </p>
        </div>
      ) : null}
    </div>
  )
}

