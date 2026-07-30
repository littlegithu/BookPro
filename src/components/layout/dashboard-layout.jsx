import Sidebar from './sidebar'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-surface ml-60">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">{children}</div>
    </div>
  )
}
