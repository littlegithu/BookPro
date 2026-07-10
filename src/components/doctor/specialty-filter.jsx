export default function SpecialtyFilter({ specialties, active, onChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap mb-6">
      <span className="text-[12px] font-medium text-slate mr-1">Filter by:</span>
      {specialties.map(s => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`text-[12px] font-medium px-4 py-1.5 rounded-full border transition-colors cursor-pointer ${
            active === s
              ? 'bg-teal text-white border-teal'
              : 'border-border-strong text-slate hover:bg-teal-light hover:border-teal hover:text-teal'
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  )
}
