import { Navigate, Route, Routes } from 'react-router-dom'
import { NotificationToast } from './components/NotificationToast'
import { RoleGuard } from './components/RoleGuard'
import { DashboardLayout } from './layout/DashboardLayout'
import { AuctionDetailsPage } from './pages/AuctionDetailsPage'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

export default function App() {
  return (
    <>
      <NotificationToast />
      <Routes>
        <Route path="/login" element={<RoleGuard requireAuth={false}><LoginPage /></RoleGuard>} />
        <Route path="/register" element={<RoleGuard requireAuth={false}><RegisterPage /></RoleGuard>} />

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
