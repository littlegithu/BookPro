export default function AvailabilityBadge({ label = 'Available today' }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-teal bg-teal-light px-3 py-1.5 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-teal" />
      {label}
    </span>
  )
}
