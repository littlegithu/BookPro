import { useAuth } from '../../context/auth-context'
import DashboardPage from '../../pages/dashboard'
import DoctorDashboardPage from '../../pages/doctor/dashboard'
import StaffDashboardPage from '../../pages/staff-dashboard'

export default function RoleDashboard() {
  const { user, isStaff, staffRole } = useAuth()

  if (isStaff && staffRole()) return <StaffDashboardPage />
  if (user?.role === 'doctor' || user?.doctor) return <DoctorDashboardPage />
  return <DashboardPage />
}