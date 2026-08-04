import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'

export default function DoctorProtectedRoute({ children }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const isDoctor = user?.role === 'doctor' || !!user?.doctor
  if (!isDoctor) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
