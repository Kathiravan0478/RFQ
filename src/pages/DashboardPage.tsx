import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApproveAuction, useAuctions, useCreateAuction } from '../api/auctions'
import { authStore } from '../state/authStore'

function toIsoFromLocal(dtLocal: string) {
  if (!dtLocal) return ''
  const d = new Date(dtLocal)
  return Number.isNaN(d.getTime()) ? '' : d.toISOString()
}

function SellerCreateAuctionCard() {
  const create = useCreateAuction()
  const [rfqName, setRfqName] = useState('')
  const [startLocal, setStartLocal] = useState('')
  const [closeLocal, setCloseLocal] = useState('')
  const [forcedLocal, setForcedLocal] = useState('')

  return (
    <div className="role-ring rounded-2xl bg-white/80 p-4 dark:bg-slate-900/60">
      <div className="text-sm font-semibold">Create auction (Seller)</div>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">POST /auctions — new auctions start as Draft until an admin approves.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <input
          placeholder="RFQ name"
          value={rfqName}
          onChange={(e) => setRfqName(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
        <input
          type="datetime-local"
          value={startLocal}
          onChange={(e) => setStartLocal(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
        <input
          type="datetime-local"
          value={closeLocal}
          onChange={(e) => setCloseLocal(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
        <input
          type="datetime-local"
          value={forcedLocal}
          onChange={(e) => setForcedLocal(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
      </div>
      <p className="mt-2 text-xs text-slate-500">Fields: name · start · bid close · forced close (local time → ISO for API).</p>
      {create.isError ? (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {(() => {
            const e = create.error
            if (e && typeof e === 'object' && 'response' in e) {
              const d = (e as { response?: { data?: { detail?: string } } }).response?.data?.detail
              if (typeof d === 'string') return d
            }
            return e instanceof Error ? e.message : 'Create failed'
          })()}
        </p>
      ) : null}
      {create.isSuccess ? <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">Draft created. Ask an admin to publish.</p> : null}
      <button
        type="button"
        disabled={create.isPending}
        onClick={() => {
          const startTime = toIsoFromLocal(startLocal)
          const bidCloseTime = toIsoFromLocal(closeLocal)
          const forcedCloseTime = toIsoFromLocal(forcedLocal)
          if (!rfqName.trim() || !startTime || !bidCloseTime || !forcedCloseTime) return
          create.mutate({ rfqName: rfqName.trim(), startTime, bidCloseTime, forcedCloseTime })
        }}
        className="mt-4 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-40 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
      >
        {create.isPending ? 'Creating…' : 'Create draft'}
      </button>
    </div>
  )
}

function BuyerActiveAuctionsCard() {
  const q = useAuctions({ status: 'Live' })
  if (q.isLoading) return <p className="text-sm text-slate-600 dark:text-slate-300">Loading live auctions…</p>
  if (q.isError) return <p className="text-sm text-red-600 dark:text-red-400">Could not load auctions.</p>
  const rows = q.data ?? []
  if (rows.length === 0) {
    return <p className="text-sm text-slate-600 dark:text-slate-300">No live auctions. A seller must create one and an admin must approve it.</p>
  }
  return (
    <div className="space-y-2">
      {rows.map((a) => (
        <Link
          key={a.eventId}
          to={`/auctions/${a.eventId}`}
          className="block rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <div className="font-semibold">{a.rfqName}</div>
            <div className="text-xs text-slate-500">View</div>
          </div>
          <div className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">Closes {new Date(a.bidCloseTime).toLocaleString()}</div>
        </Link>
      ))}
    </div>
  )
}

function AdminDraftApprovalsCard() {
  const q = useAuctions({ status: 'Draft' })
  const approve = useApproveAuction()
  if (q.isLoading) return <p className="text-sm text-slate-600 dark:text-slate-300">Loading drafts…</p>
  if (q.isError) return <p className="text-sm text-red-600 dark:text-red-400">Could not load drafts.</p>
  const rows = q.data ?? []
  if (rows.length === 0) {
    return <p className="text-sm text-slate-600 dark:text-slate-300">No draft auctions pending approval.</p>
  }
  return (
    <div className="space-y-2">
      {rows.map((a) => (
        <div
          key={a.eventId}
          className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
        >
          <div>
            <div className="font-semibold">{a.rfqName}</div>
            <div className="text-xs text-slate-500">{a.eventId}</div>
          </div>
          <button
            type="button"
            disabled={approve.isPending}
            onClick={() => approve.mutate(a.eventId)}
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
          >
            Approve (go Live)
          </button>
        </div>
      ))}
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
          Role-based dashboard. You are signed in as <span className="role-accent">{userRole}</span>.
        </p>
      </section>

      {userRole === 'Seller' ? <SellerCreateAuctionCard /> : null}
      {userRole === 'Buyer' || userRole === 'Admin' ? (
        <div className="role-ring rounded-2xl bg-white/80 p-4 dark:bg-slate-900/60">
          <div className="text-sm font-semibold">Live auctions</div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">GET /auctions?status=Live</p>
          <div className="mt-4">
            <BuyerActiveAuctionsCard />
          </div>
        </div>
      ) : null}
      {userRole === 'Admin' ? (
        <div className="role-ring rounded-2xl bg-white/80 p-4 dark:bg-slate-900/60">
          <div className="text-sm font-semibold">Draft approvals (Admin)</div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">PUT /auctions/:id/approve — also approve new users in API docs if needed.</p>
          <div className="mt-4">
            <AdminDraftApprovalsCard />
          </div>
        </div>
      ) : null}
    </div>
  )
}
