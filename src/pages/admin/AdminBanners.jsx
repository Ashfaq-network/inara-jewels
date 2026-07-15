import { useState, useEffect } from 'react'
import { supabase } from '@lib/supabase'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Trash2, X, Loader2, Edit, ImageIcon, Save, Eye, EyeOff } from 'lucide-react'

const emptyForm = { title: '', subtitle: '', image: '', link: '', sort_order: 0, is_active: true }

export default function AdminBanners() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [deletingBanner, setDeletingBanner] = useState(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => { fetchBanners() }, [])

  async function fetchBanners() {
    setLoading(true)
    const { data, error } = await supabase.from('banners').select('*').order('sort_order', { ascending: true })
    if (!error) setBanners(data || [])
    setLoading(false)
  }

  function openAdd() { setEditingBanner(null); setForm(emptyForm); setShowModal(true) }
  function openEdit(b) { setEditingBanner(b); setForm({ title: b.title, subtitle: b.subtitle || '', image: b.image, link: b.link || '', sort_order: b.sort_order, is_active: b.is_active }); setShowModal(true) }
  function closeModal() { setShowModal(false); setEditingBanner(null); setForm(emptyForm) }

  async function handleSave() {
    setSaving(true)
    const payload = { title: form.title, subtitle: form.subtitle, image: form.image, link: form.link || null, sort_order: form.sort_order, is_active: form.is_active }
    if (editingBanner) {
      const { error } = await supabase.from('banners').update(payload).eq('id', editingBanner.id)
      if (!error) { await fetchBanners(); closeModal() }
    } else {
      const { error } = await supabase.from('banners').insert([payload])
      if (!error) { await fetchBanners(); closeModal() }
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (!deletingBanner) return
    setSaving(true)
    const { error } = await supabase.from('banners').delete().eq('id', deletingBanner.id)
    if (!error) { await fetchBanners(); setShowDeleteModal(false); setDeletingBanner(null) }
    setSaving(false)
  }

  async function toggleActive(banner) {
    const { error } = await supabase.from('banners').update({ is_active: !banner.is_active }).eq('id', banner.id)
    if (!error) setBanners((prev) => prev.map((b) => b.id === banner.id ? { ...b, is_active: !b.is_active } : b))
  }

  async function updateSortOrder(banner, value) {
    const sortOrder = parseInt(value, 10) || 0
    const { error } = await supabase.from('banners').update({ sort_order: sortOrder }).eq('id', banner.id)
    if (!error) setBanners((prev) => prev.map((b) => b.id === banner.id ? { ...b, sort_order: sortOrder } : b))
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-rosegold-500 animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800">Banners</h1>
          <p className="text-gray-400 text-sm mt-1">{banners.length} banners total</p>
        </div>
        <button onClick={openAdd} className="btn-rose"><Plus className="w-4 h-4" /> Add Banner</button>
      </div>

      {banners.length === 0 ? (
        <div className="card-rose p-12 text-center hover:transform-none">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No banners yet. Add your first banner!</p>
        </div>
      ) : (
        <div className="card-rose hover:transform-none overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rosegold-100">
                  <th className="text-left px-5 py-3 font-medium text-gray-400">Image</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-400">Title</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-400">Subtitle</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-400">Link</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-400">Sort</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-400">Active</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => (
                  <tr key={banner.id} className="border-b border-rosegold-50 last:border-0 hover:bg-rosegold-50/30 transition-colors">
                    <td className="px-5 py-3">
                      {banner.image ? (
                        <img src={banner.image} alt={banner.title} className="w-24 h-14 rounded-lg object-cover" />
                      ) : (
                        <div className="w-24 h-14 rounded-lg bg-rosegold-50 flex items-center justify-center"><ImageIcon className="w-5 h-5 text-rosegold-300" /></div>
                      )}
                    </td>
                    <td className="px-5 py-3 font-medium text-gray-700">{banner.title}</td>
                    <td className="px-5 py-3 text-gray-500">{banner.subtitle || '—'}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs truncate max-w-[150px]">{banner.link || '—'}</td>
                    <td className="px-5 py-3">
                      <input type="number" value={banner.sort_order} onChange={(e) => updateSortOrder(banner, e.target.value)} className="w-14 text-center text-sm border border-rosegold-200 rounded-lg py-1 focus:outline-none focus:border-rosegold-400 bg-white" />
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => toggleActive(banner)} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${banner.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {banner.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {banner.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(banner)} className="p-1.5 rounded-lg text-gray-300 hover:text-rosegold-500 hover:bg-rosegold-50 transition-colors"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => { setDeletingBanner(banner); setShowDeleteModal(true) }} className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-rosegold-100">
                <h2 className="text-xl font-display font-bold text-gray-800">{editingBanner ? 'Edit Banner' : 'Add Banner'}</h2>
                <button onClick={closeModal} className="p-2 rounded-xl hover:bg-rosegold-50 transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Title *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-rose" placeholder="Banner title" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Subtitle</label>
                  <input type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="input-rose" placeholder="Subtitle" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Image URL *</label>
                  <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="input-rose" placeholder="/images/banners/..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Link (optional)</label>
                  <input type="text" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="input-rose" placeholder="/shop" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Sort Order</label>
                    <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value, 10) || 0 })} className="input-rose" />
                  </div>
                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded border-rosegold-300 text-rosegold-500 focus:ring-rosegold-400" />
                      <span className="text-sm text-gray-600">Active</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-rosegold-100">
                  <button onClick={closeModal} className="btn-outline-rose">Cancel</button>
                  <button onClick={handleSave} disabled={saving || !form.title || !form.image} className="btn-rose">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {editingBanner ? 'Save Changes' : 'Add Banner'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setShowDeleteModal(false); setDeletingBanner(null) }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-500" /></div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Banner?</h3>
              <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => { setShowDeleteModal(false); setDeletingBanner(null) }} className="btn-outline-rose flex-1">Cancel</button>
                <button onClick={handleDelete} disabled={saving} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition-colors">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
