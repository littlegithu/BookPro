import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, Video, Building2, QrCode, Download, RefreshCw, ExternalLink } from 'lucide-react'
import StatusBadge from '../shared/status-badge'

const CONSULTATION_TYPE_LABELS = {
  'Physical': 'In-Person',
  'Online': 'Virtual',
  'Both': 'Hybrid',
}

export default function AppointmentCard({ appointment, onCancel, cancellingId, onViewDetails, onJoinMeeting, onDownloadSlip }) {
  const { id, doctorName, specialty, date, time, status, reason, hospital_name, hospital_location, room, consultation_type, doctor_id } = appointment
  const initials = doctorName?.split(' ').filter(n => n[0] !== '.').map(n => n[0]).join('').slice(0,2) ?? 'DR'
  const isCancelling = cancellingId === id
  const isUpcoming = status === 'scheduled' || status === 'pending' || status === 'confirmed' || status === 'Scheduled'
  const isVirtual = consultation_type === 'Online' || consultation_type === 'Both'
  const isPhysical = consultation_type === 'Physical' || consultation_type === 'Both'
  const queueNumber = useMemo(() => {
    if (!id) return null
    const num = (id * 7 + 3) % 90 + 10
    return `Q-${num}`
  }, [id])

  return (
    <div className="group relative bg-card rounded-xl border border-border p-5 mb-3 hover:border-teal/30 hover:shadow-lg transition-all duration-200">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Doctor avatar and basic info */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-full bg-teal-light flex items-center justify-center text-teal text-[15px] font-semibold shrink-0 dark:bg-white/10 dark:text-teal">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[15px] font-semibold text-navy dark:text-white truncate">{doctorName}</p>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-light text-blue dark:bg-blue/10">{specialty}</span>
            </div>
            <div className="text-[12px] text-slate-light mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 dark:text-white/60">
              <span className="flex items-center gap-1.5"><Calendar size={13} /> {date}</span>
              <span className="flex items-center gap-1.5"><Clock size={13} /> {time}</span>
              {hospital_name && (
                <span className="flex items-center gap-1.5"><Building2 size={13} /> {hospital_name}</span>
              )}
              {hospital_location && (
                <span className="flex items-center gap-1.5"><MapPin size={13} /> {hospital_location}</span>
              )}
            </div>
            {reason && (
              <p className="text-[12px] text-slate-light mt-1.5 dark:text-white/60">
                <span className="font-medium text-navy/70 dark:text-white/70">Reason:</span> {reason}
              </p>
            )}
          </div>
        </div>

        {/* Details grid */}
        <div className="flex flex-wrap items-center gap-2.5 lg:gap-3 shrink-0">
          <StatusBadge status={status} />
          {queueNumber && (
            <span className="text-[11px] px-2.5 py-1 rounded-lg bg-purple-light text-purple dark:bg-purple/10 font-medium flex items-center gap-1">
              <QrCode size={12} /> {queueNumber}
            </span>
          )}
          {isVirtual && (
            <span className="text-[11px] px-2.5 py-1 rounded-lg bg-blue-light text-blue dark:bg-blue/10 font-medium flex items-center gap-1">
              <Video size={12} /> {CONSULTATION_TYPE_LABELS[consultation_type] || 'Virtual'}
            </span>
          )}
          {isPhysical && room && (
            <span className="text-[11px] px-2.5 py-1 rounded-lg bg-green-light text-green dark:bg-green/10 font-medium flex items-center gap-1">
              <MapPin size={12} /> Room {room}
            </span>
          )}
          {!isPhysical && isVirtual && (
            <span className="text-[11px] px-2.5 py-1 rounded-lg bg-green-light text-green dark:bg-green/10 font-medium flex items-center gap-1">
              <Video size={12} /> Online
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 lg:ml-auto shrink-0">
          <Link
            to={`/doctors/${doctor_id}`}
            className="p-2 rounded-lg text-slate hover:text-navy hover:bg-surface transition-colors"
            title="View doctor profile"
          >
            <ExternalLink size={15} />
          </Link>
          {isUpcoming && isVirtual && (
            <button
              onClick={() => onJoinMeeting?.(appointment)}
              className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-green text-white hover:bg-green/90 transition-colors flex items-center gap-1.5"
            >
              <Video size={13} /> Join
            </button>
          )}
          <button
            onClick={() => onViewDetails?.(appointment)}
            className="px-3 py-1.5 rounded-lg text-[12px] font-medium border border-border text-navy hover:bg-surface transition-colors"
          >
            Details
          </button>
          <button
            onClick={() => onDownloadSlip?.(appointment)}
            className="px-3 py-1.5 rounded-lg text-[12px] font-medium border border-border text-navy hover:bg-surface transition-colors"
            title="Download appointment slip"
          >
            <Download size={13} />
          </button>
          {onCancel && isUpcoming && (
            <button
              onClick={() => onCancel(id)}
              disabled={isCancelling}
              className="px-3 py-1.5 rounded-lg text-[12px] font-medium border border-red/30 text-red hover:bg-red/5 transition-colors disabled:opacity-60"
            >
              {isCancelling ? 'Cancelling…' : 'Cancel'}
            </button>
          )}
          {onCancel && isUpcoming && (
            <button
              onClick={() => {/* reschedule logic */}}
              className="px-3 py-1.5 rounded-lg text-[12px] font-medium border border-orange/30 text-orange hover:bg-orange/5 transition-colors"
              title="Reschedule"
            >
              <RefreshCw size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
