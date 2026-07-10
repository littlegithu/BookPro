import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TimeSlotGrid from './TimeSlotGrid'
import FeeBreakdown from './FeeBreakdown'
import TrustIndicator from './TrustIndicator'
import ErrorMessage from '../shared/ErrorMessage'

const DEFAULT_SLOTS = [
  { time: '8:00 AM' }, { time: '8:30 AM' }, { time: '10:00 AM' },
  { time: '10:30 AM', unavailable: true }, { time: '11:00 AM' },
  { time: '2:00 PM' }, { time: '2:30 PM' }, { time: '3:00 PM', unavailable: true },
  { time: '3:30 PM' },
]

export default function BookingForm({ doctorId, doctorName }) {
  const navigate = useNavigate()
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [reason, setReason] = useState('Routine checkup')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!date || !time) { setError('Please select a date and time.'); return }
    setError('')
    setLoading(true)
    // Wire to POST /api/appointments
    setTimeout(() => {
      setLoading(false)
      navigate('/dashboard')
    }, 1000)
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h2 className="font-display font-bold text-[18px] text-navy mb-1">Book an appointment</h2>
      <p className="text-[12px] text-slate-light mb-5">Choose a date and time that works for you</p>

      <ErrorMessage message={error} />

      <label className="block text-[12px] font-medium text-navy mb-1.5 mt-3">Select date</label>
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        className="w-full border border-border rounded-lg px-3.5 py-2.5 text-[13px] text-navy bg-surface outline-none focus:border-teal focus:bg-card transition-colors mb-4"
      />

      <label className="block text-[12px] font-medium text-navy mb-2">Available time slots</label>
      <TimeSlotGrid slots={DEFAULT_SLOTS} selected={time} onSelect={setTime} />

      <label className="block text-[12px] font-medium text-navy mb-1.5">Reason for visit</label>
      <select
        value={reason}
        onChange={e => setReason(e.target.value)}
        className="w-full border border-border rounded-lg px-3.5 py-2.5 text-[13px] text-navy bg-surface outline-none focus:border-teal focus:bg-card transition-colors mb-4 cursor-pointer"
      >
        <option>Routine checkup</option>
        <option>Follow-up visit</option>
        <option>New concern</option>
        <option>Vaccination</option>
        <option>Other</option>
      </select>

      <label className="block text-[12px] font-medium text-navy mb-1.5">Additional notes (optional)</label>
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Any symptoms, concerns, or context for the doctor…"
        rows={3}
        className="w-full border border-border rounded-lg px-3.5 py-2.5 text-[13px] text-navy bg-surface outline-none focus:border-teal focus:bg-card transition-colors mb-2 resize-none"
      />

      <FeeBreakdown />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full mt-4 bg-teal text-white text-[14px] font-semibold py-3.5 rounded-lg hover:bg-teal-mid transition-colors disabled:opacity-60 cursor-pointer"
      >
        {loading ? 'Confirming…' : 'Confirm booking'}
      </button>
      <TrustIndicator />
    </div>
  )
}
