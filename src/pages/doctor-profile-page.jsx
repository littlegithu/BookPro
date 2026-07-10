import { useParams, Link } from 'react-router-dom'
import { Briefcase, MapPin, Clock, Check } from 'lucide-react'
import Navbar from '../components/ui/app/layout/navbar'
import Breadcrumb from '../components/ui/app/shared/breadcrumb'
import SpecialtyBadge from '../components/ui/app/shared/speciality-badge'
import BookingForm from '../components/ui/app/booking/booking-form'

const DOCTORS = {
  1: {id:1, name:'Dr. Jane Mwangi', specialty:'General Practice', location:'Kenyatta National Hospital, Nairobi', experience:'12 years', hours:'Mon – Fri, 8am – 4pm', rating:4.9, reviews:142, tags:['General Practice','Family Medicine','Preventive Care','Checkups'], bio:'Dr. Jane Mwangi is a board-certified general practitioner with over 12 years of experience in family and preventive medicine. She completed her medical degree at the University of Nairobi and has since focused on making primary care accessible and patient-centred.', specialties:['Routine checkups','Chronic disease management','Vaccinations','Nutrition & wellness','Respiratory care','Preventive screening']},
  2: {id:2, name:'Dr. Kevin Omondi', specialty:'Pediatrics', location:'Aga Khan Hospital, Nairobi', experience:'8 years',  hours:'Mon – Sat, 9am – 5pm', rating:4.8, reviews:98,  tags:['Pediatrics','Child Health','Vaccines'], bio:'Dr. Kevin Omondi is a dedicated pediatrician passionate about child health and development.', specialties:['Child checkups','Vaccinations','Growth monitoring','Nutrition'] },
}

export default function DoctorProfilePage() {
  const { id } = useParams()
  const doctor = DOCTORS[id] ?? DOCTORS[1]

  return (
    <div className="bg-surface min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-15">
        <Breadcrumb items={[{label:'Home',to:'/'},{label:'Doctors',to:'/doctors'},{label:doctor.name}]} />
        <div className="grid grid-cols-[1fr_400px] gap-7 pb-16">

          {/* Left */}
          <div className="flex flex-col gap-5">
            <div className="bg-card rounded-xl border border-border p-8">
              <div className="flex gap-5 items-start pb-5 border-b border-border mb-5">
                <div className="w-22 h-22 rounded-full bg-teal-light flex items-center justify-center font-display font-bold text-[26px] text-teal shrink-0">
                  {doctor.name.split(' ').filter(n=>n!=='Dr.').map(n=>n[0]).join('').slice(0,2)}
                </div>
                <div className="flex-1">
                  <h1 className="font-display font-bold text-[26px] text-navy mb-1">{doctor.name}</h1>
                  <p className="text-[14px] text-slate mb-3">{doctor.specialty} · {doctor.location}</p>
                  <div className="flex flex-wrap gap-1.5">{doctor.tags.map(t => <SpecialtyBadge key={t} label={t} />)}</div>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-[32px] text-navy">{doctor.rating}</p>
                  <p className="text-[16px] text-yellow-400">★★★★★</p>
                  <p className="text-[12px] text-slate-light">{doctor.reviews} reviews</p>
                </div>
              </div>
              <div className="flex gap-8 flex-wrap">
                <span className="flex items-center gap-2 text-[13px] text-slate"><Briefcase size={16} /> {doctor.experience} experience</span>
                <span className="flex items-center gap-2 text-[13px] text-slate"><MapPin size={16} /> Nairobi, Kenya</span>
                <span className="flex items-center gap-2 text-[13px] text-slate"><Clock size={16} /> {doctor.hours}</span>
                <span className="flex items-center gap-1.5 text-[12px] font-medium text-teal bg-teal-light px-3 py-1.5 rounded-full ml-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal" />Available today
                </span>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-7">
              <h2 className="font-display font-semibold text-[18px] text-navy mb-3.5">About {doctor.name.split(' ')[0]} {doctor.name.split(' ')[1]}</h2>
              <p className="text-[14px] text-slate leading-[1.75]">{doctor.bio}</p>
            </div>

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
