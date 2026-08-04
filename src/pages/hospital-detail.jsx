import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from '../components/layout/navbar'
import { fetchHospital, fetchDoctors } from '../services/api'
import { Hospital, Phone, MapPin, Globe, Star, Users, Calendar } from 'lucide-react'

export default function HospitalDetail() {
  const { id } = useParams()
  const [hospital, setHospital] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadHospital() {
      try {
        const [hospitalData, doctorsData] = await Promise.all([
          fetchHospital(id),
          fetchDoctors()
        ])
        setHospital(hospitalData)
        setDoctors(doctorsData.filter(d => d.hospital_name === hospitalData.name))
      } catch (err) {
        console.error('Failed to load hospital:', err)
      } finally {
        setLoading(false)
      }
    }
    loadHospital()
  }, [id])

  if (loading) {
    return (
      <div className="bg-surface min-h-screen pt-16">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center justify-center py-10">
            <span className="inline-block w-6 h-6 border-2 border-teal border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          </div>
        </div>
      </div>
    )
  }

  if (!hospital) {
    return (
      <div className="bg-surface min-h-screen pt-16">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-slate-light">Hospital not found</p>
        </div>
      </div>
    )
  }

  // Calculate appointment count (assuming we have access to appointments)
  const appointmentCount = Math.floor(Math.random() * 50) // Placeholder - replace with real data
  const rating = (doctors.reduce((sum, d) => sum + (d.rating || 0), 0) / doctors.length) || 0

  return (
    <div className="bg-surface min-h-screen pt-16">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-[32px] text-navy mb-2 dark:text-white">{hospital.name}</h1>
          <p className="text-slate-light dark:text-white/60">{hospital.address}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-teal/10 p-3 rounded-lg">
                <Users size={24} className="text-teal" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy dark:text-white">{doctors.length}</p>
                <p className="text-sm text-slate-light dark:text-white/60">Doctors</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
                <Calendar size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy dark:text-white">{appointmentCount}</p>
                <p className="text-sm text-slate-light dark:text-white/60">Appointments Today</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-lg">
                <Star size={24} className="text-yellow-400 fill-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy dark:text-white">{rating.toFixed(1)}</p>
                <p className="text-sm text-slate-light dark:text-white/60">Average Rating</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
                <Hospital size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy dark:text-white">85%</p>
                <p className="text-sm text-slate-light dark:text-white/60">Capacity</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hospital Details */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-8">
          <h2 className="font-bold text-navy dark:text-white mb-4">Hospital Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-slate-light" />
              <p className="text-slate-light dark:text-white/70">{hospital.address}</p>
            </div>
            {hospital.phone && (
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-slate-light" />
                <p className="text-slate-light dark:text-white/70">{hospital.phone}</p>
              </div>
            )}
            {hospital.email && (
              <div className="flex items-center gap-3">
                <Hospital size={20} className="text-slate-light" />
                <p className="text-slate-light dark:text-white/70">{hospital.email}</p>
              </div>
            )}
            {hospital.website && (
              <div className="flex items-center gap-3">
                <Globe size={20} className="text-slate-light" />
                <p className="text-slate-light dark:text-white/70">{hospital.website}</p>
              </div>
            )}
          </div>
        </div>

        {/* Doctors List */}
        <div>
          <h2 className="font-bold text-navy dark:text-white mb-6">Doctors at {hospital.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map(doctor => (
              <div key={doctor.id} className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-teal-light flex items-center justify-center text-teal font-semibold">
                    {doctor.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-navy dark:text-white">{doctor.name}</p>
                    <p className="text-sm text-slate-light dark:text-white/60">{doctor.specialty}</p>
                  </div>
                </div>
                {doctor.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-navy dark:text-white">{doctor.rating} ({doctor.reviews})</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
