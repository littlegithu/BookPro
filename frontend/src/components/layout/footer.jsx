import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#1E2D3D] px-[3.75rem] pt-14 pb-8 dark:bg-[#1E2D3D]">
      <div className="max-w-7xl mx-auto grid grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">
        <div>
          <p className="font-display font-bold text-[18px] text-white">Book<span style={{ color: '#5CD6C4' }}>Pro</span></p>
          <p className="text-[13px] mt-3 max-w-55 leading-[1.75]" style={{ color: 'rgba(255,255,255,0.42)' }}>
            Clinical checkups made simple across our network of partner hospitals.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-3.5 text-white/65">Patients</p>
          <div className="flex flex-col gap-2">
            <a href="#doctors-section" className="text-[13px] cursor-pointer hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.42)' }} onClick={(e) => {
              if (window.location.pathname !== '/') {
                window.location.href = '/#doctors-section'
              } else {
                e.preventDefault()
                const section = document.getElementById('doctors-section')
                if (section) section.scrollIntoView({ behavior: 'smooth' })
              }
            }}>
              Browse doctors
            </a>
            <a href="#how-it-works" className="text-[13px] cursor-pointer hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.42)' }} onClick={(e) => {
              if (window.location.pathname !== '/') {
                window.location.href = '/#how-it-works'
              } else {
                e.preventDefault()
                const section = document.getElementById('how-it-works')
                if (section) section.scrollIntoView({ behavior: 'smooth' })
              }
            }}>
              How it works
            </a>
            <Link to="/appointments" className="text-[13px] cursor-pointer hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.42)' }}>
              My appointments
            </Link>
            <Link to="/medical-records" className="text-[13px] cursor-pointer hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.42)' }}>
              Medical records
            </Link>
            <Link to="/about" className="text-[13px] cursor-pointer hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.42)' }}>
              About us
            </Link>
          </div>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-3.5 text-white/65">Company</p>
          <div className="flex flex-col gap-2">
            <Link to="/about" className="text-[13px] cursor-pointer hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.42)' }}>
              About us
            </Link>
            <a href="#contact" className="text-[13px] cursor-pointer hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.42)' }} onClick={(e) => {
              if (window.location.pathname !== '/about') {
                window.location.href = '/about#contact'
              } else {
                e.preventDefault()
                const section = document.getElementById('contact')
                if (section) section.scrollIntoView({ behavior: 'smooth' })
              }
            }}>
              Contact
            </a>
          </div>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-3.5 text-white/65">Legal</p>
          <div className="flex flex-col gap-2">
            <Link to="/privacy-policy" className="text-[13px] cursor-pointer hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.42)' }}>
              Privacy policy
            </Link>
            <Link to="/terms-of-use" className="text-[13px] cursor-pointer hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.42)' }}>
              Terms of use
            </Link>
            <Link to="/cookie-policy" className="text-[13px] cursor-pointer hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.42)' }}>
              Cookie policy
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto flex justify-between pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <p className="text-[12px] text-white/28">© 2026 BookPro. All rights reserved.</p>
        <p className="text-[12px] text-white/28">Made with care in Nairobi</p>
      </div>
    </footer>
  )
}