import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCartStore } from '@stores/cartStore'

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const discount = product.compare_at_price && product.compare_at_price > product.price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, product.colors?.[0] || null)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  return (
    <Link
      to={`/shop/${product.slug}`}
      className="group product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-image relative">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
        />

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.is_new && <span className="badge-new">New</span>}
          {product.is_best_seller && <span className="badge-rose">Best Seller</span>}
          {discount > 0 && (
            <span className="badge bg-rose-500 text-white border-0">
              -{discount}%
            </span>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          className="absolute bottom-3 left-3 right-3 flex gap-2"
        >
          <button
            onClick={handleAddToCart}
            className="flex-1 btn-rose py-2.5 px-4 text-xs rounded-2xl"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Cart
          </button>
          <button
            onClick={handleWishlist}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              isWishlisted
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 text-gray-400 hover:text-rose-500 border border-rosegold-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </motion.div>
      </div>

      <div className="p-4">
        {product.colors?.length > 0 && (
          <div className="flex items-center gap-1.5 mb-2.5">
            {product.colors.slice(0, 4).map((color, index) => (
              <span
                key={index}
                className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: color }}
              />
            ))}
            {product.colors?.length > 4 && (
              <span className="text-[10px] text-gray-400">+{product.colors.length - 4}</span>
            )}
          </div>
        )}

        <h3 className="font-medium text-gray-800 text-sm line-clamp-1 group-hover:text-rosegold-600 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3 h-3 ${
                  star <= Math.floor(product.rating || 0)
                    ? 'text-rosegold-400 fill-rosegold-400'
                    : 'text-rosegold-200'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-400">({product.review_count || 0})</span>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <span className="text-base font-semibold text-gray-800">
            {formatPrice(product.price)}
          </span>
          {product.compare_at_price && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.compare_at_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
