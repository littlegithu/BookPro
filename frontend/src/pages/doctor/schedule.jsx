import { DoctorDashboardLayout } from '../components/layout/doctor-dashboard-layout'
import Topbar from '../components/layout/topbar'

export default function DoctorSchedulePage() {
  return (
    <DoctorDashboardLayout>
      <Topbar title="Today's Schedule" subtitle="View and manage your daily appointments" />
      <div className="p-7">Schedule page content goes here.</div>
    </DoctorDashboardLayout>
  )
}