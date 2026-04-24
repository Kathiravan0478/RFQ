import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { authStore } from '../state/authStore'

function roleToDataRole(role: string) {
  if (role === 'Admin') return 'admin'
  if (role === 'Seller') return 'seller'
  return 'buyer'
}

export function RoleGuard({
  children,
  requireAuth = true,
}: {
  children: React.ReactNode
  requireAuth?: boolean
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const { authStatus, userRole } = authStore()

  useEffect(() => {
    document.documentElement.dataset.role = roleToDataRole(userRole)
  }, [userRole])

  useEffect(() => {
    if (!requireAuth) return
    if (authStatus === 'anonymous') {
      navigate('/login', { replace: true, state: { from: location.pathname } })
    }
  }, [authStatus, requireAuth, navigate, location.pathname])

  if (requireAuth && authStatus === 'anonymous') return null
  return <>{children}</>
}

