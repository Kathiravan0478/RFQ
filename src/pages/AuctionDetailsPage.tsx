import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuction } from '../api/auctions'
import { useBids, usePlaceBid } from '../api/bids'
import { authStore } from '../state/authStore'
import { notificationStore } from '../state/notifications'

function formatMs(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, '0')}`
}

function bidErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const r = err as { response?: { data?: { detail?: string } } }
    const d = r.response?.data?.detail
    if (typeof d === 'string') return d
  }
  if (err instanceof Error) return err.message
  return 'Bid failed'
}

export function AuctionDetailsPage() {
  const { eventId = '' } = useParams()
  const { userRole } = authStore()
  const push = notificationStore((s) => s.push)

  const auctionQ = useAuction(eventId)
  const bidsQ = useBids(eventId)
  const [now, setNow] = useState(() => Date.now())
  const [amount, setAmount] = useState('')

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 500)
    return () => window.clearInterval(id)
  }, [])

  const auction = auctionQ.data

  const { remainingMs, isClosed } = useMemo(() => {
    if (!auction) return { remainingMs: 0, isClosed: true }
    const forcedEnd = new Date(auction.forcedCloseTime).getTime()
    const bidEnd = new Date(auction.bidCloseTime).getTime()
    const end = Math.min(forcedEnd, bidEnd)
    const rem = end - now
    const closed = auction.status !== 'Live' || now >= forcedEnd
    return { remainingMs: rem, isClosed: closed }
  }, [auction, now])

  const bidMut = usePlaceBid()

  const canBid = userRole === 'Buyer' && !isClosed && auction?.status === 'Live'

  if (!eventId) {
    return <p className="text-sm text-slate-600 dark:text-slate-300">Missing auction id.</p>
  }

  if (auctionQ.isLoading) {
    return <p className="text-sm text-slate-600 dark:text-slate-300">Loading auction…</p>
  }

  if (auctionQ.isError || !auction) {
    return <p className="text-sm text-red-600 dark:text-red-400">Auction not found or inaccessible.</p>
  }

  const rows = bidsQ.data ?? []

  return (
    <div className="space-y-4">
      <section className="role-ring rounded-2xl bg-white/80 p-4 dark:bg-slate-900/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Auction</div>
            <div className="text-lg font-bold">{auction.rfqName}</div>
            <div className="text-xs text-slate-500">Status: {auction.status}</div>
          </div>
          <div className="rounded-xl bg-slate-900 px-4 py-3 text-white dark:bg-slate-100 dark:text-slate-900">
            <div className="text-xs font-semibold opacity-80">Time remaining</div>
            <div className="text-lg font-bold">{isClosed ? 'Closed' : formatMs(remainingMs)}</div>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Bid close: {new Date(auction.bidCloseTime).toLocaleString()} · Forced:{' '}
          {new Date(auction.forcedCloseTime).toLocaleString()}
          {auction.currentHighestAmount != null ? (
            <>
              {' '}
              · High:{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-200">{auction.currentHighestAmount}</span>
            </>
          ) : null}
        </p>
      </section>

      <section className="role-ring rounded-2xl bg-white/80 p-4 dark:bg-slate-900/60">
        <div className="text-sm font-semibold">Place bid</div>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          POST /bids — requires Buyer role and terms consent on your profile.
        </p>
        {!canBid ? (
          <p className="mt-2 text-sm text-slate-500">
            {userRole !== 'Buyer'
              ? 'Switch to a Buyer account to place bids.'
              : isClosed
                ? 'This auction is not accepting bids.'
                : null}
          </p>
        ) : (
          <div className="mt-3 flex flex-wrap items-end gap-2">
            <label className="block">
              <span className="text-xs font-semibold text-slate-500">Amount</span>
              <input
                type="number"
                min={1}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 w-40 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </label>
            <button
              type="button"
              disabled={bidMut.isPending || !amount}
              onClick={() => {
                bidMut.mutate(
                  { eventId, amount: Number(amount) },
                  {
                    onSuccess: (bid) => {
                      push({
                        title: 'Bid placed',
                        message: `Amount ${bid.amount} recorded.`,
                      })
                      setAmount('')
                    },
                  },
                )
              }}
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-40 dark:bg-slate-100 dark:text-slate-900"
            >
              {bidMut.isPending ? 'Submitting…' : 'Submit bid'}
            </button>
          </div>
        )}
        {bidMut.isError ? <p className="mt-2 text-sm text-red-600 dark:text-red-400">{bidErrorMessage(bidMut.error)}</p> : null}
      </section>

      <section className="role-ring rounded-2xl bg-white/80 p-4 dark:bg-slate-900/60">
        <div className="text-sm font-semibold">Bid list</div>
        <p className="mt-1 text-xs text-slate-500">GET /bids?eventId=… (poll every 5s)</p>
        {bidsQ.isLoading ? <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Loading bids…</p> : null}
        {bidsQ.isError ? <p className="mt-4 text-sm text-red-600 dark:text-red-400">Could not load bids.</p> : null}
        {!bidsQ.isLoading && !bidsQ.isError ? (
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
                {rows.map((b) => (
                  <tr key={b.bidId}>
                    <td className="px-3 py-2">{b.buyerId}</td>
                    <td className="px-3 py-2 font-semibold">{b.amount}</td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                      {new Date(b.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {rows.length === 0 ? (
                  <tr>
                    <td className="px-3 py-6 text-center text-slate-600 dark:text-slate-300" colSpan={3}>
                      No bids yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  )
}
