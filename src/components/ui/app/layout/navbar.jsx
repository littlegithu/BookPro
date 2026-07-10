import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="bg-card border-b border-border h-16 flex items-center justify-between px-15 sticky top-0 z-50">
      <Link to="/" className="font-display font-bold text-xl text-navy">
        Book<span className="text-teal">Pro</span>
      </Link>
      <div className="flex items-center gap-1">
        <Link to="/doctors" className="text-sm text-slate px-4 py-2 rounded-md hover:bg-teal-light hover:text-teal transition-colors">Browse doctors</Link>
        <a href="#how-it-works" className="text-sm text-slate px-4 py-2 rounded-md hover:bg-teal-light hover:text-teal transition-colors">How it works</a>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="text-sm text-slate px-4 py-2 rounded-md hover:bg-teal-light hover:text-teal transition-colors">Dashboard</Link>
            <button onClick={() => { logout(); navigate('/login') }} className="text-sm text-slate px-4 py-2 rounded-md hover:bg-teal-light hover:text-teal transition-colors">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-slate px-4 py-2 rounded-md hover:bg-teal-light hover:text-teal transition-colors">Login</Link>
            <Link to="/register" className="text-sm font-medium text-white bg-teal px-5 py-2 rounded-md hover:bg-teal-mid transition-colors">Get started</Link>
          </>
        )}
      </div>
    </nav>
  )
}
