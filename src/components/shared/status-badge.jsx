const variants = {
  confirmed: 'bg-success-bg text-success-text ring-1 ring-success-text hover:bg-teal-light hover:text-success-text dark:bg-teal/25 dark:text-teal dark:ring-teal/50 dark:hover:bg-teal/40',
  pending: 'bg-warning-bg text-warning-text hover:bg-warning-text hover:text-white',
  completed: 'bg-surface text-slate border border-border hover:bg-success-bg hover:text-success-text dark:bg-white/10 dark:text-white/80 dark:border-white/15 dark:hover:bg-teal/25 dark:hover:text-teal',
  cancelled: 'bg-danger-bg text-danger-text hover:bg-danger-text hover:text-white',
}

export default function StatusBadge({ status }) {
  const key = status?.toLowerCase()
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.75 rounded-full transition-colors cursor-default ${variants[key] ?? variants.completed}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  )
}
