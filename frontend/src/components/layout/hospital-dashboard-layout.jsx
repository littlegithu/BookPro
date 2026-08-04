import HospitalSidebar from './hospital-sidebar'

export default function HospitalDashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-surface">
      <HospitalSidebar />
      <div className="flex-1 flex flex-col min-w-0">{children}</div>
    </div>
  )
}
