import PastVisitRow from './past-visit-row'
import { FilesIcon } from 'lucide-react'
import EmptyState from '../shared/empty-state'

export default function PastVisitList({ appointments = [] }) {
  if (appointments.length === 0) {
    return <EmptyState icon={<FilesIcon />} title="No past visits" description="Your visit history will appear here." />
  }
  return <div>{appointments.map(a => <PastVisitRow key={a.id} appointment={a} />)}</div>
}