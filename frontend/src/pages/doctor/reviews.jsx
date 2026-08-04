import { useState, useEffect } from 'react'
import { Star, ThumbsUp, MessageSquare, Filter, ChevronDown, Reply } from 'lucide-react'
import Topbar from '../../components/layout/topbar'
import DoctorDashboardLayout from '../../components/layout/doctor-dashboard-layout'
import { getDoctorReviews } from '../../services/api'

export default function DoctorReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filterRating, setFilterRating] = useState('all')

  useEffect(() => {
    loadReviews()
  }, [])

  async function loadReviews() {
    try {
      const data = await getDoctorReviews()
      setReviews(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)
    return (
      <span className="text-yellow-400">
        {'★'.repeat(fullStars)}{halfStar && '★'}{'☆'.repeat(emptyStars)}
      </span>
    )
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : '0.0'

  const recommendationRate = reviews.length > 0
    ? Math.round((reviews.filter(r => r.recommended || r.rating >= 4).length / reviews.length) * 100)
    : 0

  const filteredReviews = reviews
    .filter(r => filterRating === 'all' || r.rating === parseInt(filterRating))
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at)
      if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at)
      if (sortBy === 'highest') return (b.rating || 0) - (a.rating || 0)
      if (sortBy === 'lowest') return (a.rating || 0) - (b.rating || 0)
      return 0
    })

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  const handleReply = (reviewId) => {
    const replyText = prompt('Enter your reply:')
    if (replyText) {
      alert(`Reply sent to review #${reviewId}: ${replyText}`)
    }
  }

  if (loading) {
    return (
      <DoctorDashboardLayout>
        <Topbar title="Reviews" subtitle="Loading reviews..." />
        <div className="p-7">
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </DoctorDashboardLayout>
    )
  }

  return (
    <DoctorDashboardLayout>
      <Topbar title="Reviews" subtitle="Patient reviews and ratings" />

      <div className="p-7 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-xs text-slate-light mb-1">Average Rating</p>
            <div className="flex items-center gap-3">
              <span className="font-display font-bold text-[32px] text-navy">{averageRating}</span>
              <div className="text-yellow-400 text-xl">{renderStars(parseFloat(averageRating))}</div>
            </div>
            <p className="text-xs text-slate-light mt-2">{reviews.length} total reviews</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-xs text-slate-light mb-1">Total Reviews</p>
            <p className="font-display font-bold text-[32px] text-navy">{reviews.length}</p>
            <p className="text-xs text-slate-light mt-2">All time</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-xs text-slate-light mb-1">Recommendation Rate</p>
            <p className="font-display font-bold text-[32px] text-navy">{recommendationRate}%</p>
            <p className="text-xs text-slate-light mt-2">Based on reviews</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-light" />
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-light">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-center py-5 bg-red-50 rounded-xl border border-red-200">{error}</div>
        )}

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-10 text-center">
            <Star className="w-16 h-16 mx-auto mb-4 text-slate-light opacity-40" />
            <p className="text-lg font-medium text-navy mb-1">No reviews yet</p>
            <p className="text-sm text-slate-light">Patient reviews will appear here once they leave feedback.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-card rounded-xl border border-border p-5 hover:border-teal/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-navy">{review.patient_name || 'Patient'}</p>
                    <p className="text-xs text-slate-light mt-0.5">
                      {review.appointment ? `Appointment #${review.appointment}` : ''} {formatDate(review.created_at) ? `• ${formatDate(review.created_at)}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-yellow-400">{renderStars(review.rating || 0)}</div>
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-slate leading-relaxed mb-4">{review.comment}</p>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReply(review.id)}
                    className="px-3 py-1.5 border border-border rounded-md text-xs font-medium text-slate hover:bg-teal-light hover:text-teal transition-colors flex items-center gap-1"
                  >
                    <Reply size={12} />Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DoctorDashboardLayout>
  )
}
