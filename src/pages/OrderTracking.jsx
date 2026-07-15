import { useState } from 'react'
import { Search, Package, Truck, CheckCircle, Clock, MapPin, AlertCircle, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@lib/supabase'

const statusSteps = [
  { id: 'received', label: 'Received', icon: Package },
  { id: 'preparing', label: 'Preparing', icon: Clock },
  { id: 'packed', label: 'Packed', icon: Package },
  { id: 'shipped', label: 'Shipped', icon: Truck },
  { id: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle },
]

const statusToStep = {
  pending: 0,
  confirmed: 1,
  processing: 2,
  shipped: 3,
  delivered: 5,
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
  }).format(price)
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function OrderTracking() {
  const [orderNumber, setOrderNumber] = useState('')
  const [order, setOrder] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [statusHistory, setStatusHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!orderNumber.trim()) return

    setLoading(true)
    setNotFound(false)
    setOrder(null)

    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .ilike('order_number', orderNumber.trim())
        .limit(1)

      if (error) throw error

      if (!orders || orders.length === 0) {
        setNotFound(true)
        setLoading(false)
        return
      }

      const foundOrder = orders[0]
      setOrder(foundOrder)

      const [itemsRes, historyRes] = await Promise.all([
        supabase
          .from('order_items')
          .select('*')
          .eq('order_id', foundOrder.id)
          .order('created_at'),
        supabase
          .from('order_status_history')
          .select('*')
          .eq('order_id', foundOrder.id)
          .order('created_at'),
      ])

      setOrderItems(itemsRes.data || [])
      setStatusHistory(historyRes.data || [])
    } catch (err) {
      console.error('Order search error:', err)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const currentStepIndex = order ? (statusToStep[order.status] ?? 0) : 0
  const shipping = order?.shipping_address

  return (
    <div className="min-h-screen bg-softwhite">
      <section className="section-padding bg-gradient-to-b from-rosegold-50 to-softwhite">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800">
              Track Your <span className="text-gradient">Order</span>
            </h1>
            <p className="mt-6 text-xl text-gray-500">
              Enter your order number to see real-time status
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Order number (e.g. JI-2024-001234)"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="input-rose pl-12"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-rose min-w-[120px]">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  'Track'
                )}
              </button>
            </div>
          </form>

          <AnimatePresence mode="wait">
            {notFound && (
              <motion.div
                key="not-found"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="card-rose p-8 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rosegold-50 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-rosegold-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Order Not Found</h3>
                <p className="text-gray-500">
                  No order found with number &quot;{orderNumber}&quot;. Please check and try again.
                </p>
              </motion.div>
            )}

            {order && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="card-rose p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div>
                      <p className="text-sm text-gray-400">Order Number</p>
                      <p className="font-semibold text-gray-800 text-lg">{order.order_number}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-gray-400">Order Date</p>
                      <p className="font-medium text-gray-600">{formatDate(order.created_at)}</p>
                    </div>
                  </div>

                  <div className="relative mt-4 mb-2">
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-rosegold-100" />
                    <div
                      className="absolute top-5 left-0 h-0.5 bg-rosegold-500 transition-all duration-700"
                      style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                    />
                    <div className="flex justify-between relative">
                      {statusSteps.map((step, index) => {
                        const isCompleted = index <= currentStepIndex
                        const isCurrent = index === currentStepIndex
                        return (
                          <div key={step.id} className="flex flex-col items-center" style={{ width: `${100 / statusSteps.length}%` }}>
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors duration-300 ${
                                isCompleted
                                  ? 'bg-rosegold-500 text-white'
                                  : 'bg-cream-50 text-gray-400 border border-rosegold-200'
                              } ${isCurrent ? 'ring-4 ring-rosegold-200' : ''}`}
                            >
                              <step.icon className="w-5 h-5" />
                            </div>
                            <span
                              className={`mt-2 text-[11px] text-center leading-tight ${
                                isCompleted ? 'text-gray-800 font-medium' : 'text-gray-400'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {statusHistory.length > 0 && (
                  <div className="card-rose p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Tracking History</h3>
                    <div className="space-y-0">
                      {[...statusHistory].reverse().map((event, index) => (
                        <div key={event.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                index === 0 ? 'bg-rosegold-500' : 'bg-rosegold-200'
                              }`}
                            />
                            {index < statusHistory.length - 1 && (
                              <div className="w-0.5 flex-1 bg-rosegold-200 min-h-[24px]" />
                            )}
                          </div>
                          <div className="pb-4">
                            <p className="font-medium text-gray-800 capitalize">
                              {event.status.replace(/_/g, ' ')}
                            </p>
                            {event.note && (
                              <p className="text-sm text-gray-500 mt-0.5">{event.note}</p>
                            )}
                            <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(event.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="card-rose p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Order Items</h3>
                  <div className="divide-y divide-rosegold-50">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-16 h-16 rounded-xl object-cover bg-cream-50"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 text-sm truncate">{item.product_name}</p>
                          {item.color && (
                            <p className="text-xs text-gray-400 mt-0.5">Color: {item.color}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-gray-800 text-sm whitespace-nowrap">
                          {formatPrice(item.unit_price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-rosegold-100 mt-4 pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Subtotal</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Shipping</span>
                      <span>{order.shipping_cost > 0 ? formatPrice(order.shipping_cost) : 'Free'}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-gray-800 pt-2 border-t border-rosegold-50">
                      <span>Total</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>

                {shipping && (
                  <div className="card-rose p-6">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rosegold-500" />
                      Shipping Address
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      {shipping.name && <p className="font-medium text-gray-800">{shipping.name}</p>}
                      {shipping.address && <p>{shipping.address}</p>}
                      <p>
                        {[shipping.city, shipping.district, shipping.province].filter(Boolean).join(', ')}
                      </p>
                      {shipping.phone && <p className="mt-1">Phone: {shipping.phone}</p>}
                      {shipping.email && <p>Email: {shipping.email}</p>}
                    </div>
                  </div>
                )}

                <div className="card-rose p-6 text-center">
                  <p className="text-gray-500 mb-4">Need help with your order?</p>
                  <a
                    href="https://wa.me/94701234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-rose inline-flex items-center gap-2"
                  >
                    Contact Support
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!order && !notFound && !loading && (
            <div className="card-rose p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rosegold-50 flex items-center justify-center">
                <Package className="w-8 h-8 text-rosegold-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Track Your Order</h3>
              <p className="text-gray-500">
                Enter your order number above to view real-time tracking details, items, and delivery status.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
