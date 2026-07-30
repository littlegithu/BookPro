import { useState } from 'react'
import { Stethoscope } from 'lucide-react'
import DoctorCard from './doctor-card'
import SpecialtyFilter from './specialty-filter'
import HospitalFilter from './hospital-filter'
import EmptyState from '../shared/empty-state'

export default function DoctorGrid({ doctors = [], specialties = [], hospitals = [], searchQuery = '' }) {
  const [activeSpecialty, setActiveSpecialty] = useState('All')
  const [activeHospital, setActiveHospital] = useState(null)

  const filtered = doctors.filter(d => {
    const matchesSpecialty = activeSpecialty === 'All' || d.specialty === activeSpecialty
    const matchesHospital = activeHospital === null || d.hospital_name === activeHospital
    const query = searchQuery.toLowerCase().trim()
    const matchesSearch = !query || d.name.toLowerCase().includes(query) || d.specialty.toLowerCase().includes(query) || (d.hospital_name && d.hospital_name.toLowerCase().includes(query))
    return matchesSpecialty && matchesHospital && matchesSearch
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
        specialties={specialties}
        active={activeSpecialty}
        onChange={setActiveSpecialty}
      />
      {filtered.length === 0
        ? <EmptyState icon={<Stethoscope size={40} />} title="No doctors found" description="Try a different filter combination." />
        : <div className="grid grid-cols-4 gap-4">{filtered.map(d => <DoctorCard key={d.id} doctor={d} />)}</div>
      }
    </div>
  )
}
