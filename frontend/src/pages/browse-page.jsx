import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/navbar'
import DoctorGrid from '../components/doctor/doctor-grid'
import { fetchDoctors, fetchHospitals, fetchDoctorSearchSuggestions } from '../services/api'
import { Search, X } from 'lucide-react'

export default function BrowsePage() {
  const [doctors, setDoctors] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [specialties, setSpecialties] = useState(['General Practice','Pediatrics','Dentistry','Dermatology','Cardiology'])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const searchQuery = searchParams.get('search') || ''
  const [query, setQuery] = useState(() => searchQuery)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const searchFormRef = useRef(null)

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

  useEffect(() => {
    const timer = setTimeout(async () => {
      const trimmed = query.trim()
      if (trimmed.length < 2) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }
      setSuggestionsLoading(true)
      try {
        const data = await fetchDoctorSearchSuggestions(trimmed)
        setSuggestions(data)
        setShowSuggestions(true)
      } catch (err) {
        console.error('Failed to load suggestions:', err)
      } finally {
        setSuggestionsLoading(false)
      }
    }, 200)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchFormRef.current && !searchFormRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      setSearchParams({ search: trimmed })
    } else {
      setSearchParams({})
    }
    setShowSuggestions(false)
  }

  const clearSearch = () => {
    setQuery('')
    setSearchParams({})
    setShowSuggestions(false)
  }

  const selectSuggestion = (item) => {
    setQuery(item.label)
    setShowSuggestions(false)
    if (item.type === 'doctor') {
      navigate(`/doctors/${item.id}`)
    } else if (item.type === 'hospital') {
      setSearchParams({ search: item.label })
    } else {
      setSearchParams({ search: item.label })
    }
  }

  return (
    <div className="bg-surface min-h-screen pt-16">
      <Navbar showLogo={false} />
      <div className="sticky top-0 z-40 bg-surface/80 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-15 py-3">
          <form ref={searchFormRef} onSubmit={handleSearch} className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2.5 relative dark:bg-card dark:border-white/15">
            <Search size={18} className="text-slate-light shrink-0 dark:text-white/60" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search doctors by name, specialty, or hospital..."
              className="bg-transparent outline-none text-navy placeholder:text-slate-light flex-1 text-[13px] dark:text-white dark:placeholder:text-white/50"
            />
            {query && (
              <button type="button" onClick={clearSearch} className="text-slate hover:text-navy transition-colors cursor-pointer dark:text-white/60 dark:hover:text-white">
                <X size={16} />
              </button>
            )}
            {showSuggestions && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto dark:bg-card dark:border-white/15">
                {suggestionsLoading && (
                  <div className="px-4 py-3 text-[13px] text-slate dark:text-white/60">Loading suggestions...</div>
                )}
                {!suggestionsLoading && suggestions.length === 0 && (
                  <div className="px-4 py-3 text-[13px] text-slate dark:text-white/60">No suggestions found</div>
                )}
                {!suggestionsLoading && suggestions.map((item) => (
                  <button
                    key={`${item.type}-${item.id}`}
                    type="button"
                    onClick={() => selectSuggestion(item)}
                    className="w-full text-left px-4 py-2.5 text-[13px] text-navy hover:bg-surface transition-colors border-b border-border last:border-b-0 dark:text-white dark:hover:bg-white/10"
                  >
                    <span className="font-medium">{item.label}</span>
                    {item.subtitle && (
                      <span className="ml-2 text-[11px] text-slate-light dark:text-white/60">{item.subtitle}</span>
                    )}
                    <span className="ml-2 text-[11px] text-slate-light uppercase dark:text-white/60">{item.type}</span>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-15 py-10">
        <p className="text-[11px] font-semibold text-teal uppercase tracking-wider mb-2">Find a doctor</p>
        <h1 className="font-display font-bold text-[36px] text-navy mb-2 dark:text-white">Browse by specialty</h1>
        <p className="text-[15px] text-slate mb-8 max-w-135 dark:text-white/60">Every doctor on BookPro is verified and licensed. Filter by specialty to find the care you need.</p>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <span className="inline-block w-6 h-6 border-2 border-teal border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          </div>
        ) : (
          <DoctorGrid doctors={doctors} specialties={specialties} hospitals={hospitals} searchQuery={searchQuery} />
        )}
      </div>
    </div>
  )
}
