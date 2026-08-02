import { Search, Bell } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'

export default function Topbar({ title, subtitle }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const { user } = useAuth()

  const initials = user?.name
    ? user.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'G'

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/doctors?search=${encodeURIComponent(query.trim())}`)
    }
  }