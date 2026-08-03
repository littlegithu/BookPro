import { useState, useEffect } from 'react'
import { CreditCard, Search, Check, X, Pill } from 'lucide-react'
import StaffDashboardLayout from '../components/layout/staff-dashboard-layout'
import Topbar from '../components/layout/topbar'
import { useAuth } from '../context/auth-context'

export default function StaffPharmacyPage() {
  const { isAuthenticated } = useAuth()
  const [prescriptions, setPrescriptions] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPrescriptions() {
      setLoading(true)
      try {
        const mockPrescriptions = [
          { id: 1, patient: 'John Mwangi', medicine: 'Amoxicillin', dosage: '500mg', frequency: '3x daily', status: 'Dispensed', date: '2024-01-15' },
          { id: 2, patient: 'Mary Wanjiku', medicine: 'Paracetamol', dosage: '500mg', frequency: '4x daily', status: 'Pending', date: '2024-01-15' },
          { id: 3, patient: 'David Otieno', medicine: 'Omega-3', dosage: '1 capsule', frequency: '1x daily', status: 'Dispensed', date: '2024-01-14' },
        ]
        setPrescriptions(mockPrescriptions)
      } catch (err) {
        console.error('Failed to load prescriptions:', err)
      } finally {
        setLoading(false)
      }
    }
    loadPrescriptions()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Dispensed': return 'bg-green/20 text-green'
      case 'Pending': return 'bg-yellow/20 text-yellow'
      case 'Ready': return 'bg-blue/20 text-blue'
      case 'Cancelled': return 'bg-red/20 text-red'
      default: return 'bg-slate/10 text-slate'
    }
  }

  if (!isAuthenticated) {
    return (
      <StaffDashboardLayout>
        <Topbar title="Staff Dashboard" subtitle="" />
        <div className="p-7">
          <div className="text-center py-20">
            <p className="text-navy mb-4">Please log in for pharmacy access</p>
          </div>
        </div>
      </StaffDashboardLayout>
    )
  }

  return (
    <StaffDashboardLayout>
      <Topbar title="Pharmacy" subtitle="Manage prescriptions and medications" />
      <div className="p-7">
        <div className="mb-5">
          <div className="relative max-w-md">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-light" />
            <input
              type="text"
              placeholder="Search by patient or medicine..."
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-10 h-10 border-3 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {prescriptions.map(prescription => (
              <div key={prescription.id} className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center text-white font-semibold">
                      <Pill size={18} />
                    </div>
                    <div>
                      <h3 className="font-medium text-navy">{prescription.patient}</h3>
                      <p className="text-[13px] text-slate-light">{prescription.medicine} - {prescription.dosage}</p>
                      <p className="text-[12px] text-slate-light">{prescription.frequency}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${getStatusColor(prescription.status)}`}>
                      {prescription.status}
                    </span>
                    {prescription.status === 'Pending' && (
                      <button className="px-3 py-1 bg-teal text-white rounded hover:bg-teal-mid transition-colors">
                        <Check size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {prescriptions.length === 0 && (
              <div className="text-center py-20 text-slate-light">
                <p>No prescriptions found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </StaffDashboardLayout>
  )
}