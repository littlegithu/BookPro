import { Link } from 'react-router-dom'
import SpecialtyBadge from '../shared/specialty-badge'
import { Hospital } from 'lucide-react'

export default function DoctorCard({ doctor }) {
  const { id, name, specialty, hospital, tags = [], availability } = doctor
  const initials = name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0,2).toUpperCase()

  return (
    <div className="bg-card rounded-xl border border-border shadow-[0_1px_2px_#CBD5E1] p-5 flex flex-col hover:border-teal hover:shadow-[0_4px_16px_rgba(15,123,108,0.10)] gap-1.5">
      <div className="w-13 h-13 rounded-full bg-teal-light flex items-center justify-center text-teal font-semibold text-base mb-3.5 shrink-0">
        {initials}
      </div>
      <div className="gap-0 flex flex-col items-start justify-center">
        <p className="text-[14px] font-semibold text-navy mb-0.5">{name}</p>
        <p className="text-[12px] text-slate-light mb-2.5">{specialty}</p>
      </div>
      <div className="gap-0 flex flex-col items-start justify-center">
        {hospital && (
          <p className="text-[11px] text-navy/60 bg-surface border border-border rounded-md px-2 py-0.5 mb-2.5 w-fit">
            <span className="flex items-center gap-2"><Hospital size={14} /> {hospital.name}</span>
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3.5">
        {tags.map(tag => <SpecialtyBadge key={tag} label={tag} />)}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
        <span className="flex items-center gap-1.5 text-[11px] text-teal font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-teal" />{availability}
        </span>
        <Link to={`/doctors/${id}`} className="text-[12px] font-medium text-teal bg-teal-light px-3.5 py-1.5 rounded-md hover:bg-teal hover:text-white transition-colors">
          Book
        </Link>
      </div>
    </div>
  )
}
