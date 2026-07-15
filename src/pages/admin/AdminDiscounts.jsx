import { useState, useEffect } from 'react'
import { supabase } from '@lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Trash2,
  X,
  Loader2,
  Edit,
  Save,
  Tag,
  Percent,
  DollarSign,
} from 'lucide-react'

const formatLKR = (amount) =>
  new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
  }).format(amount)

const emptyForm = {
  code: '',
  type: 'percentage',
  value: '',
  min_order: '',
  max_uses: '',
  expires_at: '',
  is_active: true,
}

export default function AdminDiscounts() {
  const [discounts, setDiscounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchDiscounts()
  }, [])

  const fetchDiscounts = async () => {
    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setDiscounts(data || [])
    setLoading(false)
  }

  const openAddModal = () => {
    setEditingId(null)
    setForm({ ...emptyForm })
    setShowModal(true)
  }

  const openEditModal = (d) => {
    setEditingId(d.id)
    setForm({
      code: d.code,
      type: d.type,
      value: d.value,
      min_order: d.min_order || '',
      max_uses: d.max_uses ?? '',
      expires_at: d.expires_at ? d.expires_at.split('T')[0] : '',
      is_active: d.is_active,
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
    setForm({ ...emptyForm })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      code: form.code.toUpperCase(),
      type: form.type,
      value: form.value ? parseFloat(form.value) : 0,
      min_order: form.min_order ? parseFloat(form.min_order) : 0,
      max_uses: form.max_uses ? parseInt(form.max_uses, 10) : null,
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
      is_active: form.is_active,
    }

    if (editingId) {
      const { error } = await supabase
        .from('discount_codes')
        .update(payload)
        .eq('id', editingId)

      if (!error) {
        closeModal()
        fetchDiscounts()
      }
    } else {
      const { error } = await supabase.from('discount_codes').insert(payload)

      if (!error) {
        closeModal()
        fetchDiscounts()
      }
    }

    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    await supabase.from('discount_codes').delete().eq('id', deleteId)
    setDeleteId(null)
    setDeleting(false)
    fetchDiscounts()
  }

  const toggleActive = async (id, currentValue) => {
    await supabase
      .from('discount_codes')
      .update({ is_active: !currentValue })
      .eq('id', id)
    setDiscounts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, is_active: !currentValue } : d))
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-rosegold-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800">Discount Codes</h1>
          <p className="text-gray-400 text-sm mt-1">{discounts.length} discount codes</p>
        </div>
        <button onClick={openAddModal} className="btn-rose">
          <Plus className="w-4 h-4" />
          Add Discount
        </button>
      </div>

      <div className="card-rose hover:transform-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rosegold-100">
                <th className="text-left px-5 py-3 font-medium text-gray-400">Code</th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">Type</th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">Value</th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">Min Order</th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">Uses</th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">Active</th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">Expires</th>
                <th className="text-right px-5 py-3 font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-gray-400">
                    No discount codes yet
                  </td>
                </tr>
              ) : (
                discounts.map((d) => (
                  <tr
                    key={d.id}
                    className="border-b border-rosegold-50 last:border-0 hover:bg-rosegold-50/30 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <span className="font-mono font-semibold text-gray-800 tracking-wide">
                        {d.code}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          d.type === 'percentage'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {d.type === 'percentage' ? (
                          <Percent className="w-3 h-3" />
                        ) : (
                          <DollarSign className="w-3 h-3" />
                        )}
                        {d.type === 'percentage' ? 'Percentage' : 'Fixed'}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-medium text-gray-700">
                      {d.type === 'percentage' ? `${d.value}%` : formatLKR(d.value)}
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {d.min_order > 0 ? formatLKR(d.min_order) : '—'}
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {d.max_uses != null
                        ? `${d.used_count} / ${d.max_uses}`
                        : d.used_count}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleActive(d.id, d.is_active)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          d.is_active ? 'bg-rosegold-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            d.is_active ? 'translate-x-[18px]' : 'translate-x-[3px]'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-sm">
                      {d.expires_at
                        ? new Date(d.expires_at).toLocaleDateString('en-LK')
                        : '—'}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(d)}
                          className="p-1.5 rounded-lg text-gray-300 hover:text-rosegold-500 hover:bg-rosegold-50 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(d.id)}
                          className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-rosegold-100">
                <h2 className="text-xl font-display font-bold text-gray-800 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-rosegold-500" />
                  {editingId ? 'Edit Discount' : 'Add Discount'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-xl hover:bg-rosegold-50 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.code}
                    onChange={(e) =>
                      setForm({ ...form, code: e.target.value.toUpperCase() })
                    }
                    className="input-rose font-mono"
                    placeholder="SUMMER25"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Type *
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="input-rose"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Value *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={form.value}
                      onChange={(e) => setForm({ ...form, value: e.target.value })}
                      className="input-rose"
                      placeholder={form.type === 'percentage' ? '25' : '500'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Min Order (LKR)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.min_order}
                      onChange={(e) =>
                        setForm({ ...form, min_order: e.target.value })
                      }
                      className="input-rose"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Max Uses
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={form.max_uses}
                      onChange={(e) =>
                        setForm({ ...form, max_uses: e.target.value })
                      }
                      className="input-rose"
                      placeholder="Unlimited"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Expires At
                  </label>
                  <input
                    type="date"
                    value={form.expires_at}
                    onChange={(e) =>
                      setForm({ ...form, expires_at: e.target.value })
                    }
                    className="input-rose"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) =>
                      setForm({ ...form, is_active: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-rosegold-300 text-rosegold-500 focus:ring-rosegold-400"
                  />
                  <span className="text-sm text-gray-600">Active</span>
                </label>

                <div className="flex justify-end gap-3 pt-4 border-t border-rosegold-100">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-outline-rose"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="btn-rose">
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {editingId ? 'Update Discount' : 'Save Discount'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Delete Discount?
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="btn-outline-rose flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  {deleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
