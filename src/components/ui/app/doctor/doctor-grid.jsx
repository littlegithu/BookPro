import { useState } from 'react'
import DoctorCard from './DoctorCard'
import SpecialtyFilter from './SpecialtyFilter'
import EmptyState from '../shared/EmptyState'
import { Stethoscope } from 'lucide-react'

export default function DoctorGrid({ doctors = [], specialties = [] }) {
  const [active, setActive] = useState('All')

  const filtered = active === 'All'
    ? doctors
    : doctors.filter(d => d.specialty === active || d.tags?.includes(active))

  return (
    <div>
      <SpecialtyFilter specialties={['All', ...specialties]} active={active} onChange={setActive} />
      {filtered.length === 0
        ? <EmptyState icon={<Stethoscope size={40} />} title="No doctors found" description="Try a different specialty filter." />
        : <div className="grid grid-cols-4 gap-4">{filtered.map(d => <DoctorCard key={d.id} doctor={d} />)}</div>
      }
    </div>
  )
}
