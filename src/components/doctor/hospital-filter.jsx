export default function HospitalFilter({ hospitals, active, onChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap mb-3.5">
      <span className="text-[12px] font-medium text-slate mr-1 dark:text-white/60">Hospital:</span>
      <button
        onClick={() => onChange(null)}
        className={`text-[12px] font-medium px-4 py-1.5 rounded-full border transition-colors cursor-pointer ${
          active === null
            ? 'bg-navy text-white border-navy dark:bg-teal dark:text-white dark:border-teal'
            : 'border-border-strong text-slate hover:bg-surface hover:border-navy hover:text-navy dark:text-white/70 dark:border-white/15 dark:hover:bg-white/10 dark:hover:text-white dark:hover:border-white/25'
        }`}
      >
        All hospitals
      </button>
      {hospitals.map(h => (
        <button
          key={h.id}
          onClick={() => onChange(h.name)}
          className={`text-[12px] font-medium px-4 py-1.5 rounded-full border transition-colors cursor-pointer ${
            active === h.name
              ? 'bg-navy text-white border-navy dark:bg-teal dark:text-white dark:border-teal'
              : 'border-border-strong text-slate hover:bg-surface hover:border-navy hover:text-navy dark:text-white/70 dark:border-white/15 dark:hover:bg-white/10 dark:hover:text-white dark:hover:border-white/25'
          }`}
        >
          {h.name}
        </button>
      ))}
    </div>
  )
}
