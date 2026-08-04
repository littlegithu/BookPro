import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarIcon, ArrowRightIcon, Download, Printer, Share2, ChevronDown, ChevronUp, FileText, Pill, Activity, User, MapPin } from 'lucide-react'
import StatusBadge from '../shared/status-badge'

export default function PastVisitRow({ appointment }) {
  const { id, doctorName, specialty, date, status, reason, hospital_name, diagnosis, prescription, notes } = appointment
  const initials = doctorName?.split(' ').filter(n => n[0] !== '.').map(n => n[0]).join('').slice(0,2) ?? 'DR'
  const [expanded, setExpanded] = useState(false)
  const isCompleted = status === 'completed'

  return (
    <div className="border border-border rounded-xl mb-3 overflow-hidden bg-card hover:border-teal/20 transition-colors">
      <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-[11px] font-semibold text-slate shrink-0 border border-border dark:bg-white/10 dark:text-white/80">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[13px] font-medium text-navy dark:text-white">{doctorName}</p>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-light text-blue dark:bg-blue/10">{specialty}</span>
          </div>
          <p className="text-[11px] text-slate-light mt-1 inline-flex items-center gap-1 dark:text-white/60">
            <CalendarIcon className="size-3 text-slate-light mr-1 dark:text-white/60" />{date}
            {hospital_name && <span className="flex items-center gap-1"><MapPin size={12} className="mr-0.5" />{hospital_name}</span>}
          </p>
        </div>
        <StatusBadge status={status} />
        <div className="flex items-center gap-1.5 shrink-0">
          <Link to={`/appointments/${id}`} className="text-[11px] font-medium text-teal hover:underline inline-flex items-center gap-0.5">
            {isCompleted ? 'View record' : 'Details'}
            <ArrowRightIcon className="size-3.5" />
          </Link>
          <button className="p-1.5 rounded-md text-slate hover:text-navy hover:bg-surface transition-colors" title="Download PDF">
            <Download size={13} />
          </button>
          <button className="p-1.5 rounded-md text-slate hover:text-navy hover:bg-surface transition-colors" title="Print">
            <Printer size={13} />
          </button>
          <button className="p-1.5 rounded-md text-slate hover:text-navy hover:bg-surface transition-colors" title="Share">
            <Share2 size={13} />
          </button>
          {expanded ? <ChevronUp size={14} className="text-slate" /> : <ChevronDown size={14} className="text-slate" />}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-border bg-surface/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            {reason && (
              <div className="bg-card rounded-lg p-3 border border-border">
                <p className="text-[11px] font-medium text-slate-light mb-1 flex items-center gap-1"><FileText size={12} /> Reason for Visit</p>
                <p className="text-[13px] text-navy">{reason}</p>
              </div>
            )}
            {diagnosis && (
              <div className="bg-card rounded-lg p-3 border border-border">
                <p className="text-[11px] font-medium text-slate-light mb-1 flex items-center gap-1"><Activity size={12} /> Diagnosis</p>
                <p className="text-[13px] text-navy">{diagnosis}</p>
              </div>
            )}
            {prescription && (
              <div className="bg-card rounded-lg p-3 border border-border">
                <p className="text-[11px] font-medium text-slate-light mb-1 flex items-center gap-1"><Pill size={12} /> Prescription</p>
                <p className="text-[13px] text-navy">{prescription}</p>
              </div>
            )}
            {notes && (
              <div className="bg-card rounded-lg p-3 border border-border">
                <p className="text-[11px] font-medium text-slate-light mb-1 flex items-center gap-1"><FileText size={12} /> Doctor Notes</p>
                <p className="text-[13px] text-navy">{notes}</p>
              </div>
            )}
          </div>
          <div className="mt-3 flex items-center gap-4 text-[12px] text-slate-light">
            <span className="flex items-center gap-1"><User size={12} /> {doctorName}</span>
            {hospital_name && <span className="flex items-center gap-1"><MapPin size={12} /> {hospital_name}</span>}
            <span className="flex items-center gap-1"><CalendarIcon size={12} /> {date}</span>
          </div>
        </div>
      )}
    </div>
  )
}
