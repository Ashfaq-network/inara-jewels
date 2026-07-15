import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { supabase } from '@lib/supabase'

const REVIEW_IMAGES = [
  '/images/reviews/1.jpeg',
  '/images/reviews/2.jpeg',
  '/images/reviews/3.jpeg',
  '/images/reviews/4.jpeg',
  '/images/reviews/5.jpeg',
]

export default function ReviewsList({ productId }) {
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    const { data } = await supabase
      .from('reviews')
      .select('*, profiles(name)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })

    setReviews(data || [])
    setIsLoading(false)
  }

  return (
    <div>
      {/* Customer Review Screenshots */}
      <div className="mb-8">
        <h3 className="font-medium text-gray-800 mb-4">What Our Customers Say</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {REVIEW_IMAGES.map((img, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
              <img
                src={img}
                alt={`Customer review ${i + 1}`}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Database Reviews */}
      {isLoading ? (
        <div className="py-8 text-center text-gray-400">Loading reviews...</div>
      ) : reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? 'text-rosegold-400 fill-current'
                          : 'text-rosegold-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium text-gray-800 text-sm">
                  {review.profiles?.name || 'Anonymous'}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              {review.comment && (
                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
