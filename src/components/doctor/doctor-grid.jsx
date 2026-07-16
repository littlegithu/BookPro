import { useState } from 'react'
import DoctorCard from './DoctorCard'
import SpecialtyFilter from './SpecialtyFilter'
import HospitalFilter from './HospitalFilter'
import EmptyState from '../shared/EmptyState'

export default function DoctorGrid({ doctors = [], specialties = [], hospitals = [] }) {
  const [activeSpecialty, setActiveSpecialty] = useState('All')
  const [activeHospital,  setActiveHospital]  = useState(null)

  const filtered = doctors.filter(d => {
    const matchesSpecialty = activeSpecialty === 'All' || d.specialty === activeSpecialty
    const matchesHospital  = activeHospital === null   || d.hospital?.id === activeHospital
    return matchesSpecialty && matchesHospital
  })

  return (
    <div>
      {hospitals.length > 0 && (
        <HospitalFilter
          hospitals={hospitals}
          active={activeHospital}
          onChange={setActiveHospital}
        />
      )}
      <SpecialtyFilter
        specialties={['All', ...specialties]}
        active={activeSpecialty}
        onChange={setActiveSpecialty}
      />
      {filtered.length === 0
        ? <EmptyState icon="🩺" title="No doctors found" description="Try a different filter combination." />
        : <div className="grid grid-cols-4 gap-4">{filtered.map(d => <DoctorCard key={d.id} doctor={d} />)}</div>
      }
    </div>
  )
}
