import { Link } from 'react-router-dom'

export default function EmptyState({ icon, title, description, actionLabel, actionTo }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-display font-semibold text-navy text-lg mb-2">{title}</h3>
      <p className="text-slate-light text-sm mb-6 max-w-xs">{description}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="bg-teal text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-teal-mid transition-colors">
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
