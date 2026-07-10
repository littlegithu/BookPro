import { Link } from 'react-router-dom'

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionTo }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-(--teal-light) flex items-center justify-center text-(--teal) mb-3">
          <Icon className="size-6" />
        </div>
      )}
      <p className="text-[13px] font-medium text-(--navy)">{title}</p>
      {description && <p className="text-[11px] text-(--slate-light) mt-1 max-w-xs">{description}</p>}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-3 text-[11px] font-medium text-(--teal) border border-(--teal) px-3 py-1.5 rounded-md hover:bg-(--teal) hover:text-white transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
