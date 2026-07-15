import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, Package, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '@lib/supabase'

function formatPrice(price) {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
  }).format(price)
}

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams()
  const orderNumber = searchParams.get('order')

  const [order, setOrder] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!orderNumber) {
      setNotFound(true)
      setLoading(false)
      return
    }

    const fetchOrder = async () => {
      try {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('order_number', orderNumber)
          .single()

        if (orderError || !orderData) {
          setNotFound(true)
          setLoading(false)
          return
        }

        setOrder(orderData)

        const { data: itemsData } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', orderData.id)

        setItems(itemsData || [])
      } catch (err) {
        console.error('Failed to fetch order:', err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderNumber])

  if (loading) {
    return (
      <div className="min-h-screen bg-softwhite flex items-center justify-center">
        <div className="w-10 h-10 border-[3px] border-rosegold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound || !order) {
    return (
      <div className="min-h-screen bg-softwhite flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-display font-semibold text-gray-800 mb-4">Order not found</h1>
        <p className="text-gray-400 mb-6">We couldn't find this order.</p>
        <Link to="/shop" className="btn-rose">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-softwhite">
      <div className="container-custom px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Success Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-500" />
            </motion.div>

            <h1 className="text-3xl font-display font-bold text-gray-800 mb-3">
              Order Confirmed!
            </h1>

            <div className="inline-block px-4 py-2 rounded-full bg-rosegold-50 border border-rosegold-200 mb-4">
              <span className="text-sm text-gray-500">Order Number</span>
              <p className="text-lg font-bold text-rosegold-500">{order.order_number}</p>
            </div>

            <p className="text-gray-400 max-w-md mx-auto">
              Thank you for your order. We'll send you a confirmation email shortly.
            </p>
          </div>

          {/* Order Summary */}
          <div className="card-rose p-6 mb-8">
            <h2 className="text-lg font-display font-semibold text-gray-800 mb-4">Order Summary</h2>

            <div className="space-y-4 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-cream-50 flex-shrink-0">
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{item.product_name}</p>
                    {item.color && (
                      <p className="text-xs text-gray-400">Color: {item.color}</p>
                    )}
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {formatPrice(item.unit_price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-rosegold-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span className="text-gray-800">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span className="text-gray-800">
                  {order.shipping_cost === 0 ? 'Free' : formatPrice(order.shipping_cost)}
                </span>
              </div>
              <div className="border-t border-rosegold-200 pt-2 flex justify-between">
                <span className="font-semibold text-gray-800">Total</span>
                <span className="text-xl font-bold text-rosegold-500">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/track-order"
              className="btn-rose flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              Track Order
            </Link>
            <Link
              to="/shop"
              className="btn-ghost border border-rosegold-200 hover:bg-rosegold-50 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
