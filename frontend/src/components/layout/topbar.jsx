import { Search, Bell, Home } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import ThemeToggle from '../theme/theme-toggle'

export default function Topbar({ title, subtitle }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const { isAuthenticated, logout, user } = useAuth()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/doctors?search=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div className={`fixed top-0 left-60 right-0 z-40 h-16 flex items-center justify-between px-8 transition-all duration-300 ${
      scrolled
        ? 'bg-white/70 dark:bg-[#1a2332]/90 backdrop-blur-xl border-b border-border dark:border-b-0 shadow-[0_1px_2px_#CBD5E1] dark:shadow-none'
        : 'bg-card border-b border-border'
    }`}>
      <div>
        <h1 className="font-display font-bold text-[20px] text-navy leading-tight dark:text-white">{title}</h1>
        {subtitle && <p className="text-xs text-slate-light mt-0.5 dark:text-white/60">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2.5">
        <Link to="/" className="w-9 h-9 rounded-lg border border-border bg-none flex items-center justify-center text-slate hover:bg-surface transition-colors dark:text-white/70 dark:border-white/15 dark:hover:bg-white/10 dark:hover:text-white" title="Home">
          <Home size={18} />
        </Link>
        <form onSubmit={handleSearch} className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2 text-[13px] text-slate-light dark:bg-white/10 dark:border-white/15 dark:text-white/60">
          <Search size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search doctors…"
            className="bg-transparent outline-none text-navy placeholder:text-slate-light w-40 dark:text-white dark:placeholder:text-white/50"
          />
        </form>
        <ThemeToggle />
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-lg border border-border bg-none flex items-center justify-center text-slate hover:bg-surface transition-colors dark:text-white/70 dark:border-white/15 dark:hover:bg-white/10 dark:hover:text-white"><Bell size={18} /></button>
            <Link to="/profile" className="flex items-center gap-2 text-sm text-slate px-3 py-2 rounded-md hover:bg-teal-light hover:text-teal transition-colors dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-teal">
              <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
                {user?.profile_image ? (
                  <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'
                )}
              </div>
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <button onClick={() => logout()} className="text-sm text-slate px-4 py-2 rounded-md hover:bg-teal-light hover:text-teal transition-colors dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-teal">Logout</button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-lg border border-border bg-none flex items-center justify-center text-slate hover:bg-surface transition-colors dark:text-white/70 dark:border-white/15 dark:hover:bg-white/10 dark:hover:text-white"><Bell size={18} /></button>
            <Link to="/login" className="text-sm text-slate px-4 py-2 rounded-md hover:bg-teal-light hover:text-teal transition-colors dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-teal">Login</Link>
          </div>
        )}
      </div>
    </div>
  )
}
