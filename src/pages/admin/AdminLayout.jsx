import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@stores/authStore'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  Menu,
  X,
  FolderOpen,
  Image,
  Tag,
  Settings,
} from 'lucide-react'

const navLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/dashboard/products', label: 'Products', icon: Package },
  { to: '/admin/dashboard/categories', label: 'Categories', icon: FolderOpen },
  { to: '/admin/dashboard/banners', label: 'Banners', icon: Image },
  { to: '/admin/dashboard/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/dashboard/customers', label: 'Customers', icon: Users },
  { to: '/admin/dashboard/discounts', label: 'Discounts', icon: Tag },
  { to: '/admin/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuthStore()

  const handleLogout = async () => {
    await signOut()
    navigate('/admin')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'rgba(248, 240, 240, 0.3)' }}>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-rosegold-100 z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-rosegold-100">
          <Link to="/admin/dashboard" className="block" onClick={() => setSidebarOpen(false)}>
            <span className="text-xl font-display font-bold text-gradient">Inara Jewels</span>
            <span className="block text-xs text-gray-400 mt-0.5 tracking-wider uppercase">Admin Panel</span>
          </Link>
        </div>

        <nav className="p-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon
            const active = isActive(link.to)
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-rosegold-500 text-white shadow-lg shadow-rosegold-500/20'
                    : 'text-gray-500 hover:bg-rosegold-50 hover:text-rosegold-600'
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-rosegold-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-200 w-full"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-rosegold-100">
          <div className="flex items-center justify-between px-4 md:px-8 h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-rosegold-50 transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-sm font-medium text-gray-500 hidden sm:block">
                Welcome, {profile?.name || 'Admin'}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rosegold-100 flex items-center justify-center text-sm font-semibold text-rosegold-600">
                {profile?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
