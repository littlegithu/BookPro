import AppointmentCard from './AppointmentCard'
import EmptyState from '../shared/EmptyState'
import { Calendar } from 'lucide-react'

export default function AppointmentList({ appointments = [], onCancel }) {
  if (appointments.length === 0) {
    return (
      <EmptyState
        icon={<Calendar size={40} />}
        title="No upcoming appointments"
        description="Book a checkup with one of our verified doctors."
        actionLabel="Find a doctor"
        actionTo="/doctors"
      />
    )
  }
  return (
    <div>
      {appointments.map(a => <AppointmentCard key={a.id} appointment={a} onCancel={onCancel} />)}
    </div>
  )
}
