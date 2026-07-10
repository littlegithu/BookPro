import AppointmentCard from './AppointmentCard'
import EmptyState from '../shared/EmptyState'

export default function AppointmentList({ appointments = [], onCancel }) {
  if (appointments.length === 0) {
    return (
      <EmptyState
        icon="📅"
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
