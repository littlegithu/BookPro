import { useState, useEffect } from 'react'
import Topbar from '../../components/layout/topbar'
import DoctorDashboardLayout from '../../components/layout/doctor-dashboard-layout'
import { fetchDoctorAvailability, updateDoctorAvailability } from '../../services/api'
import { Save, RotateCcw } from 'lucide-react'

export default function DoctorAvailabilityPage() {
  const [availability, setAvailability] = useState({
    accepting_patients: true,
    consultation_type: 'Physical',
    duration: 30
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    loadAvailability()
  }, [])

  async function loadAvailability() {
    try {
      const data = await fetchDoctorAvailability()
      if (data) {
        setAvailability({
          accepting_patients: data.accepting_patients ?? true,
          consultation_type: data.consultation_type || 'Physical',
          duration: data.duration || 30
        })
      }
    } catch (err) {
      console.error('Failed to load availability:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setAvailability(prev => ({ ...prev, [field]: value }))
    setMessage({ type: '', text: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })
    try {
      await updateDoctorAvailability(availability)
      setMessage({ type: 'success', text: 'Availability settings saved successfully!' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to save availability settings' })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    loadAvailability()
    setMessage({ type: '', text: '' })
  }

  if (loading) {
    return (
      <DoctorDashboardLayout>
        <Topbar title="Availability" subtitle="Loading..." />
        <div className="p-7">
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </DoctorDashboardLayout>
    )
  }

  return (
    <DoctorDashboardLayout>
      <Topbar title="Availability" subtitle="Manage your availability and schedule preferences" />

      <div className="p-7 max-w-2xl">
        <div className="bg-card rounded-xl border border-border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Accepting Patients Toggle */}
            <div className="flex items-center justify-between py-4 border-b border-border">
              <div>
                <h3 className="font-display font-semibold text-navy">Accepting New Patients</h3>
                <p className="text-xs text-slate-light mt-0.5">Toggle whether you are currently accepting new patient appointments</p>
              </div>
              <button
                type="button"
                onClick={() => handleChange('accepting_patients', !availability.accepting_patients)}
                className={`relative w-12 h-6 rounded-full transition-colors ${availability.accepting_patients ? 'bg-teal' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${availability.accepting_patients ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Consultation Type */}
            <div className="py-4 border-b border-border">
              <h3 className="font-display font-semibold text-navy mb-3">Consultation Type</h3>
              <div className="flex gap-3">
                {['Physical', 'Virtual', 'Both'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleChange('consultation_type', type)}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                      availability.consultation_type === type
                        ? 'border-teal bg-teal-light text-teal'
                        : 'border-border text-slate hover:border-teal/30'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Appointment Duration */}
            <div className="py-4 border-b border-border">
              <h3 className="font-display font-semibold text-navy mb-3">Appointment Duration</h3>
              <div className="flex gap-3">
                {[15, 30, 45, 60].map(duration => (
                  <button
                    key={duration}
                    type="button"
                    onClick={() => handleChange('duration', duration)}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                      availability.duration === duration
                        ? 'border-teal bg-teal-light text-teal'
                        : 'border-border text-slate hover:border-teal/30'
                    }`}
                  >
                    {duration} min
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            {message.text && (
              <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-light text-green' : 'bg-red-light text-red'}`}>
                {message.text}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={handleReset} className="px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors flex items-center gap-1.5">
                <RotateCcw size={14} />Reset
              </button>
              <button type="submit" disabled={saving} className="px-6 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors disabled:opacity-50 flex items-center gap-1.5">
                <Save size={14} />{saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DoctorDashboardLayout>
  )
}
