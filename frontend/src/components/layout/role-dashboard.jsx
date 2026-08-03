import { useAuth } from '../../context/auth-context'
import DashboardPage from '../../pages/dashboard'
import DoctorDashboardPage from '../../pages/doctor-dashboard'

export default function RoleDashboard() {
  const { user } = useAuth()
  if (user?.role === 'doctor') return <DoctorDashboardPage />
  return <DashboardPage />
}
