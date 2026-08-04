import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/auth-context'
import ThemeToggle from '../theme/theme-toggle'

export default function Navbar({ showLogo = true }) {
  const { isAuthenticated, logout, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const isLandingPage = location.pathname === '/'
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleBrowseDoctorsClick = (e) => {
    if (!isLandingPage) {
      window.location.href = '/#doctors-section'
    } else {
      const doctorsSection = document.getElementById('doctors-section')
      if (doctorsSection) {
        e.preventDefault()
        doctorsSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleHowItWorksClick = (e) => {
    if (!isLandingPage) {
      window.location.href = '/#how-it-works'
    } else {
      const howItWorksSection = document.getElementById('how-it-works')
      if (howItWorksSection) {
        e.preventDefault()
        howItWorksSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-[3.75rem] transition-all duration-300 ${
      scrolled
        ? 'bg-white/70 dark:bg-[#1a2332]/90 backdrop-blur-xl border-b border-border dark:border-b-0 shadow-[0_1px_2px_#CBD5E1] dark:shadow-none'
        : 'bg-card border-b border-border'
    }`}>
      <div className="flex items-center">
        {showLogo && (
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="font-display font-bold text-xl text-navy dark:text-white">
            Book<span className="text-teal">Pro</span>
          </Link>
        )}
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
        <a href="#doctors-section" onClick={handleBrowseDoctorsClick} className="text-sm text-slate px-4 py-2 rounded-md hover:bg-teal-light hover:text-teal transition-colors dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-teal">Browse doctors</a>
        <Link to="/portal" className="text-sm text-slate px-4 py-2 rounded-md hover:bg-teal-light hover:text-teal transition-colors dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-teal">Portal</Link>
        <Link to="/dashboard" className="text-sm text-slate px-4 py-2 rounded-md hover:bg-teal-light hover:text-teal transition-colors dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-teal">Dashboard</Link>
        <a href="#how-it-works" onClick={handleHowItWorksClick} className="text-sm text-slate px-4 py-2 rounded-md hover:bg-teal-light hover:text-teal transition-colors dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-teal">How it works</a>
      </div>
      <div className="flex items-center gap-2.5">
        <ThemeToggle />
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
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
            <Link to="/login" className="text-sm text-slate px-4 py-2 rounded-md hover:bg-teal-light hover:text-teal transition-colors dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-teal">Login</Link>
            <Link to="/register" className="text-sm bg-teal text-white px-4 py-2 rounded-lg hover:bg-teal-light transition-colors">Sign up</Link>
          </div>
        )}
      </div>
    </nav>
  )
}