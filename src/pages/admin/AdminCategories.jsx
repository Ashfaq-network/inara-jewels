import { useState, useEffect } from 'react'
import { supabase } from '@lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Trash2,
  X,
  Loader2,
  Edit,
  ImageIcon,
  Save,
  FolderOpen,
} from 'lucide-react'
import ImageUpload from '@components/admin/ImageUpload'

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

const emptyForm = {
  name: '',
  image: '',
  parent_id: '',
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [productCounts, setProductCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchCategories()
    fetchProductCounts()
  }, [])

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setCategories(data || [])
    setLoading(false)
  }

  const fetchProductCounts = async () => {
    const { data } = await supabase.from('products').select('category_id')
    if (data) {
      const counts = {}
      data.forEach((p) => {
        if (p.category_id) {
          counts[p.category_id] = (counts[p.category_id] || 0) + 1
        }
      })
      setProductCounts(counts)
    }
  }

  const openAdd = () => {
    setEditingId(null)
    setForm({ ...emptyForm })
    setShowModal(true)
  }

  const openEdit = (cat) => {
    setEditingId(cat.id)
    setForm({
      name: cat.name,
      image: cat.image || '',
      parent_id: cat.parent_id || '',
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const original = editingId ? categories.find(c => c.id === editingId) : null
    const slug = original?.slug || slugify(form.name)
    const payload = {
      name: form.name,
      slug,
      image: form.image || null,
      parent_id: form.parent_id || null,
    }

    if (editingId) {
      await supabase.from('categories').update(payload).eq('id', editingId)
    } else {
      await supabase.from('categories').insert(payload)
    }

    setShowModal(false)
    setEditingId(null)
    setForm({ ...emptyForm })
    fetchCategories()
    fetchProductCounts()
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    await supabase.from('categories').delete().eq('id', deleteId)
    setDeleteId(null)
    setDeleting(false)
    fetchCategories()
    fetchProductCounts()
  }

  const getParentName = (parentId) => {
    if (!parentId) return '—'
    const parent = categories.find((c) => c.id === parentId)
    return parent ? parent.name : '—'
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
          <h1 className="text-2xl font-display font-bold text-gray-800">Categories</h1>
          <p className="text-gray-400 text-sm mt-1">{categories.length} categories total</p>
        </div>
        <button onClick={openAdd} className="btn-rose">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="card-rose hover:transform-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rosegold-100">
                <th className="text-left px-5 py-3 font-medium text-gray-400">Image</th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">Name</th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">Slug</th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">Parent</th>
                <th className="text-left px-5 py-3 font-medium text-gray-400">Products</th>
                <th className="text-right px-5 py-3 font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                    <FolderOpen className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    No categories found. Add your first category!
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="border-b border-rosegold-50 last:border-0 hover:bg-rosegold-50/30 transition-colors"
                  >
                    <td className="px-5 py-3">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-rosegold-50 flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-rosegold-300" />
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-700 max-w-[200px] truncate">{cat.name}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{cat.slug}</td>
                    <td className="px-5 py-3 text-gray-500">{getParentName(cat.parent_id)}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rosegold-100 text-rosegold-700">
                        {productCounts[cat.id] || 0}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(cat)}
                          className="p-1.5 rounded-lg text-gray-300 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(cat.id)}
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
                  {editingId ? 'Edit Category' : 'Add Category'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-xl hover:bg-rosegold-50 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-rose"
                    placeholder="Category name"
                  />
                  {form.name && (
                    <p className="text-xs text-gray-400 mt-1">
                      Slug: {slugify(form.name)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Category Image</label>
                  <ImageUpload
                    bucket="categories"
                    existingImages={form.image ? [form.image] : []}
                    onUpload={(imgs) => setForm({ ...form, image: imgs[0] || '' })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Parent Category</label>
                  <select
                    value={form.parent_id}
                    onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
                    className="input-rose"
                  >
                    <option value="">None (top-level)</option>
                    {categories
                      .filter((c) => c.id !== editingId)
                      .map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
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
                    {editingId ? 'Update Category' : 'Save Category'}
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
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Category?</h3>
              <p className="text-gray-500 text-sm mb-6">
                This will remove the category. Products in this category will not be deleted.
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
