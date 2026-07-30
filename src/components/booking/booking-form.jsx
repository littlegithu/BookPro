import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import TimeSlotGrid from './time-slot-grid'
import TrustIndicator from './trust-indicator'
import ErrorMessage from '../shared/error-message'
import { useAuth } from '@/context/auth-context'
import { createAppointment, fetchHospitals } from '@/services/api'

const DEFAULT_SLOTS = [
  { time: '8:00 AM' }, { time: '8:30 AM' }, { time: '10:00 AM' },
  { time: '10:30 AM', unavailable: true }, { time: '11:00 AM' },
  { time: '2:00 PM' }, { time: '2:30 PM' }, { time: '3:00 PM', unavailable: true },
  { time: '3:30 PM' },
]

export default function BookingForm({ doctorId, hospitalIds, fee }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [reason, setReason] = useState('Routine checkup')
  const [notes, setNotes] = useState('')
  const [hospitalId, setHospitalId] = useState('')
  const [hospitals, setHospitals] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const maxNotes = 250
  const effectiveFee = fee || 0
  const consultationFee = effectiveFee
  const platformFee = Math.floor(consultationFee * 0.05)
  const total = consultationFee + platformFee

  const doctorHospitalIds = useMemo(() => {
    return hospitalIds
      ? hospitalIds.split(',').map(id => id.trim()).filter(Boolean)
      : []
  }, [hospitalIds])
  const showHospitalDropdown = doctorHospitalIds.length > 1

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchHospitals()
        setHospitals(data)
        if (showHospitalDropdown && doctorHospitalIds.length > 0) {
          setHospitalId(doctorHospitalIds[0])
        } else if (data.length > 0) {
          setHospitalId(String(data[0].id))
        }
      } catch (err) {
        console.error('Failed to load hospitals:', err)
      }
    }
    load()
  }, [doctorHospitalIds, showHospitalDropdown])

  const handleHospitalChange = (value) => {
    setHospitalId(value)
  }

  const today = new Date()
  const minDate = today.toISOString().split('T')[0]

  const handleSubmit = async () => {
    if (!date || !time) { setError('Please select a date and time.'); return }
    if (!hospitalId) { setError('Please select a hospital.'); return }
    if (!reason) { setError('Please select a reason for your visit.'); return }
    setError('')
    setLoading(true)
    try {
      const [hours, minutes] = time.split(':').map(part => part.replace(/[^0-9]/g, ''))
      const isPM = time.includes('PM') && !time.includes('12:')
      const parsedHours = parseInt(hours, 10)
      const finalHours = isPM ? (parsedHours === 12 ? 12 : parsedHours + 12) : (parsedHours === 12 ? 0 : parsedHours)
      const appointmentDate = new Date(`${date}T${String(finalHours).padStart(2, '0')}:${minutes || '00'}:00`)

      const patientId = user?.patientId || user?.id
      await createAppointment({
        appointment_date: appointmentDate.toISOString(),
        appointment_time: `${String(finalHours).padStart(2, '0')}:${minutes || '00'}:00`,
        patient_id: patientId,
        doctor_id: doctorId,
        hospital_id: Number(hospitalId),
        notes: reason,
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to book appointment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h2 className="font-display font-bold text-[18px] text-navy mb-1">Book an appointment</h2>
      <p className="text-[12px] text-slate-light mb-5">Choose a date and time that works for you</p>

      <ErrorMessage message={error} />

      {showHospitalDropdown && (
        <>
          <label className="block text-[12px] font-medium text-navy mb-1.5 mt-3">Select hospital</label>
          <select
            value={hospitalId}
            onChange={e => handleHospitalChange(e.target.value)}
            className="w-full border border-border rounded-lg px-3.5 py-2.5 text-[13px] text-navy bg-surface outline-none focus:border-teal focus:bg-card transition-colors mb-4 cursor-pointer"
          >
            {hospitals.filter(h => doctorHospitalIds.includes(String(h.id))).map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </>
      )}

      <label className="block text-[12px] font-medium text-navy mb-1.5 mt-3">Select date</label>
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        min={minDate}
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
        onChange={e => setNotes(e.target.value.slice(0, maxNotes))}
        placeholder="Any symptoms, concerns, or context for the doctor…"
        rows={3}
        maxLength={maxNotes}
        className="w-full border border-border rounded-lg px-3.5 py-2.5 text-[13px] text-navy bg-surface outline-none focus:border-teal focus:bg-card transition-colors mb-2 resize-none"
      />
      <p className="text-[11px] text-slate-light text-right">{notes.length}/{maxNotes}</p>

      <div className="mt-4 bg-surface border border-border rounded-lg p-4">
        <div className="flex justify-between text-[13px] text-slate mb-2">
          <span>Consultation fee</span>
          <span className="font-medium text-navy">KES {consultationFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-[13px] text-slate mb-2">
          <span>Platform fee</span>
          <span className="font-medium text-navy">KES {platformFee.toLocaleString()}</span>
        </div>
        <div className="border-t border-border pt-2 mt-2 flex justify-between text-[14px] font-semibold text-navy">
          <span>Total</span>
          <span>KES {total.toLocaleString()}</span>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full mt-4 bg-teal text-white text-[14px] font-semibold py-3.5 rounded-lg hover:bg-teal-mid transition-colors disabled:opacity-60 cursor-pointer"
      >
        {loading ? 'Confirming…' : 'Confirm booking'}
      </button>
      <div className="mt-3 flex flex-col gap-1">
        <p className="text-[12px] text-slate-light flex items-center gap-1.5"><ShieldCheck size={14} /> Free cancellation up to 24h before</p>
        <p className="text-[12px] text-slate-light flex items-center gap-1.5"><ShieldCheck size={14} /> Secure booking</p>
      </div>
      <TrustIndicator />
    </div>
  )
}
