import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'

export default function StaffProtectedRoute({ children }) {
  const { isAuthenticated, isStaff } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!isStaff()) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
