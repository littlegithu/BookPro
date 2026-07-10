import TimeSlot from './TimeSlot'

export default function TimeSlotGrid({ slots = [], selected, onSelect }) {
  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      {slots.map(slot => (
        <TimeSlot
          key={slot.time}
          time={slot.time}
          selected={selected === slot.time}
          unavailable={slot.unavailable}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
