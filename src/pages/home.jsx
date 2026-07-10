import { Link } from 'react-router-dom'
import { Calendar, Shield, ClipboardList, Timer, Play } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import DoctorGrid from '../components/doctor/DoctorGrid'

const DOCTORS = [
  { id: 1, name: 'Dr. Jane Mwangi',  specialty: 'General Practice', location: 'Nairobi', tags: ['Family Medicine','Checkups'], availability: 'Available today' },
  { id: 2, name: 'Dr. Kevin Omondi', specialty: 'Pediatrics', location: 'Nairobi', tags: ['Child Health','Vaccines'], availability: 'Available Wed' },
  { id: 3, name: 'Dr. Amara Patel',  specialty: 'Dermatology', location: 'Nairobi', tags: ['Skin Care','Acne'], availability: 'Available Fri' },
  { id: 4, name: 'Dr. Rita Lee', specialty: 'Cardiology', location: 'Nairobi', tags: ['Heart Health','ECG'], availability: 'Available Thu' },
  { id: 5, name: 'Dr. Brian Mutua', specialty: 'Dentistry', location: 'Nairobi', tags: ['Dental Care','Orthodontics'],  availability: 'Available Mon' },
  { id: 6, name: 'Dr. Sarah Wanjiku',specialty: 'General Practice',  location: 'Nairobi', tags: ['Checkups','Nutrition'], availability: 'Available Tue' },
  { id: 7, name: 'Dr. David Otieno', specialty: 'Pediatrics', location: 'Nairobi', tags: ['Child Health','Growth'], availability: 'Available Wed' },
  { id: 8, name: 'Dr. Nancy Kamau', specialty: 'Dermatology', location: 'Nairobi', tags: ['Skin Care','Allergies'], availability: 'Available Fri' },
]

const SPECIALTIES = ['General Practice','Pediatrics','Dentistry','Dermatology','Cardiology']

const FEATURES = [
  { icon: <Timer size={22} />, title: 'Book in under 2 minutes', desc: 'Pick a doctor, choose a slot, confirm. No phone calls, no waiting on hold.' },
  { icon: <Shield size={22} />, title: 'Verified professionals only', desc: 'Every doctor is licensed and credentialed before joining the platform.' },
  { icon: <ClipboardList size={22} />, title: 'Your records, in one place', desc: 'Access diagnoses, prescriptions, and follow-up notes from every visit.' },
]

export default function LandingPage() {
  return (
    <div className="bg-surface min-h-screen">
      <Navbar />

      {/* Hero */}
      <div className="max-w-[1280px] mx-auto px-15 py-22 grid grid-cols-2 gap-18 items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-teal-light text-teal text-[11px] font-semibold px-3.5 py-1.5 rounded-full mb-5 uppercase tracking-wider">
            <Shield size={16} /> Verified clinical care
          </span>
          <h1 className="font-display font-bold text-[52px] text-navy leading-[1.12] mb-5">
            Book your <em className="italic text-teal">checkup</em><br />in minutes
          </h1>
          <p className="text-[16px] text-slate leading-[1.75] mb-8 max-w-[480px]">
            Find verified doctors, pick a time that works for you, and walk in ready. No phone tag, no paper forms.
          </p>
          <div className="flex gap-3 items-center">
            <Link to="/doctors" className="bg-teal text-white text-[14px] font-medium px-6 py-3 rounded-lg hover:bg-teal-mid transition-colors">
              Book an appointment
            </Link>
            <a href="#how-it-works" className="text-[14px] font-medium text-navy border border-border-strong px-6 py-3 rounded-lg hover:bg-surface transition-colors flex items-center gap-1.5">
              <Play size={16} /> See how it works
            </a>
          </div>
          <div className="flex gap-9 mt-11 pt-9 border-t border-border">
            {[['120+','Verified doctors'],['8,400','Appointments booked'],['4.9★','Average rating']].map(([v,l]) => (
              <div key={l}><p className="font-display font-bold text-[28px] text-navy">{v}</p><p className="text-[12px] text-slate-light mt-0.5">{l}</p></div>
            ))}
          </div>
        </div>

        {/* Hero visual */}
        <div className="bg-card rounded-2xl border border-border p-6 flex flex-col gap-2.5 shadow-card">
          <p className="text-[10px] font-semibold text-slate-light uppercase tracking-widest mb-1">Your upcoming appointments</p>
          {[
            { initials:'JM', name:'Dr. Jane Mwangi',  meta:'Mon 14 Jul · 10:00 AM · General Practice', badge:'Confirmed', badgeCls:'bg-success-bg text-success-text', active:true },
            { initials:'KO', name:'Dr. Kevin Omondi', meta:'Wed 16 Jul · 2:00 PM · Pediatrics',          badge:'Pending',   badgeCls:'bg-warning-bg text-warning-text',  active:false },
          ].map(a => (
            <div key={a.name} className={`flex items-center gap-3 px-4 py-3.5 rounded-lg border border-border bg-surface ${a.active ? 'border-l-3 border-l-teal rounded-l-none' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-teal-light flex items-center justify-center text-teal text-[13px] font-semibold flex-shrink-0">{a.initials}</div>
              <div className="flex-1">
                <p className="text-[13px] font-medium text-navy">{a.name}</p>
                <p className="text-[11px] text-slate-light mt-0.5 flex items-center gap-2.5"><Calendar size={14} /> {a.meta}</p>
              </div>
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${a.badgeCls}`}>{a.badge}</span>
            </div>
          ))}
          <div className="border-t border-border pt-3 flex items-center justify-between">
            <p className="text-[11px] text-slate-light">Last visit: Dr. Patel · 12 May 2025</p>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-surface text-slate border border-border">Completed</span>
          </div>
        </div>
      </div>

      {/* Filter + Grid */}
      <div className="bg-card border-y border-border py-5 px-15">
        <div className="max-w-[1280px] mx-auto">
          <DoctorGrid doctors={DOCTORS} specialties={SPECIALTIES} />
        </div>
      </div>

      {/* Features */}
      <div id="how-it-works" className="max-w-[1280px] mx-auto px-15 py-16">
        <p className="text-[11px] font-semibold text-teal uppercase tracking-wider mb-2">Why BookPro</p>
        <h2 className="font-display font-bold text-[32px] text-navy mb-10">Care that fits your life</h2>
        <div className="grid grid-cols-3 gap-5">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-card rounded-xl border border-border p-7">
              <div className="w-11 h-11 rounded-lg bg-teal-light flex items-center justify-center text-xl mb-4">{f.icon}</div>
              <h3 className="font-display font-semibold text-[17px] text-navy mb-2">{f.title}</h3>
              <p className="text-[13px] text-slate leading-[1.7]">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA strip */}
      <div className="bg-teal py-14 px-15">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-8">
          <div>
            <h2 className="font-display font-bold text-[28px] text-white mb-1.5">Ready to take care of your health?</h2>
            <p className="text-[14px] text-white/70">Join thousands of patients who book smarter with BookPro.</p>
          </div>
          <Link to="/register" className="flex-shrink-0 bg-white text-teal text-[14px] font-semibold px-8 py-3.5 rounded-lg hover:bg-teal-light transition-colors">
            Create a free account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-navy px-15 pt-14 pb-8">
        <div className="max-w-[1280px] mx-auto grid grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">
          <div>
            <p className="font-display font-bold text-[18px] text-white">Book<span style={{color:'#5CD6C4'}}>Pro</span></p>
            <p className="text-[13px] mt-3 max-w-[220px] leading-[1.75]" style={{color:'rgba(255,255,255,0.42)'}}>Clinical checkups made simple. Find a verified doctor and book in minutes.</p>
          </div>
          {[
            ['Patients', ['Browse doctors','How it works','My appointments','Medical records']],
            ['Company',  ['About us','Contact','Careers','Blog']],
            ['Legal',    ['Privacy policy','Terms of use','Cookie policy']],
          ].map(([h, links]) => (
            <div key={h}>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-3.5" style={{color:'rgba(255,255,255,0.65)'}}>{h}</p>
              {links.map(l => <p key={l} className="text-[13px] mb-2 cursor-pointer hover:text-white transition-colors" style={{color:'rgba(255,255,255,0.42)'}}>{l}</p>)}
            </div>
          ))}
        </div>
        <div className="max-w-[1280px] mx-auto flex justify-between pt-6 border-t" style={{borderColor:'rgba(255,255,255,0.08)'}}>
          <p className="text-[12px]" style={{color:'rgba(255,255,255,0.28)'}}>© 2026 BookPro. All rights reserved.</p>
          <p className="text-[12px]" style={{color:'rgba(255,255,255,0.28)'}}>Made with care in Nairobi</p>
        </div>
      </div>
    </div>
  )
}
