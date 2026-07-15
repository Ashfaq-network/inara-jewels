import { useState, useEffect } from 'react'
import { supabase } from '@lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Trash2,
  X,
  Loader2,
  Star,
  Sparkles,
  TrendingUp,
  Save,
  ImageIcon,
  Edit,
  Search,
} from 'lucide-react'

const formatLKR = (amount) =>
  new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
  }).format(amount)

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  compare_at_price: '',
  images: '',
  colors: '',
  category_id: '',
  stock: '',
  is_featured: false,
  is_new: false,
  is_best_seller: false,
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState({ ...emptyProduct })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(name, slug)')
      .order('created_at', { ascending: false })

    if (!error) setProducts(data || [])
    setLoading(false)
  }

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories(data || [])
  }

  const openAdd = () => {
    setEditingProduct(null)
    setForm({ ...emptyProduct })
    setShowModal(true)
  }

  const openEdit = (product) => {
    setEditingProduct(product)
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      compare_at_price: product.compare_at_price?.toString() || '',
      images: (product.images || []).join(', '),
      colors: (product.colors || []).join(', '),
      category_id: product.category_id || '',
      stock: product.stock?.toString() || '0',
      is_featured: product.is_featured || false,
      is_new: product.is_new || false,
      is_best_seller: product.is_best_seller || false,
    })
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    const slug = editingProduct ? editingProduct.slug : slugify(form.name)
    const imagesArray = form.images
      ? form.images.split(',').map((s) => s.trim()).filter(Boolean)
      : []
    const colorsArray = form.colors
      ? form.colors.split(',').map((s) => s.trim()).filter(Boolean)
      : []

    const payload = {
      name: form.name,
      slug,
      description: form.description,
      price: parseInt(form.price, 10),
      compare_at_price: form.compare_at_price ? parseInt(form.compare_at_price, 10) : null,
      images: imagesArray,
      colors: colorsArray,
      category_id: form.category_id || null,
      stock: parseInt(form.stock, 10) || 0,
      is_featured: form.is_featured,
      is_new: form.is_new,
      is_best_seller: form.is_best_seller,
    }

    let error
    if (editingProduct) {
      ;({ error } = await supabase.from('products').update(payload).eq('id', editingProduct.id))
    } else {
      ;({ error } = await supabase.from('products').insert(payload))
    }

    if (!error) {
      setShowModal(false)
      setEditingProduct(null)
      setForm({ ...emptyProduct })
      fetchProducts()
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    await supabase.from('products').delete().eq('id', deleteId)
    setDeleteId(null)
    setDeleting(false)
    fetchProducts()
  }

  const toggleField = async (id, field, currentValue) => {
    await supabase.from('products').update({ [field]: !currentValue }).eq('id', id)
    fetchProducts()
  }

  const updateStock = async (id, newStock) => {
    const stock = parseInt(newStock, 10)
    if (!isNaN(stock) && stock >= 0) {
      await supabase.from('products').update({ stock }).eq('id', id)
    }
  }

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-rosegold-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800">Products</h1>
          <p className="text-gray-400 text-sm mt-1">{products.length} products total</p>
        </div>
        <button onClick={openAdd} className="btn-rose">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-rose pl-10"
        />
      </div>

      <div className="card-rose hover:transform-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rosegold-100">
                <th className="text-left px-5 py-3 font-medium text-gray-400">Image</th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">Name</th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">Category</th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">Price</th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">Stock</th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">Featured</th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">New</th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">Best Seller</th>
                <th className="text-right px-5 py-3 font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-gray-400">
                    {search ? 'No products match your search.' : 'No products found. Add your first product!'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-rosegold-50 last:border-0 hover:bg-rosegold-50/30 transition-colors">
                    <td className="px-5 py-3">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-rosegold-50 flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-rosegold-300" />
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-700 max-w-[200px] truncate">{product.name}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {product.category?.name || '—'}
                    </td>
                    <td className="px-5 py-3 text-gray-700 font-medium">
                      {formatLKR(product.price)}
                    </td>
                    <td className="px-5 py-3">
                      <input
                        type="number"
                        defaultValue={product.stock}
                        onBlur={(e) => updateStock(product.id, e.target.value)}
                        className="w-16 text-center text-sm border border-rosegold-200 rounded-lg py-1 focus:outline-none focus:border-rosegold-400 bg-white"
                        min="0"
                      />
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleField(product.id, 'is_featured', product.is_featured)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          product.is_featured ? 'text-amber-500 bg-amber-50' : 'text-gray-300 hover:text-amber-400 hover:bg-amber-50'
                        }`}
                      >
                        <Star className="w-4 h-4" fill={product.is_featured ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleField(product.id, 'is_new', product.is_new)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          product.is_new ? 'text-green-500 bg-green-50' : 'text-gray-300 hover:text-green-400 hover:bg-green-50'
                        }`}
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleField(product.id, 'is_best_seller', product.is_best_seller)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          product.is_best_seller ? 'text-purple-500 bg-purple-50' : 'text-gray-300 hover:text-purple-400 hover:bg-purple-50'
                        }`}
                      >
                        <TrendingUp className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-1.5 rounded-lg text-gray-300 hover:text-rosegold-500 hover:bg-rosegold-50 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
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
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-rosegold-100">
                <h2 className="text-xl font-display font-bold text-gray-800">
                  {editingProduct ? 'Edit Product' : 'Add Product'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-xl hover:bg-rosegold-50 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-rose"
                    placeholder="Product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="input-rose !rounded-2xl resize-none"
                    placeholder="Product description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Price (LKR) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="input-rose"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Compare Price (LKR)</label>
                    <input
                      type="number"
                      min="0"
                      value={form.compare_at_price}
                      onChange={(e) => setForm({ ...form, compare_at_price: e.target.value })}
                      className="input-rose"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Image URLs (comma-separated)</label>
                  <input
                    type="text"
                    value={form.images}
                    onChange={(e) => setForm({ ...form, images: e.target.value })}
                    className="input-rose"
                    placeholder="/images/products/img1.jpg, /images/products/img2.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Colors (hex, comma-separated)</label>
                  <input
                    type="text"
                    value={form.colors}
                    onChange={(e) => setForm({ ...form, colors: e.target.value })}
                    className="input-rose"
                    placeholder="#B76E79, #FFFFFF"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Category</label>
                    <select
                      value={form.category_id}
                      onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                      className="input-rose"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Stock *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      className="input-rose"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_featured}
                      onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                      className="w-4 h-4 rounded border-rosegold-300 text-rosegold-500 focus:ring-rosegold-400"
                    />
                    <span className="text-sm text-gray-600">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_new}
                      onChange={(e) => setForm({ ...form, is_new: e.target.checked })}
                      className="w-4 h-4 rounded border-rosegold-300 text-rosegold-500 focus:ring-rosegold-400"
                    />
                    <span className="text-sm text-gray-600">New</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_best_seller}
                      onChange={(e) => setForm({ ...form, is_best_seller: e.target.checked })}
                      className="w-4 h-4 rounded border-rosegold-300 text-rosegold-500 focus:ring-rosegold-400"
                    />
                    <span className="text-sm text-gray-600">Best Seller</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-rosegold-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-outline-rose"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-rose"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {editingProduct ? 'Save Changes' : 'Save Product'}
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
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Product?</h3>
              <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
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
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
