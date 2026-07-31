import { Calendar, Stethoscope } from 'lucide-react'
import StatusBadge from '../shared/status-badge'

export default function AppointmentCard({ appointment, onCancel, cancellingId }) {
  const { id, doctorName, specialty, date, time, status } = appointment
  const initials = doctorName?.split(' ').filter(n => n[0] !== '.').map(n => n[0]).join('').slice(0,2) ?? 'DR'
  const isCancelling = cancellingId === id

  return (
    <div className="flex items-center gap-3.5 px-4 py-3 bg-teal-light rounded-lg mb-2.5 dark:bg-white/5">
      <div className="w-10 h-10 rounded-full bg-teal-light flex items-center justify-center text-teal text-[13px] font-semibold shrink-0 dark:bg-white/10 dark:text-teal">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-navy dark:text-white">{doctorName}</p>
        <p className="text-[11px] text-slate-light mt-0.5 flex gap-2.5 dark:text-white/60">
          <span className="flex gap-2.5 items-center"><Calendar size={14} /> {date} · {time}</span>
          <span className="flex gap-2.5 items-center"><Stethoscope size={14} /> {specialty}</span>
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <StatusBadge status={status} />
        {onCancel && (status === 'confirmed' || status === 'pending' || status === 'Scheduled') && (
          <button
            onClick={() => onCancel(id)}
            disabled={isCancelling}
            className="text-[11px] text-slate-light border border-border px-2.5 py-1 rounded-md hover:text-danger-text hover:border-danger-text hover:bg-danger-bg/10 transition-colors disabled:opacity-60 dark:text-white/60 dark:border-white/15 dark:hover:text-danger-text"
          >
            {isCancelling ? 'Cancelling…' : 'Cancel'}
          </button>
        )}
      </div>
    </div>
  )
}