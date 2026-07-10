import PastVisitRow from './PastVisitRow'
import { FilesIcon } from 'lucide-react'
import EmptyState from '../shared/EmptyState'

export default function PastVisitList({ appointments = [] }) {
  if (appointments.length === 0) {
    return <EmptyState icon={FilesIcon} title="No past visits" description="Your visit history will appear here." />
  }
  return <div>{appointments.map(a => <PastVisitRow key={a.id} appointment={a} />)}</div>
}
