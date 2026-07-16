export default function HospitalFilter({ hospitals, active, onChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap mb-3">
      <span className="text-[12px] font-medium text-slate mr-1">Hospital:</span>
      <button
        onClick={() => onChange(null)}
        className={`text-[12px] font-medium px-4 py-1.5 rounded-full border transition-colors cursor-pointer ${
          active === null
            ? 'bg-navy text-white border-navy'
            : 'border-border-strong text-slate hover:bg-surface hover:border-navy hover:text-navy'
        }`}
      >
        All hospitals
      </button>
      {hospitals.map(h => (
        <button
          key={h.id}
          onClick={() => onChange(h.id)}
          className={`text-[12px] font-medium px-4 py-1.5 rounded-full border transition-colors cursor-pointer ${
            active === h.id
              ? 'bg-navy text-white border-navy'
              : 'border-border-strong text-slate hover:bg-surface hover:border-navy hover:text-navy'
          }`}
        >
          {h.name}
        </button>
      ))}
    </div>
  )
}
