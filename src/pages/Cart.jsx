import { Link } from 'react-router-dom'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag, Gift } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCartStore } from '@stores/cartStore'

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore()
  
  const subtotal = getTotal()
  const shipping = subtotal >= 5000 ? 0 : 350
  const total = subtotal + shipping

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(price)
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
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-display font-semibold text-gray-800 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/shop" className="btn-rose inline-flex items-center gap-2">
            Start Shopping
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-softwhite">
      <div className="container-custom px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-8">
          Shopping <span className="text-gradient">Cart</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-rose p-4 md:p-6"
              >
                <div className="flex gap-4">
                  <Link
                    to={`/shop/${item.slug}`}
                    className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-cream-50"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          to={`/shop/${item.slug}`}
                          className="font-medium text-gray-800 hover:text-rosegold-500 transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        {item.color && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-400">Color:</span>
                            <span
                              className="w-4 h-4 rounded-full border border-rosegold-200"
                              style={{ backgroundColor: item.color }}
                            />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      <div className="flex items-center border border-rosegold-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-rosegold-50 transition-colors rounded-l-lg"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="px-4 py-2 font-medium text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-rosegold-50 transition-colors rounded-r-lg"
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      <p className="text-lg font-semibold text-gray-800">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={clearCart}
                className="text-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear Cart
              </button>
              <Link to="/shop" className="text-sm text-rosegold-500 hover:text-rosegold-600 transition-colors flex items-center gap-1">
                Continue Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card-rose p-6 sticky top-24">
              <h2 className="text-xl font-display font-semibold text-gray-800 mb-6">Order Summary</h2>

              {/* Coupon Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Coupon code"
                      className="input-rose pl-10 text-sm"
                    />
                  </div>
                  <button className="btn-outline-rose py-2 px-4 text-sm">Apply</button>
                </div>
              </div>

              {/* Gift Note */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-4 h-4 text-rosegold-500" />
                  <span className="text-sm font-medium text-gray-800">Gift Note</span>
                </div>
                <textarea
                  placeholder="Add a gift note (optional)"
                  className="input-rose text-sm resize-none"
                  rows={2}
                />
              </div>

              {/* Summary */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="text-gray-800">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="text-gray-800">
                    {shipping === 0 ? (
                      <span className="text-green-500">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400">
                    Free shipping on orders over Rs. 5,000
                  </p>
                )}
                <div className="border-t border-rosegold-200 pt-4">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-800">Total</span>
                    <span className="text-xl font-bold text-rosegold-500">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="btn-rose w-full py-4 flex items-center justify-center gap-2 text-lg"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </Link>

              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t border-rosegold-200">
                <p className="text-xs text-gray-400 text-center mb-3">We accept</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="px-2 py-1 bg-cream-50 border border-rosegold-200 rounded text-xs text-gray-500">Visa</span>
                  <span className="px-2 py-1 bg-cream-50 border border-rosegold-200 rounded text-xs text-gray-500">Mastercard</span>
                  <span className="px-2 py-1 bg-cream-50 border border-rosegold-200 rounded text-xs text-gray-500">PayHere</span>
                  <span className="px-2 py-1 bg-cream-50 border border-rosegold-200 rounded text-xs text-gray-500">COD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
