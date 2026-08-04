import { useState, useEffect } from 'react'
import Topbar from '../../components/layout/topbar'
import DoctorDashboardLayout from '../../components/layout/doctor-dashboard-layout'
import { fetchDoctorHospitals } from '../../services/api'
import { Hospital, MapPin, Phone, Mail, Globe, Clock } from 'lucide-react'

export default function DoctorHospitalsPage() {
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadHospitals()
  }, [])

  async function loadHospitals() {
    try {
      const data = await fetchDoctorHospitals()
      setHospitals(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load hospitals')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DoctorDashboardLayout>
        <Topbar title="Hospitals" subtitle="Loading..." />
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
      <Topbar title="Hospitals" subtitle="Manage your hospital affiliations" />

      <div className="p-7 space-y-5">
        {error && (
          <div className="text-red-600 text-center py-5 bg-red-50 rounded-xl border border-red-200">{error}</div>
        )}

        {hospitals.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-10 text-center">
            <Hospital className="w-16 h-16 mx-auto mb-4 text-slate-light opacity-40" />
            <p className="text-lg font-medium text-navy mb-1">No hospital affiliations</p>
            <p className="text-sm text-slate-light">You are not currently affiliated with any hospitals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {hospitals.map((hospital) => (
              <div key={hospital.id} className="bg-card rounded-xl border border-border p-5 hover:border-teal/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-teal-light flex items-center justify-center text-teal shrink-0">
                    <Hospital size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-navy">{hospital.name}</h3>
                    {hospital.department && (
                      <p className="text-sm text-slate mt-0.5">{hospital.department}</p>
                    )}
                    <div className="mt-3 space-y-1.5">
                      {hospital.address && (
                        <p className="text-xs text-slate-light flex items-center gap-1.5">
                          <MapPin size={12} />{hospital.address}
                        </p>
                      )}
                      {hospital.phone && (
                        <p className="text-xs text-slate-light flex items-center gap-1.5">
                          <Phone size={12} />{hospital.phone}
                        </p>
                      )}
                      {hospital.email && (
                        <p className="text-xs text-slate-light flex items-center gap-1.5">
                          <Mail size={12} />{hospital.email}
                        </p>
                      )}
                      {hospital.website && (
                        <p className="text-xs text-slate-light flex items-center gap-1.5">
                          <Globe size={12} />{hospital.website}
                        </p>
                      )}
                      {hospital.working_hours && (
                        <p className="text-xs text-slate-light flex items-center gap-1.5">
                          <Clock size={12} />{hospital.working_hours}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(hospital.address || hospital.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 border border-border rounded-md text-xs font-medium text-slate hover:bg-surface hover:text-teal transition-colors flex items-center gap-1"
                  >
                    <MapPin size={12} />View Map
                  </a>
                  {hospital.phone && (
                    <a href={`tel:${hospital.phone}`} className="px-3 py-1.5 border border-border rounded-md text-xs font-medium text-slate hover:bg-surface hover:text-teal transition-colors flex items-center gap-1">
                      <Phone size={12} />Call
                    </a>
                  )}
                  {hospital.email && (
                    <a href={`mailto:${hospital.email}`} className="px-3 py-1.5 border border-border rounded-md text-xs font-medium text-slate hover:bg-surface hover:text-teal transition-colors flex items-center gap-1">
                      <Mail size={12} />Email
                    </a>
                  )}
                  {hospital.website && (
                    <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 border border-border rounded-md text-xs font-medium text-slate hover:bg-surface hover:text-teal transition-colors flex items-center gap-1">
                      <Globe size={12} />Website
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DoctorDashboardLayout>
  )
}
