import StaffSidebar from './staff-sidebar'

export default function StaffDashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-surface ml-60">
      <StaffSidebar />
      <div className="flex-1 flex flex-col min-w-0 pt-16">{children}</div>
    </div>
  )
}