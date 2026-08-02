import { Calendar, Stethoscope } from 'lucide-react'

export default function MedicalRecordCard({ record, appointment }) {
  if (!record) return null
  const { diagnosis, prescription, follow_up_date, additional_notes } = record
  const followUpDate = follow_up_date ? new Date(follow_up_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : null
  return (
    <div className="bg-teal-light border border-teal/20 rounded-xl p-5 dark:bg-white/5 dark:border-teal/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-navy text-[16px] dark:text-white">Medical record</h3>
        {appointment && (
          <span className="text-[11px] text-slate-light dark:text-white/60">{appointment.date} · {appointment.time}</span>
        )}
      </div>
      {appointment && (
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-teal/15 dark:border-white/10">
          <div className="w-9 h-9 rounded-full bg-teal flex items-center justify-center text-white text-[12px] font-semibold">
            {appointment.doctorName?.split(' ').filter(n => n[0] !== '.').map(n => n[0]).join('').slice(0, 2) || 'DR'}
          </div>
          <div>
            <p className="text-[13px] font-medium text-navy dark:text-white">{appointment.doctorName || 'Doctor'}</p>
            <p className="text-[11px] text-slate-light flex items-center gap-2 dark:text-white/60">
              <span className="flex items-center gap-1"><Stethoscope size={12} /> {appointment.specialty || 'General Practice'}</span>
            </p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[11px] font-medium text-teal uppercase tracking-wider mb-1">Diagnosis</p>
          <p className="text-[13px] text-navy dark:text-white">{diagnosis ?? '—'}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-teal uppercase tracking-wider mb-1">Prescription</p>
          <p className="text-[13px] text-navy dark:text-white">{prescription ?? '—'}</p>
        </div>
        {followUpDate && (
          <div className="col-span-2">
            <p className="text-[11px] font-medium text-teal uppercase tracking-wider mb-1">Follow-up date</p>
            <p className="text-[13px] text-navy flex items-center gap-2 dark:text-white"><Calendar size={14} /> {followUpDate}</p>
          </div>
        )}
        {additional_notes && (
          <div className="col-span-2">
            <p className="text-[11px] font-medium text-teal uppercase tracking-wider mb-1">Additional notes</p>
            <p className="text-[13px] text-navy dark:text-white">{additional_notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
