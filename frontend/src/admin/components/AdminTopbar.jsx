import { Search } from 'lucide-react'
import { useAuth } from '../../context/auth-context'

export default function AdminTopbar() {
  const { user, logout } = useAuth()

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-6 bg-white border-b border-gray-200">
      <div className="flex items-center gap-4 flex-1">
        <h1 className="text-lg font-semibold text-gray-800">Admin Portal</h1>
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user?.name || 'Admin'}</span>
        <button
          onClick={logout}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  )
}