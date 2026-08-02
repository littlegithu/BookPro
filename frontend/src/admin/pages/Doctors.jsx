import { useState, useEffect } from 'react'
import { fetchDoctors } from '../../services/api'
import StatsCard from '../components/StatsCard'
import DataTable from '../components/DataTable'

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchDoctors()
        setDoctors(data)
      } catch (err) {
        console.error('Failed to fetch doctors:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const stats = {
    total: doctors.length,
    available: doctors.filter(d => d.available).length,
    unavailable: doctors.filter(d => !d.available).length,
    averageRating: doctors.length
      ? (doctors.reduce((sum, d) => sum + (d.rating || 0), 0) / doctors.length).toFixed(1)
      : 0,
  }

  const columns = [
    { key: 'name', header: 'Doctor' },
    { key: 'specialty', header: 'Specialty' },
    { key: 'hospital_name', header: 'Hospital' },
    { key: 'rating', header: 'Rating' },
    { key: 'reviews', header: 'Reviews' },
    { key: 'available', header: 'Status' },
    { key: 'actions', header: 'Actions' },
  ]

  const rows = doctors.map(d => ({
    ...d,
    available: d.available ? 'Available' : 'Unavailable',
    actions: 'Edit | Delete',
  }))

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Doctor Management</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total Doctors" value={stats.total} />
        <StatsCard label="Available" value={stats.available} />
        <StatsCard label="Unavailable" value={stats.unavailable} />
        <StatsCard label="Average Rating" value={stats.averageRating} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading doctors...</p>
        </div>
      ) : (
        <DataTable columns={columns} rows={rows} />
      )}
    </div>
  )
}