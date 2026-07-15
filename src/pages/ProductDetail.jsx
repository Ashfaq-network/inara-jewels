import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, ShoppingBag, Star, Minus, Plus, Truck, Shield, RotateCcw, ChevronRight, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCartStore } from '@stores/cartStore'
import { supabase } from '@lib/supabase'
import ProductCard from '@components/product/ProductCard'
import ReviewsList from '@components/product/ReviewsList'
import ReviewForm from '@components/product/ReviewForm'

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [reviewsKey, setReviewsKey] = useState(0)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    fetchProduct()
  }, [slug])

  const fetchProduct = async () => {
    setIsLoading(true)
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
    } else {
      setProduct(data)
      setSelectedColor(data.colors?.[0] || null)
      
      const { data: related } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', data.category_id)
        .neq('id', data.id)
        .limit(4)
      
      setRelatedProducts(related || [])
    }
    
    setIsLoading(false)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = () => {
    if (product) {
      addItem(product, selectedColor, quantity)
    }
  }

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-softwhite">
        <div className="w-12 h-12 border-4 border-rosegold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-softwhite">
        <h1 className="text-2xl font-display font-semibold text-gray-800 mb-4">Product not found</h1>
        <Link to="/shop" className="btn-rose">
          Back to Shop
        </Link>
      </div>
    )
  }

  const discount = product.compare_at_price && product.compare_at_price > product.price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  return (
    <div className="min-h-screen bg-softwhite">
      {/* Breadcrumb */}
      <div className="container-custom px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-gray-800 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/shop" className="hover:text-gray-800 transition-colors">Shop</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800">{product.name}</span>
        </nav>
      </div>

      {/* Product Section */}
      <div className="container-custom px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square rounded-2xl overflow-hidden bg-cream-50"
            >
              <img
                src={product.images?.[activeImage] || product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {product.images?.length > 1 && (
              <div className="flex gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === index
                        ? 'border-rosegold-500'
                        : 'border-rosegold-200 hover:border-rosegold-400'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Badges */}
              <div className="flex items-center gap-2 mb-4">
                {product.is_new && <span className="badge-new">New</span>}
                {product.is_best_seller && <span className="badge-rose">Best Seller</span>}
                {discount > 0 && (
                  <span className="badge bg-red-500/10 text-red-500 border border-red-200">
                    -{discount}% OFF
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-800">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.floor(product.rating || 0)
                          ? 'text-rosegold-400 fill-current'
                          : 'text-rosegold-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-400">
                  {product.rating || 0} ({product.review_count || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4 mt-6">
                <span className="text-4xl font-bold text-gray-800">
                  {formatPrice(product.price)}
                </span>
                {product.compare_at_price && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.compare_at_price)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-6 text-gray-500 leading-relaxed">
                {product.description}
              </p>
            </motion.div>

            {/* Color Selection */}
            {product.colors?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-medium text-gray-800 mb-3">
                  Color: <span className="text-gray-500">{selectedColor}</span>
                </h3>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? 'border-rosegold-500 scale-110'
                          : 'border-rosegold-200 hover:border-rosegold-400'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quantity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-medium text-gray-800 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-rosegold-200 rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    className="p-3 hover:bg-rosegold-50 transition-colors rounded-l-lg"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="px-6 py-3 font-medium text-gray-800">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="p-3 hover:bg-rosegold-50 transition-colors rounded-r-lg"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <span className="text-sm text-gray-400">
                  {product.stock > 10 ? (
                    <span className="text-green-500">In Stock</span>
                  ) : product.stock > 0 ? (
                    <span className="text-amber-500">Only {product.stock} left</span>
                  ) : (
                    <span className="text-red-500">Out of Stock</span>
                  )}
                </span>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-rose py-4 flex items-center justify-center gap-2 text-lg"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`px-6 py-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                  isWishlisted
                    ? 'border-red-400 bg-red-50 text-red-500'
                    : 'border-rosegold-200 hover:border-rosegold-400 text-gray-400 hover:text-gray-800'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-rosegold-200"
            >
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="w-6 h-6 text-rosegold-500" />
                <span className="text-xs text-gray-400">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Shield className="w-6 h-6 text-rosegold-500" />
                <span className="text-xs text-gray-400">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw className="w-6 h-6 text-rosegold-500" />
                <span className="text-xs text-gray-400">Easy Returns</span>
              </div>
            </motion.div>

            {/* Guarantee */}
            <div className="p-4 rounded-xl bg-rosegold-50 border border-rosegold-200">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-rosegold-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800">3-4 Months Color Guarantee</p>
                  <p className="text-sm text-gray-500">
                    Our 18K electroplated jewelry maintains its vibrant color for 3-4 months with proper care.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="container-custom px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-display font-bold text-gray-800 mb-8">
            Customer <span className="text-gradient">Reviews</span>
          </h2>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-8">
            <ReviewForm productId={product.id} onReviewSubmitted={() => setReviewsKey(k => k + 1)} />
            <div className="border-t border-gray-100 pt-6">
              <ReviewsList key={reviewsKey} productId={product.id} />
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="section-padding bg-cream-50">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-800 mb-8">
              You May Also <span className="text-gradient">Like</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
