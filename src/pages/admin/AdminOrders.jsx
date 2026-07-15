import { useState, useEffect, Fragment } from 'react'
import { supabase } from '@lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  ChevronUp,
  X,
  Loader2,
  Package,
  Calendar,
  MapPin,
} from 'lucide-react'

const formatLKR = (amount) =>
  new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
  }).format(amount)

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const paymentColors = {
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-600',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [orderItems, setOrderItems] = useState({})
  const [orderHistory, setOrderHistory] = useState({})
  const [updatingStatus, setUpdatingStatus] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setOrders(data || [])
    setLoading(false)
  }

  const fetchOrderDetails = async (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null)
      return
    }

    setExpandedOrder(orderId)

    if (!orderItems[orderId]) {
      const [itemsRes, historyRes] = await Promise.all([
        supabase.from('order_items').select('*').eq('order_id', orderId),
        supabase.from('order_status_history').select('*').eq('order_id', orderId).order('created_at', { ascending: false }),
      ])

      setOrderItems((prev) => ({ ...prev, [orderId]: itemsRes.data || [] }))
      setOrderHistory((prev) => ({ ...prev, [orderId]: historyRes.data || [] }))
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingStatus(orderId)

    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)

    if (!error) {
      await supabase.from('order_status_history').insert({
        order_id: orderId,
        status: newStatus,
      })
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
    }

    if (orderHistory[orderId]) {
      setOrderHistory((prev) => ({
        ...prev,
        [orderId]: [
          {
            id: crypto.randomUUID(),
            order_id: orderId,
            status: newStatus,
            created_at: new Date().toISOString(),
          },
          ...prev[orderId],
        ],
      }))
    }

    setUpdatingStatus(null)
  }

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter((o) => o.status === filterStatus)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-rosegold-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-800">Orders</h1>
        <p className="text-gray-400 text-sm mt-1">{orders.length} orders total</p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['all', ...STATUS_OPTIONS].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterStatus === status
                ? 'bg-rosegold-500 text-white'
                : 'bg-white border border-rosegold-200 text-gray-500 hover:border-rosegold-400 hover:text-rosegold-600'
            }`}
          >
            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="card-rose hover:transform-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rosegold-100">
                <th className="text-left px-5 py-3 font-medium text-gray-400 w-8"></th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">Order #</th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">Customer</th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">Date</th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">Total</th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">Status</th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">Payment</th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">Method</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-gray-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <Fragment key={order.id}>
                    <tr
                      className="border-b border-rosegold-50 last:border-0 hover:bg-rosegold-50/30 transition-colors cursor-pointer"
                      onClick={() => fetchOrderDetails(order.id)}
                    >
                      <td className="px-5 py-3">
                        {expandedOrder === order.id ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </td>
                      <td className="px-5 py-3 font-medium text-gray-700">{order.order_number}</td>
                      <td className="px-5 py-3 text-gray-500">
                        {order.shipping_address?.name || 'Guest'}
                      </td>
                      <td className="px-5 py-3 text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('en-LK')}
                      </td>
                      <td className="px-5 py-3 text-gray-700 font-medium">{formatLKR(order.total)}</td>
                      <td className="px-5 py-3">
                        {updatingStatus === order.id ? (
                          <Loader2 className="w-4 h-4 text-rosegold-500 animate-spin" />
                        ) : (
                          <select
                            value={order.status}
                            onChange={(e) => {
                              e.stopPropagation()
                              updateOrderStatus(order.id, e.target.value)
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:ring-0 ${statusColors[order.status] || ''}`}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${paymentColors[order.payment_status] || ''}`}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500 capitalize">{order.payment_method || '—'}</td>
                    </tr>

                    <AnimatePresence>
                      {expandedOrder === order.id && (
                        <tr>
                          <td colSpan={8} className="p-0">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 py-6 bg-rosegold-50/50 border-b border-rosegold-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                      <Package className="w-4 h-4" /> Order Items
                                    </h4>
                                    <div className="space-y-2">
                                      {(orderItems[order.id] || []).map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 bg-white rounded-xl p-3">
                                          <img
                                            src={item.product_image}
                                            alt={item.product_name}
                                            className="w-12 h-12 rounded-lg object-cover"
                                          />
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-700 truncate">{item.product_name}</p>
                                            <p className="text-xs text-gray-400">
                                              Qty: {item.quantity} × {formatLKR(item.unit_price)}
                                              {item.color && ` • ${item.color}`}
                                            </p>
                                          </div>
                                          <p className="text-sm font-medium text-gray-700">
                                            {formatLKR(item.quantity * item.unit_price)}
                                          </p>
                                        </div>
                                      ))}
                                    </div>

                                    <div className="mt-4 space-y-1 text-sm">
                                      <div className="flex justify-between text-gray-500">
                                        <span>Subtotal</span>
                                        <span>{formatLKR(order.subtotal ?? 0)}</span>
                                      </div>
                                      <div className="flex justify-between text-gray-500">
                                        <span>Shipping</span>
                                        <span>{formatLKR(order.shipping_cost ?? 0)}</span>
                                      </div>
                                      <div className="flex justify-between font-semibold text-gray-800 pt-1 border-t border-rosegold-200">
                                        <span>Total</span>
                                        <span>{formatLKR(order.total ?? 0)}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" /> Shipping Address
                                      </h4>
                                      <div className="bg-white rounded-xl p-3 text-sm text-gray-600">
                                        <p className="font-medium">{order.shipping_address?.name}</p>
                                        <p>{order.shipping_address?.address}</p>
                                        <p>{order.shipping_address?.city}, {order.shipping_address?.province}</p>
                                        <p>{order.shipping_address?.phone}</p>
                                      </div>
                                    </div>

                                    {order.notes && (
                                      <div>
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Notes</h4>
                                        <p className="bg-white rounded-xl p-3 text-sm text-gray-600">{order.notes}</p>
                                      </div>
                                    )}

                                    <div>
                                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" /> Status History
                                      </h4>
                                      <div className="space-y-2">
                                        {(orderHistory[order.id] || []).map((h) => (
                                          <div key={h.id} className="flex items-center gap-3 text-sm">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[h.status] || 'bg-gray-100 text-gray-600'}`}>
                                              {h.status}
                                            </span>
                                            <span className="text-gray-400 text-xs">
                                              {new Date(h.created_at).toLocaleString('en-LK')}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


