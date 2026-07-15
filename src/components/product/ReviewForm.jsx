import { useState } from 'react'
import { Star } from 'lucide-react'
import { supabase } from '@lib/supabase'
import { useAuthStore } from '@stores/authStore'

export default function ReviewForm({ productId, onReviewSubmitted }) {
  const { user } = useAuthStore()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  if (!user) {
    return (
      <div className="py-6 text-center text-gray-400 bg-gray-50 rounded-xl">
        Please <a href="/login" className="text-rosegold-500 hover:underline">sign in</a> to write a review.
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      setMessage({ type: 'error', text: 'Please select a rating' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    const { error } = await supabase.from('reviews').insert({
      user_id: user.id,
      product_id: productId,
      rating,
      comment: comment.trim() || null,
    })

    if (error) {
      setMessage({ type: 'error', text: error.message.includes('duplicate') ? 'You have already reviewed this product.' : 'Failed to submit review.' })
    } else {
      setMessage({ type: 'success', text: 'Review submitted!' })
      setRating(0)
      setComment('')
      if (onReviewSubmitted) onReviewSubmitted()
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-medium text-gray-800">Write a Review</h3>

      {/* Star Rating */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-0.5"
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                star <= (hoverRating || rating)
                  ? 'text-rosegold-400 fill-current'
                  : 'text-gray-200'
              }`}
            />
          </button>
        ))}
        <span className="text-sm text-gray-400 ml-2">
          {rating > 0 && `${rating}/5`}
        </span>
      </div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this product (optional)"
        rows={3}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-rosegold-400 resize-none"
      />

      {/* Message */}
      {message && (
        <p className={`text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
          {message.text}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="btn-rose px-8 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}
