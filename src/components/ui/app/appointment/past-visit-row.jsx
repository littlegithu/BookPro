import { Link } from 'react-router-dom'
import StatusBadge from '../shared/StatusBadge'

export default function PastVisitRow({ appointment }) {
  const { id, doctorName, specialty, date, status } = appointment
  const initials = doctorName?.split(' ').filter(n => n[0] !== '.').map(n => n[0]).join('').slice(0,2) ?? 'DR'

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
      <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-[11px] font-semibold text-(--slate) shrink-0 border border-border">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-(--navy)">{doctorName}</p>
        <p className="text-[11px] text-(--slate-light) mt-0.5">📅 {date} · {specialty}</p>
      </div>
      <StatusBadge status={status} />
      <Link to={`/appointments/${id}`} className="text-[11px] font-medium text-(--teal) hover:underline ml-2">
        {status === 'completed' ? 'View record' : 'Details'} →
      </Link>
    </div>
  )
}
