import { Calendar, Stethoscope } from 'lucide-react'
import StatusBadge from '../shared/status-badge'

export default function AppointmentCard({ appointment, onCancel }) {
  const { id, doctorName, specialty, date, time, status } = appointment
  const initials = doctorName?.split(' ').filter(n => n[0] !== '.').map(n => n[0]).join('').slice(0,2) ?? 'DR'

  return (
    <div className="flex items-center gap-3.5 px-4 py-3 bg-teal-light rounded-lg mb-2.5">
      <div className="w-10 h-10 rounded-full bg-teal/20 flex items-center justify-center text-teal text-[13px] font-semibold shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-navy">{doctorName}</p>
        <p className="text-[11px] text-slate-light mt-0.5 flex gap-2.5">
          <span className="flex gap-2.5 items-center"><Calendar size={14} /> {date} · {time}</span>
          <span className="flex gap-2.5 items-center"><Stethoscope size={14} /> {specialty}</span>
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <StatusBadge status={status} />
       
        <button
          onClick={() => onCancel?.(id)}
          className="text-[11px] text-slate-light border border-border px-2.6 py-1 rounded-md hover:text-danger-text hover:border-danger-text transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
