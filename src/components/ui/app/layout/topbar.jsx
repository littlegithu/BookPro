import { Search, Bell } from 'lucide-react'

export default function Topbar({ title, subtitle }) {
  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-8 flex-shrink-0">
      <div>
        <h1 className="font-display font-bold text-[20px] text-navy leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-light mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2 text-[13px] text-slate-light">
          <Search size={16} /> Search doctors…
        </div>
        <button className="w-9 h-9 rounded-lg border border-border bg-none flex items-center justify-center text-slate hover:bg-surface transition-colors"><Bell size={18} /></button>
      </div>
    </div>
  )
}
