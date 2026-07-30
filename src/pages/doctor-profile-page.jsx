import { useParams } from 'react-router-dom'
import { Briefcase, Clock, Check, Stethoscope, Hospital, MapPin, Phone, Globe, ShieldCheck } from 'lucide-react'
import Navbar from '../components/layout/navbar'
import Breadcrumb from '../components/shared/breadcrumb'
import SpecialtyBadge from '../components/shared/specialty-badge'
import BookingForm from '../components/booking/booking-form'
import ReviewsSection from '../components/doctor/reviews-section'
import { fetchDoctor } from '../services/api'
import { useState, useEffect } from 'react'

export default function DoctorProfilePage() {
  const { id } = useParams()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchDoctor(id)
        setDoctor(data)
      } catch (err) {
        setError(err.message || 'Failed to load doctor profile')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="bg-surface min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-15 py-10">
          <p className="text-slate">Loading doctor profile...</p>
        </div>
      </div>
    )
  }

  if (error || !doctor) {
    return (
      <div className="bg-surface min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-15 py-10">
          <p className="text-red-500">{error || 'Doctor not found.'}</p>
        </div>
      </div>
    )
  }

  const initials = doctor.name
    .split(' ')
    .filter(n => n !== 'Dr.')
    .map(n => n[0])
    .join('')
    .slice(0, 2)

  const specialtiesList = Array.isArray(doctor.specialties) && doctor.specialties.length > 0
    ? doctor.specialties
    : [doctor.specialty]

  return (
    <div className="bg-surface min-h-screen">
      <Navbar showLogo={false} />
      <div className="max-w-7xl mx-auto px-15">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Doctors', to: '/doctors' }, { label: doctor.name }]} />

        <div className="grid grid-cols-[1fr_400px] gap-7 pb-16">
          <div className="flex flex-col gap-5">
            <div className="bg-card rounded-xl border border-border p-8">
              <div className="flex gap-5 items-start pb-5 border-b border-border mb-5">
                <div className="w-22 h-22 rounded-full bg-teal-light flex items-center justify-center font-display font-bold text-[26px] text-teal shrink-0 overflow-hidden">
                  {doctor.profile_image ? (
                    <img src={doctor.profile_image} alt={doctor.name} className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="font-display font-bold text-[26px] text-navy">{doctor.name}</h1>
                    {doctor.verification_status === 'Verified' && (
                      <span className="flex items-center gap-1 text-[12px] font-medium text-teal bg-teal-light px-2 py-1 rounded-full">
                        <ShieldCheck size={14} /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-[14px] text-slate mb-1">{doctor.specialty}</p>

                  {doctor.hospital_name && (
                    <div className="flex flex-row items-center gap-2 text-[13px] text-navy/70 bg-surface border border-border rounded-lg px-3 py-1.5 w-fit mb-3">
                      <span className="font-medium flex flex-row items-center gap-2"><Stethoscope size={16} className="text-slate-light" />{doctor.hospital_name}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5">
                    {specialtiesList.map(t => <SpecialtyBadge key={t} label={t} />)}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display font-bold text-[32px] text-navy">{doctor.rating}</p>
                  <p className="text-[16px] text-yellow-400">★★★★★</p>
                  <p className="text-[12px] text-slate-light">{doctor.reviews} reviews</p>
                </div>
              </div>

              <div className="flex gap-8 flex-wrap items-center">
                <span className="flex items-center gap-2 text-[13px] text-slate"><Briefcase size={16} /> {doctor.experience} experience</span>
                <span className="flex items-center gap-2 text-[13px] text-slate"><Clock size={16} /> {doctor.hours}</span>
                <span className="flex items-center gap-2 text-[13px] text-slate"><Phone size={16} /> {doctor.phone}</span>
                <span className="flex items-center gap-1.5 text-[12px] font-medium text-teal bg-teal-light px-3 py-1.5 rounded-full ml-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                  {doctor.availability}
                </span>
              </div>

              <div className="flex gap-6 flex-wrap items-center mt-4 pt-4 border-t border-border">
                {doctor.languages && (
                  <span className="flex items-center gap-2 text-[13px] text-navy/70">
                    <span className="font-medium">Languages:</span> {doctor.languages}
                  </span>
                )}
                {doctor.working_days && (
                  <span className="flex items-center gap-2 text-[13px] text-navy/70">
                    <span className="font-medium">Working Days:</span> {doctor.working_days}
                  </span>
                )}
                {doctor.consultation_type && (
                  <span className="flex items-center gap-2 text-[13px] text-navy/70">
                    <span className="font-medium">Consultation:</span> {doctor.consultation_type}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-7">
              <h2 className="font-display font-semibold text-[18px] text-navy mb-3.5">About {doctor.name}</h2>
              <p className="text-[14px] text-slate leading-[1.75]">{doctor.bio}</p>

              {doctor.education && (
                <div className="mt-5 pt-5 border-t border-border">
                  <h3 className="font-display font-semibold text-[16px] text-navy mb-2">Education</h3>
                  <p className="text-[13px] text-slate leading-[1.75]">{doctor.education}</p>
                </div>
              )}

              {doctor.certifications && (
                <div className="mt-5 pt-5 border-t border-border">
                  <h3 className="font-display font-semibold text-[16px] text-navy mb-2">Certifications</h3>
                  <p className="text-[13px] text-slate leading-[1.75]">{doctor.certifications}</p>
                </div>
              )}
            </div>

            {doctor.hospital_name && (
              <div className="bg-card rounded-xl border border-border p-7">
                <h2 className="font-display font-semibold text-[18px] text-navy mb-4">Hospital</h2>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-navy/8 flex items-center justify-center text-2xl shrink-0"><Hospital size={30} /></div>
                  <div className="flex-1">
                    <p className="text-[15px] font-semibold text-navy mb-1">{doctor.hospital_name}</p>
                    {doctor.hospital_location && (
                      <p className="text-[13px] text-slate-light mb-0.5 flex flex-row items-center gap-1.5"><MapPin size={16} /> {doctor.hospital_location}</p>
                    )}
                    {doctor.hospital_phone && (
                      <p className="text-[13px] text-slate-light flex flex-row items-center gap-1.5"><Phone size={16} /> {doctor.hospital_phone}</p>
                    )}
                    <div className="flex gap-3 mt-3">
                      <button className="flex items-center gap-1.5 text-[12px] font-medium text-navy bg-surface border border-border rounded-lg px-3 py-1.5 hover:border-teal">
                        <Globe size={14} /> Website
                      </button>
                      <button className="flex items-center gap-1.5 text-[12px] font-medium text-navy bg-surface border border-border rounded-lg px-3 py-1.5 hover:border-teal">
                        <MapPin size={14} /> Map
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-card rounded-xl border border-border p-7">
              <h2 className="font-display font-semibold text-[18px] text-navy mb-4">Specialties</h2>
              <div className="grid grid-cols-2 gap-2.5">
                {specialtiesList.map(s => (
                  <div key={s} className="flex items-center gap-2.5 text-[13px] text-slate px-3.5 py-2.5 bg-surface rounded-lg border border-border">
                    <span className="text-teal"><Check size={16} /></span>{s}
                  </div>
                ))}
              </div>
            </div>

            <ReviewsSection doctorId={doctor.id} />
          </div>

          <div className="sticky top-5">
            <BookingForm doctorId={doctor.id} doctorName={doctor.name} hospitalIds={doctor.hospital_ids} fee={doctor.fee} />
          </div>
        </div>
      </div>
    </div>
  )
}
