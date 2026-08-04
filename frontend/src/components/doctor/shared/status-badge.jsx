import { getStatusColor } from './status-utils'

export default function StatusBadge({ status }) {
  const displayStatus = typeof status === 'object' ? JSON.stringify(status) : status
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium shrink-0 ${getStatusColor(status)}`}>
      {displayStatus}
    </span>
  )
}
