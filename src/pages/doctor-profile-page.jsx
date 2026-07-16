import { useParams, Link } from 'react-router-dom'
import { Briefcase, MapPin, Clock, Check, Stethoscope, Hospital, Phone } from 'lucide-react'
import Navbar from '../components/layout/navbar'
import Breadcrumb from '../components/shared/breadcrumb'
import SpecialtyBadge from '../components/shared/specialty-badge'
import BookingForm from '../components/booking/booking-form'
import { DOCTORS, SPECIALTIES, HOSPITALS } from '../data/mock-data'

export default function DoctorProfilePage() {
  const { id } = useParams()
  const doctor = DOCTORS.find(d => d.id === Number(id)) ?? DOCTORS[0]
  const { hospital } = doctor

  const initials = doctor.name
    .split(' ')
    .filter(n => n !== 'Dr.')
    .map(n => n[0])
    .join('')
    .slice(0, 2)

  return (
    <div className="bg-surface min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-15">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Doctors', to: '/doctors' }, { label: doctor.name }]} />

        <div className="grid grid-cols-[1fr_400px] gap-7 pb-16">
          <div className="flex flex-col gap-5">
            <div className="bg-card rounded-xl border border-border p-8">
              <div className="flex gap-5 items-start pb-5 border-b border-border mb-5">
                <div className="w-22 h-22 rounded-full bg-teal-light flex items-center justify-center font-display font-bold text-[26px] text-teal shrink-0">
                  {initials}
                </div>
                <div className="flex-1">
                  <h1 className="font-display font-bold text-[26px] text-navy mb-1">{doctor.name}</h1>
                  <p className="text-[14px] text-slate mb-1">{doctor.specialty}</p>

                  {/* Hospital info */}
                  {hospital && (
                    <div className="flex flex-row items-center gap-2 text-[13px] text-navy/70 bg-surface border border-border rounded-lg px-3 py-1.5 w-fit mb-3">
                      <span className="font-medium flex flex-row items-center gap-2"><Stethoscope size={16} className="text-slate-light" />{hospital.name}</span>
                      <span className="text-slate-light">· {hospital.location}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5">
                    {doctor.tags.map(t => <SpecialtyBadge key={t} label={t} />)}
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
                {hospital && (
                  <span className="flex items-center gap-2 text-[13px] text-slate"><Phone size={16} /> {hospital.phone}</span>
                )}
                <span className="flex items-center gap-1.5 text-[12px] font-medium text-teal bg-teal-light px-3 py-1.5 rounded-full ml-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                  {doctor.availability}
                </span>
              </div>
            </div>

            {/* About */}
            <div className="bg-card rounded-xl border border-border p-7">
              <h2 className="font-display font-semibold text-[18px] text-navy mb-3.5">About {doctor.name}</h2>
              <p className="text-[14px] text-slate leading-[1.75]">{doctor.bio}</p>
            </div>

            {/* Hospital detail card */}
            {hospital && (
              <div className="bg-card rounded-xl border border-border p-7">
                <h2 className="font-display font-semibold text-[18px] text-navy mb-4">Hospital</h2>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-navy/8 flex items-center justify-center text-2xl shrink-0"><Hospital size={30} /></div>
                  <div>
                    <p className="text-[15px] font-semibold text-navy mb-1">{hospital.name}</p>
                    <p className="text-[13px] text-slate-light mb-0.5 flex flex-row items-center gap-1.5"><MapPin size={16} /> {hospital.location}</p>
                    <p className="text-[13px] text-slate-light flex flex-row items-center gap-1.5"><Phone size={16} /> {hospital.phone}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Specialties */}
            <div className="bg-card rounded-xl border border-border p-7">
              <h2 className="font-display font-semibold text-[18px] text-navy mb-4">Specialties</h2>
              <div className="grid grid-cols-2 gap-2.5">
                {doctor.specialties.map(s => (
                  <div key={s} className="flex items-center gap-2.5 text-[13px] text-slate px-3.5 py-2.5 bg-surface rounded-lg border border-border">
                    <span className="text-teal"><Check size={16} /></span>{s}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — booking form */}
          <div className="sticky top-5">
            <BookingForm doctorId={doctor.id} doctorName={doctor.name} />
          </div>
        </div>
      </div>
    </div>
  )
}
