import { Search, Bell } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'

export default function Topbar({ title, subtitle }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const { user } = useAuth()

  const initials = user?.name
    ? user.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'G'

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/doctors?search=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-8 shrink-0 relative">
      <div>
        <h1 className="font-display font-bold text-[20px] text-navy leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-light mt-0.5">{subtitle}</p>}
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 flex justify-center">
        <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:border-teal transition-colors">
          <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {initials}
          </div>
          <div className="hidden md:block">
            <p className="text-navy text-[13px] font-medium leading-tight">{user?.name || 'Guest User'}</p>
            <p className="text-[11px] text-slate-light">{user ? 'Patient' : 'Guest'}</p>
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-2.5">
        <form onSubmit={handleSearch} className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2 text-[13px] text-slate-light">
          <Search size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search doctors…"
            className="bg-transparent outline-none text-navy placeholder:text-slate-light w-40"
          />
        </form>
        <button className="w-9 h-9 rounded-lg border border-border bg-none flex items-center justify-center text-slate hover:bg-surface transition-colors"><Bell size={18} /></button>
      </div>
    </div>
  )
}
