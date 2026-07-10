import { Link } from 'react-router-dom'
import SpecialtyBadge from '../shared/SpecialtyBadge'

export default function DoctorCard({ doctor }) {
  const { id, name, specialty, location, tags = [], availability } = doctor
  const initials = name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0,2).toUpperCase()

  return (
    <div className="bg-card rounded-xl border border-border p-5 flex flex-col hover:border-teal hover:shadow-[0_4px_16px_rgba(15,123,108,0.10)] transition-all">
      <div className="w-13 h-13 rounded-full bg-teal-light flex items-center justify-center text-teal font-semibold text-base mb-3.5 flex-shrink-0">
        {initials}
      </div>
      <p className="text-[14px] font-semibold text-navy mb-0.5">{name}</p>
      <p className="text-[12px] text-slate-light mb-2.5">{specialty} · {location}</p>
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
