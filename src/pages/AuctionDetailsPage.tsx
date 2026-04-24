import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { notificationStore } from '../state/notifications'

type DemoBid = { buyerId: string; amount: number; timestamp: number }

function formatMs(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, '0')}`
}

export function AuctionDetailsPage() {
  const { eventId = 'evt-demo' } = useParams()
  const push = notificationStore((s) => s.push)

  const [closeAt] = useState(() => Date.now() + 1000 * 60 * 5)
  const [now, setNow] = useState(() => Date.now())
  const [bids, setBids] = useState<DemoBid[]>(() => [
    { buyerId: 'buyer-102', amount: 1250, timestamp: Date.now() - 1000 * 80 },
    { buyerId: 'buyer-041', amount: 1310, timestamp: Date.now() - 1000 * 25 },
  ])

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [])

  const remainingMs = closeAt - now
  const isClosed = remainingMs <= 0

  const bestBid = useMemo(() => {
    if (bids.length === 0) return null
    return bids.reduce((acc, b) => (b.amount > acc.amount ? b : acc), bids[0])
  }, [bids])

  return (
    <div className="space-y-4">
      <section className="role-ring rounded-2xl bg-white/80 p-4 dark:bg-slate-900/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Auction Details</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Event: <span className="font-semibold">{eventId}</span>
            </div>
          </div>
          <div className="rounded-xl bg-slate-900 px-4 py-3 text-white dark:bg-slate-100 dark:text-slate-900">
            <div className="text-xs font-semibold opacity-80">Live timer</div>
            <div className="text-lg font-bold">{isClosed ? 'Closed' : formatMs(remainingMs)}</div>
          </div>
        </div>
      </section>

      <section className="role-ring rounded-2xl bg-white/80 p-4 dark:bg-slate-900/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Bid List</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Highest bid: {bestBid ? <span className="role-accent font-semibold">{bestBid.amount}</span> : '—'}
            </div>
          </div>
          <button
            type="button"
            disabled={isClosed}
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white enabled:hover:bg-slate-800 disabled:opacity-40 dark:bg-slate-100 dark:text-slate-900 dark:enabled:hover:bg-white"
            onClick={() => {
              const amount = Math.round((bestBid?.amount ?? 1000) + 10 + Math.random() * 25)
              const bid: DemoBid = { buyerId: 'buyer-you', amount, timestamp: Date.now() }
              setBids((s) => [bid, ...s])
              push({
                title: 'New bid received',
                message: `Bid ${amount} placed on ${eventId}. (Backend: emit async mail event)`,
              })
            }}
          >
            Place Bid (demo)
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950">
              <tr>
                <th className="px-3 py-2 font-semibold">Buyer</th>
                <th className="px-3 py-2 font-semibold">Amount</th>
                <th className="px-3 py-2 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-900/40">
              {bids.map((b, idx) => (
                <tr key={`${b.timestamp}-${idx}`}>
                  <td className="px-3 py-2">{b.buyerId}</td>
                  <td className="px-3 py-2 font-semibold">{b.amount}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                    {new Date(b.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
              {bids.length === 0 ? (
                <tr>
                  <td className="px-3 py-6 text-center text-slate-600 dark:text-slate-300" colSpan={3}>
                    No bids yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="role-ring rounded-2xl bg-white/80 p-4 dark:bg-slate-900/60">
        <div className="text-sm font-semibold">Extension Logic (backend-owned)</div>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Frontend displays the live `bidCloseTime` + `forcedCloseTime`. Backend cron/worker may extend bid close time
          within trigger window X by Y minutes (bounded by forced close).
        </p>
      </section>
    </div>
  )
}

