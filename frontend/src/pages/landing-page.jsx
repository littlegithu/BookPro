import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Shield, ClipboardList, Timer, Play, Hospital, MapPin } from 'lucide-react'
import Navbar from '../components/layout/navbar'
import Footer from '../components/layout/footer'
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
      <div className="max-w-7xl mx-auto px-[3.75rem] py-[5.5rem] grid grid-cols-2 gap-[4.5rem] items-center">
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
            <a href="#doctors-section" className="bg-teal text-white text-[14px] font-medium px-6 py-3 rounded-lg hover:bg-teal-mid transition-colors">
              Browse doctors
            </a>
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

          <div className="mt-8">
            <Link to="/login" className="text-[14px] font-medium text-teal hover:underline">
              Already have an account? Sign in
            </Link>
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
      <div className="max-w-7xl mx-auto border-t border-border py-[2.5rem] px-[2.5rem]">
        <div className="max-w-7xl mx-auto">
          <p className="text-[11px] font-semibold text-slate-light uppercase tracking-wider mb-3.5 px-[2.5rem]">Our partnered hospitals</p>
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
      <div id="doctors-section" className="bg-card border-b border-border py-[2.5rem] px-[3.75rem]">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-[2.5rem]">
              <span className="inline-block w-6 h-6 border-2 border-teal border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            </div>
          ) : (
            <DoctorGrid doctors={doctors} specialties={specialties} hospitals={hospitals} />
          )}
        </div>
      </div>

      {/* Features */}
      <div id="how-it-works" className="max-w-7xl mx-auto px-[3.75rem] py-16">
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
      <div className="bg-teal py-14 px-[3.75rem]">
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

      <Footer />
    </div>
  )
}