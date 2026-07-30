import { Search, Bell } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Topbar({ title, subtitle }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/doctors?search=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-8 shrink-0">
      <div>
        <h1 className="font-display font-bold text-[20px] text-navy leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-light mt-0.5">{subtitle}</p>}
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
