import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Trash2, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@lib/supabase'
import { useAuthStore } from '@stores/authStore'
import ProductCard from '@components/product/ProductCard'

export default function Wishlist() {
  const { user } = useAuthStore()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    fetchWishlist()

    const channel = supabase
      .channel('wishlist-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'wishlist', filter: `user_id=eq.${user.id}` },
        () => fetchWishlist()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const fetchWishlist = async () => {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('id, product_id, created_at, products(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (err) {
      console.error('Error fetching wishlist:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (wishlistId) => {
    setRemoving(wishlistId)
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('id', wishlistId)

      if (error) throw error
      setItems((prev) => prev.filter((item) => item.id !== wishlistId))
    } catch (err) {
      console.error('Error removing from wishlist:', err)
    } finally {
      setRemoving(null)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-softwhite">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-rosegold-50 flex items-center justify-center">
            <Heart className="w-12 h-12 text-rosegold-300" />
          </div>
          <h1 className="text-2xl font-display font-semibold text-gray-800 mb-2">Sign in to view your wishlist</h1>
          <p className="text-gray-500 mb-6">
            Save your favorite pieces to revisit later
          </p>
          <Link to="/login" className="btn-rose inline-flex items-center gap-2">
            Sign In
          </Link>
        </motion.div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-softwhite">
        <Loader2 className="w-8 h-8 text-rosegold-400 animate-spin" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-softwhite">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-cream-50 flex items-center justify-center">
            <Heart className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-display font-semibold text-gray-800 mb-2">Your wishlist is empty</h1>
          <p className="text-gray-500 mb-6">
            Save your favorite pieces for later
          </p>
          <Link to="/shop" className="btn-rose inline-flex items-center gap-2">
            Discover Products
          </Link>
        </motion.div>
      </div>
    )
  }

  const products = items
    .map((item) => item.products)
    .filter(Boolean)

  return (
    <div className="min-h-screen bg-softwhite">
      <div className="container-custom px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-800">
            My <span className="text-gradient">Wishlist</span>
          </h1>
          <span className="text-sm text-gray-400 bg-cream-50 px-3 py-1 rounded-full">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                {item.products && <ProductCard product={item.products} />}
                <button
                  onClick={() => handleRemove(item.id)}
                  disabled={removing === item.id}
                  className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 border border-rosegold-100 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:border-rose-200 transition-all opacity-0 group-hover:opacity-100"
                  title="Remove from wishlist"
                >
                  {removing === item.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
