import { useState, useEffect } from 'react'
import { fetchDoctorReviews } from '@/services/api'

export default function ReviewsSection({ doctorId }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchDoctorReviews(doctorId)
        setReviews(data)
      } catch (err) {
        setError(err.message || 'Failed to load reviews')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [doctorId])

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : '0.0'

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)
    return (
      <span className="text-yellow-400">
        {'★'.repeat(fullStars)}
        {halfStar && '★'}
        {'☆'.repeat(emptyStars)}
      </span>
    )
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border p-7">
        <h2 className="font-display font-semibold text-[18px] text-navy mb-3.5">Ratings & Reviews</h2>
        <p className="text-[14px] text-slate">Loading reviews...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-card rounded-xl border border-border p-7">
        <h2 className="font-display font-semibold text-[18px] text-navy mb-3.5">Ratings & Reviews</h2>
        <p className="text-[14px] text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-xl border border-border p-7">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display font-semibold text-[18px] text-navy">Ratings & Reviews</h2>
        <div className="flex items-center gap-3">
          <span className="font-display font-bold text-[28px] text-navy">{averageRating}</span>
          <div>
            <div className="text-yellow-400 text-[18px]">{renderStars(parseFloat(averageRating))}</div>
            <p className="text-[12px] text-slate-light">{reviews.length} reviews</p>
          </div>
        </div>
      </div>

      {reviews.length === 0 && (
        <p className="text-[14px] text-slate mb-4">No reviews yet. Be the first to write a review!</p>
      )}

      <div className="flex flex-col gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-border last:border-b-0 pb-4 last:pb-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[14px] font-semibold text-navy">
                {review.patient_name || 'Patient'}
              </p>
              <span className="text-[12px] text-slate-light">{formatDate(review.created_at)}</span>
            </div>
            <div className="text-yellow-400 text-[14px] mb-1">{renderStars(review.rating || 0)}</div>
            {review.comment && (
              <p className="text-[13px] text-slate leading-relaxed">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
