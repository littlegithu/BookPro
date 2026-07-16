import { useParams, Link } from 'react-router-dom'
import { Briefcase, MapPin, Clock, Check, Stethoscope, Hospital, Phone } from 'lucide-react'
import Navbar from '../components/layout/navbar'
import Breadcrumb from '../components/shared/breadcrumb'
import SpecialtyBadge from '../components/shared/specialty-badge'
import BookingForm from '../components/booking/booking-form'

const HOSPITALS = [
  { id: 1, name: 'Kenyatta National Hospital', location: 'Nairobi CBD', phone: '+254 20 272 6300' },
  { id: 2, name: 'Aga Khan University Hospital', location: 'Parklands, Nairobi', phone: '+254 20 366 2000' },
  { id: 3, name: 'MP Shah Hospital', location: 'Parklands, Nairobi', phone: '+254 20 428 1000' },
]

const DOCTORS = [
  { id: 1, name: 'Dr. Jane Mwangi', specialty: SPECIALTIES[0], experience: '12 years', hours: 'Mon–Fri, 8am–4pm', rating: 4.9, reviews: 142, tags: ['Family Medicine','Checkups'], availability: 'Available today', hospital: HOSPITALS[0], bio: 'Board-certified GP with 12 years experience in family and preventive medicine. She completed her degree at the University of Nairobi and focuses on making primary care accessible.', specialties: ['Routine checkups','Chronic disease management','Vaccinations','Nutrition & wellness','Respiratory care','Preventive screening'] },
  { id: 2, name: 'Dr. Kevin Omondi', specialty: SPECIALTIES[1], experience: '8 years', hours: 'Mon–Sat, 9am–5pm', rating: 4.8, reviews: 98, tags: ['Child Health','Vaccines'], availability: 'Available Wed', hospital: HOSPITALS[1], bio: 'Dedicated pediatrician passionate about child health and development.', specialties: ['Child checkups','Vaccinations','Growth monitoring','Child nutrition'] },
  { id: 3, name: 'Dr. Amara Patel', specialty: SPECIALTIES[3], experience: '10 years', hours: 'Tue–Sat, 10am–6pm',rating: 4.7, reviews: 76, tags: ['Skin Care','Acne'], availability: 'Available Fri', hospital: HOSPITALS[1], bio: 'Specialist in skin conditions and aesthetic dermatology.', specialties: ['Acne treatment','Eczema','Skin cancer screening','Aesthetic dermatology'] },
  { id: 4, name: 'Dr. Rita Lee', specialty: SPECIALTIES[4], experience: '15 years', hours: 'Mon–Fri, 8am–3pm', rating: 4.9, reviews: 201, tags: ['Heart Health','ECG'], availability: 'Available Thu', hospital: HOSPITALS[0], bio: 'Cardiologist focused on preventive heart health and chronic disease management.', specialties: ['ECG','Heart failure management','Hypertension','Preventive cardiology'] },
  { id: 5, name: 'Dr. Brian Mutua', specialty: 'Dentistry', experience: '7 years', hours: 'Mon–Fri, 9am–5pm', rating: 4.6, reviews: 54, tags: ['Dental Care','Orthodontics'], availability: 'Available Mon', hospital: HOSPITALS[2], bio: 'General dentist with expertise in restorative and preventive dental care.', specialties: ['Dental checkups','Fillings','Orthodontics','Teeth whitening'] },
  { id: 6, name: 'Dr. Sarah Wanjiku', specialty: 'General Practice', experience: '9 years', hours: 'Mon–Fri, 8am–4pm', rating: 4.8, reviews: 113, tags: ['Checkups','Nutrition'], availability: 'Available Tue', hospital: HOSPITALS[2], bio: 'Family medicine practitioner with a focus on nutrition and wellness.', specialties: ['Wellness checkups','Nutrition counselling','Chronic disease management','Preventive care'] },
  { id: 7, name: 'Dr. David Otieno', specialty: 'Pediatrics', experience: '6 years', hours: 'Mon–Sat, 8am–5pm', rating: 4.7, reviews: 67,  tags: ['Child Health','Growth'], availability: 'Available Wed', hospital: HOSPITALS[0], bio: 'Pediatrician specializing in growth monitoring and child nutrition.', specialties: ['Growth monitoring','Child nutrition','Vaccinations','Developmental assessment'] },
  { id: 8, name: 'Dr. Nancy Kamau', specialty: 'Dermatology', experience: '11 years', hours: 'Tue–Fri, 9am–4pm', rating: 4.8, reviews: 89,  tags: ['Skin Care','Allergies'], availability: 'Available Fri', hospital: HOSPITALS[2], bio: 'Dermatologist with expertise in skin allergies and chronic skin conditions.', specialties: ['Allergies','Eczema','Psoriasis','Skin checkups'] },
]

const SPECIALTIES = ['General Practice','Pediatrics','Dentistry','Dermatology','Cardiology']

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
                    <div className="flex items-center gap-1.5 text-[13px] text-navy/70 bg-surface border border-border rounded-lg px-3 py-1.5 w-fit mb-3">
                      <span className="font-medium"><Stethoscope size={16} />{hospital.name}</span>
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
                  <div className="w-12 h-12 rounded-lg bg-navy/8 flex items-center justify-center text-2xl shrink-0"><Hospital size={40} /></div>
                  <div>
                    <p className="text-[15px] font-semibold text-navy mb-1">{hospital.name}</p>
                    <p className="text-[13px] text-slate-light mb-0.5"><MapPin size={16} /> {hospital.location}</p>
                    <p className="text-[13px] text-slate-light"><Phone size={16} /> {hospital.phone}</p>
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
