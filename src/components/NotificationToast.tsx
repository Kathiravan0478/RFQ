import { useEffect } from 'react'
import { notificationStore } from '../state/notifications'

export function NotificationToast() {
  const { toasts, remove } = notificationStore()

  useEffect(() => {
    const timers = toasts.map((t) =>
      window.setTimeout(() => remove(t.id), Math.max(2500, 7000 - (Date.now() - t.createdAt))),
    )
    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [toasts, remove])

  return (
    <div className="fixed right-4 top-4 z-50 flex w-[min(420px,calc(100vw-2rem))] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="role-ring rounded-xl bg-white/90 p-3 shadow-sm backdrop-blur dark:bg-slate-900/80"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{t.title}</div>
              {t.message ? (
                <div className="mt-0.5 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                  {t.message}
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => remove(t.id)}
              className="rounded-lg px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Dismiss notification"
            >
              Dismiss
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

