'use client'

import { useState } from 'react'
import { MessageCircle, Star } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useReviews, postReview } from '@/lib/firestore'
import { useRouter } from 'next/navigation'

export default function MovieReviews({ movieId, mediaType = 'movie' }) {
  const { user } = useAuth()
  const reviews = useReviews(movieId)
  const router = useRouter()
  
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!user) return router.push('/login')
    if (!text.trim()) return setError('Please write a comment.')
    
    setIsSubmitting(true)
    setError('')
    try {
      await postReview(movieId, user.uid, user.displayName, rating, text, mediaType)
      setText('')
      setRating(5)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="glass p-6 rounded-2xl">
      <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-primary" />
        User Reviews ({reviews.length})
      </h2>
      
      {/* Reviews List */}
      <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
        {reviews.length === 0 ? (
          <p className="text-gray-400 text-sm italic">No reviews yet. Be the first!</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-primary text-sm">{review.userName}</span>
                <span className="text-xs text-gray-400">
                  {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString() : 'Just now'}
                </span>
              </div>
              <div className="flex gap-1 mb-2">
                {[1,2,3,4,5].map(star => (
                  <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'fill-primary text-primary' : 'text-gray-600'}`} />
                ))}
              </div>
              <p className="text-sm text-gray-300">{review.text}</p>
            </div>
          ))
        )}
      </div>
      
      {/* Post Review Form */}
      <div className="border-t border-white/10 pt-6">
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-gray-400">Your Rating:</span>
          <div className="flex gap-1">
            {[1,2,3,4,5].map(star => (
              <button 
                key={star} 
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star className={`w-5 h-5 ${star <= rating ? 'fill-primary text-primary' : 'text-gray-600 hover:text-gray-400'}`} />
              </button>
            ))}
          </div>
        </div>

        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={user ? "Add a comment..." : "Sign in to add a comment..."}
          disabled={!user || isSubmitting}
          className="w-full bg-background border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-primary/50 text-white min-h-[100px] disabled:opacity-50"
        />
        <button 
          onClick={handleSubmit}
          disabled={!user || isSubmitting}
          className="w-full mt-3 py-3 bg-primary text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center"
        >
          {isSubmitting ? (
             <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : !user ? (
            'Sign In to Post'
          ) : (
            'Post Review'
          )}
        </button>
      </div>
    </div>
  )
}
