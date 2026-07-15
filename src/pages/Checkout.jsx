import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CreditCard, Banknote, Building2, ChevronRight, Lock, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '@lib/supabase'
import { useCartStore } from '@stores/cartStore'
import { useAuthStore } from '@stores/authStore'

const provinces = [
  'Western', 'Central', 'Southern', 'Northern', 'Eastern',
  'North Western', 'North Central', 'Uva', 'Sabaragamuwa'
]

const districts = {
  Western: ['Colombo', 'Gampaha', 'Kalutara'],
  Central: ['Kandy', 'Matale', 'Nuwara Eliya'],
  Southern: ['Galle', 'Matara', 'Hambantota'],
  Northern: ['Jaffna', 'Mullaitivu', 'Vavuniya', 'Kilinochchi'],
  Eastern: ['Trincomalee', 'Batticaloa', 'Ampara'],
  'North Western': ['Kurunegala', 'Puttalam'],
  'North Central': ['Anuradhapura', 'Polonnaruwa'],
  Uva: ['Badulla', 'Monaragala'],
  Sabaragamuwa: ['Ratnapura', 'Kegalle'],
}

const deliveryMethods = [
  { id: 'standard', name: 'Standard Delivery', price: 350, time: '3-5 business days' },
  { id: 'express', name: 'Express Delivery', price: 700, time: '1-2 business days' },
  { id: 'pickup', name: 'Store Pickup', price: 0, time: 'Ready in 2 hours' },
]

const paymentMethods = [
  { id: 'cod', name: 'Cash on Delivery', icon: Banknote, description: 'Pay when you receive your order' },
  { id: 'payhere', name: 'Bank Transfer (PayHere)', icon: Building2, description: 'Transfer directly via PayHere' },
  { id: 'stripe', name: 'Card (Stripe)', icon: CreditCard, description: 'Pay securely with Visa or Mastercard' },
]

function generateOrderNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'IJ-'
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export default function Checkout() {
  const navigate = useNavigate()
  const { items, getTotal, clearCart } = useCartStore()
  const { user } = useAuthStore()

  const [step, setStep] = useState(1)
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedDelivery, setSelectedDelivery] = useState('standard')
  const [selectedPayment, setSelectedPayment] = useState('cod')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    name: user?.profile?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    province: '',
    district: '',
    notes: '',
  })

  const subtotal = getTotal()
  const delivery = deliveryMethods.find(d => d.id === selectedDelivery)
  const shippingCost = delivery?.price || 0
  const total = subtotal + shippingCost

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name === 'province') {
      setSelectedProvince(value)
      setFormData(prev => ({ ...prev, province: value, district: '' }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const validateStep = () => {
    if (step === 1) {
      return formData.name && formData.email && formData.phone && formData.address &&
        formData.city && formData.province && formData.district
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    setError(null)

    try {
      const orderNumber = generateOrderNumber()
      const shippingAddress = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        province: formData.province,
        district: formData.district,
      }

      const paymentStatus = 'pending'

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: user?.id || null,
          status: 'pending',
          subtotal,
          shipping_cost: shippingCost,
          total,
          shipping_address: shippingAddress,
          payment_method: selectedPayment,
          payment_status: paymentStatus,
          notes: formData.notes || null,
        })
        .select()
        .single()

      if (orderError) throw orderError

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.name,
        product_image: item.image,
        quantity: item.quantity,
        unit_price: item.price,
        color: item.color || null,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      const { error: historyError } = await supabase
        .from('order_status_history')
        .insert({
          order_id: order.id,
          status: 'received',
          note: 'Order placed successfully',
        })

      if (historyError) throw historyError

      clearCart()
      navigate(`/order-confirmation?order=${orderNumber}`)
    } catch (err) {
      console.error('Order submission failed:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-softwhite">
        <h1 className="text-2xl font-display font-semibold text-gray-800 mb-4">Your cart is empty</h1>
        <Link to="/shop" className="btn-rose">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-softwhite">
      <div className="container-custom px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {[
              { num: 1, label: 'Information' },
              { num: 2, label: 'Delivery' },
              { num: 3, label: 'Payment' },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s.num
                    ? 'bg-rosegold-500 text-white'
                    : 'bg-cream-50 text-gray-400 border border-rosegold-200'
                }`}>
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className={`hidden md:block text-sm ${
                  step >= s.num ? 'text-gray-800' : 'text-gray-400'
                }`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Information */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card-rose p-6"
                >
                  <h2 className="text-xl font-display font-semibold text-gray-800 mb-6">Contact Information</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="input-rose"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="input-rose"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          placeholder="07X XXX XXXX"
                          className="input-rose"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="input-rose"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Province *</label>
                        <select
                          name="province"
                          value={formData.province}
                          onChange={handleInputChange}
                          required
                          className="input-rose"
                        >
                          <option value="">Select Province</option>
                          {provinces.map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">District *</label>
                        <select
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          required
                          disabled={!selectedProvince}
                          className="input-rose disabled:opacity-50"
                        >
                          <option value="">Select District</option>
                          {selectedProvince && districts[selectedProvince]?.map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="input-rose"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Order Notes (Optional)</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="input-rose resize-none"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep()) setStep(2)
                      }}
                      className="btn-rose flex items-center gap-2"
                    >
                      Continue to Delivery
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Delivery */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card-rose p-6"
                >
                  <h2 className="text-xl font-display font-semibold text-gray-800 mb-6">Delivery Method</h2>

                  <div className="space-y-3">
                    {deliveryMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedDelivery === method.id
                            ? 'border-rosegold-500 bg-rosegold-50'
                            : 'border-rosegold-200 hover:border-rosegold-400'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="radio"
                            name="delivery"
                            value={method.id}
                            checked={selectedDelivery === method.id}
                            onChange={(e) => setSelectedDelivery(e.target.value)}
                            className="w-5 h-5 text-rosegold-500 focus:ring-rosegold-500"
                          />
                          <div>
                            <p className="font-medium text-gray-800">{method.name}</p>
                            <p className="text-sm text-gray-400">{method.time}</p>
                          </div>
                        </div>
                        <span className="font-medium text-gray-800">
                          {method.price === 0 ? 'Free' : formatPrice(method.price)}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn-ghost text-gray-500"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="btn-rose flex items-center gap-2"
                    >
                      Continue to Payment
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card-rose p-6"
                >
                  <h2 className="text-xl font-display font-semibold text-gray-800 mb-6">Payment Method</h2>

                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedPayment === method.id
                            ? 'border-rosegold-500 bg-rosegold-50'
                            : 'border-rosegold-200 hover:border-rosegold-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={selectedPayment === method.id}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="w-5 h-5 text-rosegold-500 focus:ring-rosegold-500"
                        />
                        <method.icon className="w-6 h-6 text-rosegold-500" />
                        <div>
                          <p className="font-medium text-gray-800">{method.name}</p>
                          <p className="text-sm text-gray-400">{method.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-cream-50 border border-rosegold-200">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Lock className="w-4 h-4" />
                      <span>Your payment information is secure and encrypted</span>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn-ghost text-gray-500"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="btn-rose flex items-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Place Order
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card-rose p-6 sticky top-24">
              <h2 className="text-xl font-display font-semibold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-cream-50 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-800">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-rosegold-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-gray-800">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="text-gray-800">
                    {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="border-t border-rosegold-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-800">Total</span>
                    <span className="text-xl font-bold text-rosegold-500">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
