import { Link } from 'react-router-dom'

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-slate-light py-4">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span>/</span>}
          {item.to
            ? <Link to={item.to} className="text-teal hover:underline">{item.label}</Link>
            : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  )
}
