import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Package, Heart, MapPin, LogOut, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'

export default function Account() {
  const navigate = useNavigate()
  const { user, profile, signOut, updateProfile } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState(null)

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-softwhite">
        <h1 className="text-2xl font-display font-semibold text-gray-800 mb-4">Please sign in</h1>
        <Link to="/login" className="btn-rose">Sign In</Link>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleProfileSave = async (e) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setSaveMsg(null)

    const form = e.target
    const name = form.elements.name?.value || profile?.name
    const phone = form.elements.phone?.value || profile?.phone

    const { error } = await updateProfile({ name, phone })

    if (!error) {
      setSaveMsg('Profile saved!')
      setTimeout(() => setSaveMsg(null), 2500)
    }
    setSaving(false)
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
  ]

  return (
    <div className="min-h-screen bg-softwhite">
      <div className="container-custom px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-8">
          My <span className="text-gradient">Account</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card-rose p-4">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-rosegold-200">
                <div className="w-16 h-16 rounded-full bg-rosegold-50 flex items-center justify-center">
                  <span className="text-2xl font-bold text-rosegold-500">
                    {profile?.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{profile?.name || 'User'}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-rosegold-50 text-rosegold-500'
                        : 'text-gray-400 hover:bg-cream-50 hover:text-gray-800'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="card-rose p-6">
                <h2 className="text-xl font-display font-semibold text-gray-800 mb-6">Profile Information</h2>
                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={profile?.name}
                        className="input-rose"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="input-rose opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        defaultValue={profile?.phone}
                        className="input-rose"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="submit" disabled={saving} className="btn-rose">
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    {saveMsg && <span className="text-sm text-green-600 font-medium">{saveMsg}</span>}
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="card-rose p-6">
                <h2 className="text-xl font-display font-semibold text-gray-800 mb-6">Order History</h2>
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No orders yet</p>
                  <Link to="/shop" className="btn-rose mt-4 inline-flex items-center gap-2">
                    Start Shopping
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="card-rose p-6">
                <h2 className="text-xl font-display font-semibold text-gray-800 mb-6">Wishlist</h2>
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Your wishlist is empty</p>
                  <Link to="/shop" className="btn-rose mt-4 inline-flex items-center gap-2">
                    Discover Products
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="card-rose p-6">
                <h2 className="text-xl font-display font-semibold text-gray-800 mb-6">Saved Addresses</h2>
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No saved addresses</p>
                  <button className="btn-rose mt-4">Add Address</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
