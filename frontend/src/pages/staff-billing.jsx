import { useState, useEffect } from 'react'
import { CreditCard, Check, X, FileText, Search } from 'lucide-react'
import StaffDashboardLayout from '../components/layout/staff-dashboard-layout'
import Topbar from '../components/layout/topbar'
import { useAuth } from '../context/auth-context'

export default function StaffBillingPage() {
  const { isAuthenticated } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTransactions() {
      setLoading(true)
      try {
        const mockTransactions = [
          { id: 1, patient: 'John Mwangi', amount: 2500, status: 'Paid', date: '2024-01-15' },
          { id: 2, patient: 'Mary Wanjiku', amount: 3500, status: 'Pending', date: '2024-01-15' },
          { id: 3, patient: 'David Otieno', amount: 1800, status: 'Paid', date: '2024-01-14' },
        ]
        setTransactions(mockTransactions)
      } catch (err) {
        console.error('Failed to load transactions:', err)
      } finally {
        setLoading(false)
      }
    }
    loadTransactions()
  }, [])

  const filteredTransactions = searchQuery
    ? transactions.filter(t => t.patient?.toLowerCase().includes(searchQuery.toLowerCase()))
    : transactions

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green/20 text-green'
      case 'Pending': return 'bg-yellow/20 text-yellow'
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
            <p className="text-navy mb-4">Please log in for billing access</p>
          </div>
        </div>
      </StaffDashboardLayout>
    )
  }

  return (
    <StaffDashboardLayout>
      <Topbar title="Billing" subtitle="Manage patient billing" />
      <div className="p-7">
        <div className="mb-5">
          <div className="relative max-w-md">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-light" />
            <input
              type="text"
              placeholder="Search by patient name..."
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="bg-card rounded-lg border border-border p-4 text-center">
            <CreditCard size={24} className="mx-auto mb-2 text-teal" />
            <p className="font-bold text-navy text-[20px]">Total: KSH 7,800</p>
            <p className="text-[12px] text-slate-light">Today's Revenue</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 text-center">
            <Check size={24} className="mx-auto mb-2 text-green" />
            <p className="font-bold text-navy text-[20px]">12</p>
            <p className="text-[12px] text-slate-light">Paid Today</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 text-center">
            <FileText size={24} className="mx-auto mb-2 text-yellow" />
            <p className="font-bold text-navy text-[20px]">3</p>
            <p className="text-[12px] text-slate-light">Pending</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-10 h-10 border-3 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map(transaction => (
              <div key={transaction.id} className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-navy">{transaction.patient}</h3>
                    <p className="text-[13px] text-slate-light">KSH {transaction.amount.toLocaleString()}</p>
                    <p className="text-[12px] text-slate-light">{transaction.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                    {transaction.status === 'Pending' && (
                      <div className="flex gap-1">
                        <button className="p-1 bg-green/20 text-green rounded">
                          <Check size={16} />
                        </button>
                        <button className="p-1 bg-red/20 text-red rounded">
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filteredTransactions.length === 0 && (
              <div className="text-center py-20 text-slate-light">
                <p>No transactions found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </StaffDashboardLayout>
  )
}