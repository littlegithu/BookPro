const variants = {
  confirmed: 'bg-success-bg text-success-text',
  pending: 'bg-warning-bg text-warning-text',
  completed: 'bg-surface text-slate border border-border',
  cancelled: 'bg-danger-bg text-danger-text',
}

export default function StatusBadge({ status }) {
  const key = status?.toLowerCase()
  return (
    <span className={`text-[11px] font-semibold px-[10px] py-[3px] rounded-full ${variants[key] ?? variants.completed}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  )
}
