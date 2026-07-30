import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/layout/navbar'
import DoctorGrid from '../components/doctor/doctor-grid'
import { fetchDoctors, fetchHospitals } from '../services/api'
import { Search, X } from 'lucide-react'

export default function BrowsePage() {
  const [doctors, setDoctors] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [specialties, setSpecialties] = useState(['General Practice','Pediatrics','Dentistry','Dermatology','Cardiology'])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  const [query, setQuery] = useState(() => searchQuery)

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
        console.error('Failed to load doctors:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      setSearchParams({ search: trimmed })
    } else {
      setSearchParams({})
    }
  }

  const clearSearch = () => {
    setQuery('')
    setSearchParams({})
  }

  return (
    <div className="bg-surface min-h-screen">
      <Navbar />
      <div className="sticky top-0 z-40 bg-surface/80 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-15 py-3">
          <form onSubmit={handleSearch} className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2.5">
            <Search size={18} className="text-slate-light shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search doctors by name, specialty, or hospital..."
              className="bg-transparent outline-none text-navy placeholder:text-slate-light flex-1 text-[13px]"
            />
            {query && (
              <button type="button" onClick={clearSearch} className="text-slate hover:text-navy transition-colors cursor-pointer">
                <X size={16} />
              </button>
            )}
          </form>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-15 py-10">
        <p className="text-[11px] font-semibold text-teal uppercase tracking-wider mb-2">Find a doctor</p>
        <h1 className="font-display font-bold text-[36px] text-navy mb-2">Browse by specialty</h1>
        <p className="text-[15px] text-slate mb-8 max-w-135">Every doctor on BookPro is verified and licensed. Filter by specialty to find the care you need.</p>
        {loading ? (
          <p className="text-slate">Loading doctors...</p>
        ) : (
          <DoctorGrid doctors={doctors} specialties={specialties} hospitals={hospitals} searchQuery={searchQuery} />
        )}
      </div>
    </div>
  )
}
