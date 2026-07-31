import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Shield, ClipboardList, Timer, Play, Hospital, MapPin } from 'lucide-react'
import Navbar from '../components/layout/navbar'
import DoctorGrid from '../components/doctor/doctor-grid'
import { fetchDoctors, fetchHospitals } from '../services/api'

const FEATURES = [
  { icon: <Timer size={22} className="text-teal" />, title: 'Book in under 2 minutes',    desc: 'Pick a doctor, choose a slot, confirm. No phone calls, no waiting on hold.' },
  { icon: <Shield size={22} className="text-teal" />, title: 'Verified professionals only', desc: 'Every doctor is licensed and credentialed before joining the platform.' },
  { icon: <ClipboardList size={22} className="text-teal" />, title: 'Your records, in one place', desc: 'Access diagnoses, prescriptions, and follow-up notes from every visit.' },
]

export default function LandingPage() {
  const [doctors, setDoctors] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [specialties, setSpecialties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [doctorsData, hospitalsData] = await Promise.all([
          fetchDoctors(),
          fetchHospitals(),
        ])
        setDoctors(doctorsData)
        setHospitals(hospitalsData)
        const specialtySet = new Set(doctorsData.map(d => d.specialty).filter(Boolean))
        setSpecialties(['All', ...Array.from(specialtySet)])
      } catch (err) {
        console.error('Failed to load landing data:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="bg-surface min-h-screen pt-16">
      <Navbar />

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-15 py-22 grid grid-cols-2 gap-18 items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-teal-light text-teal text-[11px] font-semibold px-3.5 py-1.5 rounded-full mb-5 uppercase tracking-wider">
            <Shield size={12} /> Verified clinical care
          </span>
          <h1 className="font-display font-bold text-[52px] text-navy leading-[1.12] mb-5">
            Book your <em className="italic text-teal">checkup</em><br />in minutes
          </h1>
          <p className="text-[16px] text-slate leading-[1.75] mb-8 max-w-120">
            Find verified doctors across our network of partner hospitals, pick a time that works for you, and walk in ready.
          </p>
          <div className="flex gap-3 items-center">
            <Link to="/doctors" className="bg-teal text-white text-[14px] font-medium px-6 py-3 rounded-lg hover:bg-teal-mid transition-colors">
              Book an appointment
            </Link>
            <a href="#how-it-works" className="text-[14px] font-medium text-navy border border-border-strong px-6 py-3 rounded-lg hover:bg-surface transition-colors flex items-center gap-1.5">
              <Play size={13} /> See how it works
            </a>
          </div>
          <div className="flex gap-9 mt-11 pt-9 border-t border-border">
            {[['120+','Verified doctors'],['3+','Partner hospitals'],['4.9★','Average rating']].map(([v, l]) => (
              <div key={l}>
                <p className="font-display font-bold text-[28px] text-navy">{v}</p>
                <p className="text-[12px] text-slate-light mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hero visual */}
        <div className="bg-card rounded-2xl border border-border p-6 flex flex-col gap-2.5 shadow-[0_4px_24px_rgba(30,45,61,0.06)]">
          <p className="text-[10px] font-semibold text-slate-light uppercase tracking-widest mb-1">How it works</p>
          <div className="flex items-start gap-3 px-4 py-3.5 rounded-lg border border-border bg-surface">
            <div className="w-10 h-10 rounded-full bg-teal-light flex items-center justify-center text-teal text-[13px] font-semibold shrink-0">1</div>
            <div>
              <p className="text-[13px] font-medium text-navy">Search doctors</p>
              <p className="text-[11px] text-slate-light mt-0.5">Browse by specialty or hospital</p>
            </div>
          </div>
          <div className="flex items-start gap-3 px-4 py-3.5 rounded-lg border border-border bg-surface">
            <div className="w-10 h-10 rounded-full bg-teal-light flex items-center justify-center text-teal text-[13px] font-semibold shrink-0">2</div>
            <div>
              <p className="text-[13px] font-medium text-navy">Book a slot</p>
              <p className="text-[11px] text-slate-light mt-0.5">Pick a date and time that works</p>
            </div>
          </div>
          <div className="flex items-start gap-3 px-4 py-3.5 rounded-lg border border-border bg-surface">
            <div className="w-10 h-10 rounded-full bg-teal-light flex items-center justify-center text-teal text-[13px] font-semibold shrink-0">3</div>
            <div>
              <p className="text-[13px] font-medium text-navy">Attend checkup</p>
              <p className="text-[11px] text-slate-light mt-0.5">Walk in ready for your appointment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hospital strip */}
      <div className="max-w-7xl mx-auto border-t border-border py-10 px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-[11px] font-semibold text-slate-light uppercase tracking-wider mb-3.5 px-10">Our partnered hospitals</p>
          <div className="flex w-full gap-4">
            {hospitals.map(h => (
              <div key={h.id} className="flex max-w-7xl mx-auto items-center justify-between gap-3 px-8 py-2.5">
                <div className="flex flex-col items-start gap-1.5">
                  <p className="text-[24px] font-medium text-navy flex flex-row items-center gap-1.5"><span><Hospital size={16} /></span>{h.name}</p>
                  <p className="text-[11px] text-slate-light flex flex-row items-center gap-1.5"><span><MapPin size={16} /></span>{h.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Doctor grid */}
      <div className="bg-card border-b border-border py-10 px-15">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <span className="inline-block w-6 h-6 border-2 border-teal border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            </div>
          ) : (
            <DoctorGrid doctors={doctors} specialties={specialties} hospitals={hospitals} />
          )}
        </div>
      </div>

      {/* Features */}
      <div id="how-it-works" className="max-w-7xl mx-auto px-15 py-16">
        <p className="text-[11px] font-semibold text-teal uppercase tracking-wider mb-2">Why BookPro</p>
        <h2 className="font-display font-bold text-[32px] text-navy mb-10">Care that fits your life</h2>
        <div className="grid grid-cols-3 gap-5">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-card rounded-xl border border-border p-7">
              <div className="w-11 h-11 rounded-lg bg-teal-light flex items-center justify-center mb-4">{f.icon}</div>
              <h3 className="font-display font-semibold text-[17px] text-navy mb-2">{f.title}</h3>
              <p className="text-[13px] text-slate leading-[1.7]">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA strip */}
      <div className="bg-teal py-14 px-15">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          <div>
            <h2 className="font-display font-bold text-[28px] text-white mb-1.5">Ready to take care of your health?</h2>
            <p className="text-[14px] text-white/70">Book with verified doctors across {hospitals.length} partner hospitals.</p>
          </div>
          <Link to="/register" className="shrink-0 bg-white text-teal text-[14px] font-semibold px-8 py-3.5 rounded-lg hover:bg-teal-light transition-colors">
            Create a free account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#1E2D3D] px-15 pt-14 pb-8 dark:bg-[#1E2D3D]">
        <div className="max-w-7xl mx-auto grid grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">
          <div>
            <p className="font-display font-bold text-[18px] text-white">Book<span style={{ color: '#5CD6C4' }}>Pro</span></p>
            <p className="text-[13px] mt-3 max-w-55 leading-[1.75]" style={{ color: 'rgba(255,255,255,0.42)' }}>
              Clinical checkups made simple across our network of partner hospitals.
            </p>
          </div>
          {[
            ['Patients', ['Browse doctors', 'How it works', 'My appointments', 'Medical records']],
            ['Company',  ['About us', 'Contact', 'Careers', 'Blog']],
            ['Legal',    ['Privacy policy', 'Terms of use', 'Cookie policy']],
          ].map(([h, links]) => (
            <div key={h}>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-3.5 text-white/65">{h}</p>
              {links.map(l => <p key={l} className="text-[13px] mb-2 cursor-pointer hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.42)' }}>{l}</p>)}
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto flex justify-between pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-[12px] text-white/28">© 2026 BookPro. All rights reserved.</p>
          <p className="text-[12px] text-white/28">Made with care in Nairobi</p>
        </div>
      </div>
    </div>
  )
}