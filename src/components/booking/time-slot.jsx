export default function TimeSlot({ time, selected, unavailable, onSelect }) {
  if (unavailable) {
    return (
      <button disabled className="text-[12px] font-medium py-2 rounded-lg border border-border bg-surface text-slate-light opacity-50 cursor-not-allowed">
        {time}
      </button>
    )
  }
  return (
    <button
      onClick={() => onSelect(time)}
      className={`text-[12px] font-medium py-2 rounded-lg border transition-colors cursor-pointer ${
        selected
          ? 'bg-teal text-white border-teal'
          : 'border-border text-slate hover:border-teal hover:text-teal hover:bg-teal-light'
      }`}
    >
      {time}
    </button>
  )
}
