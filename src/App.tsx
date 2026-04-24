import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { NotificationToast } from './components/NotificationToast'
import { RoleGuard } from './components/RoleGuard'
import { DashboardLayout } from './layout/DashboardLayout'
import { AuctionDetailsPage } from './pages/AuctionDetailsPage'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { notificationStore } from './state/notifications'

export default function App() {
  const push = notificationStore((s) => s.push)

  useEffect(() => {
    const id = window.setInterval(() => {
      push({
        title: 'Simulated backend alert',
        message: 'Example: “New bid placed” / “Auction closing soon” (replace with WS/SSE/queue-driven events).',
      })
    }, 25_000)
    return () => window.clearInterval(id)
  }, [push])

  return (
    <>
      <NotificationToast />
      <Routes>
        <Route path="/login" element={<RoleGuard requireAuth={false}><LoginPage /></RoleGuard>} />

        <Route
          path="/"
          element={
            <RoleGuard>
              <DashboardLayout />
            </RoleGuard>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="auctions/:eventId" element={<AuctionDetailsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
