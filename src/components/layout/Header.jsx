import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Search, User, ShoppingBag, Menu, X, Truck } from 'lucide-react'
import { useCartStore } from '@stores/cartStore'
import { useAuthStore } from '@stores/authStore'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/shop?category=couple', label: 'Collections' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { items } = useCartStore()
  const { user } = useAuthStore()

  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0)

  const isActiveLink = (href) => {
    const linkUrl = new URL(href, window.location.origin)
    const currentPath = location.pathname
    const currentSearch = location.search

    if (linkUrl.pathname === '/' && currentPath === '/') return true
    if (linkUrl.pathname === '/') return false

    if (linkUrl.search) {
      return currentPath === linkUrl.pathname && currentSearch === linkUrl.search
    }
    return currentPath === linkUrl.pathname && !currentSearch
  }

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  return (
    <header className="relative z-50">
      {/* Utility Bar */}
      <div
        style={{ backgroundColor: '#E8DFD5', color: '#4B4141' }}
        className="hidden md:block"
      >
        <div className="container mx-auto px-6 py-2.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] opacity-90">
            <Truck className="w-3 h-3" />
            Free Delivery Across Islandwide
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] opacity-90">
            Waterproof &nbsp;&bull;&nbsp; Anti-Tarnish &nbsp;&bull;&nbsp; 18K Gold Plated
          </span>
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com/jewel.inara"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a
              href="https://wa.me/94770786864"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={`transition-all duration-500 bg-white ${
          isScrolled
            ? 'backdrop-blur-md bg-white/90 border-b border-[#A67C82]/10 shadow-sm'
            : ''
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex flex-col items-center shrink-0 leading-none">
            <span
            dir="rtl"
            className="select-none"
            style={{
              fontFamily: "'Noto Naskh Arabic', serif",
              fontSize: '1rem',
              fontWeight: 600,
              color: '#8F7477',
              letterSpacing: '0.02em',
              lineHeight: 1,
            }}
          >
            إنارا
          </span>
          <span
            className="font-display text-[0.7rem] tracking-[0.35em] font-light"
              style={{ color: '#4B4141' }}
            >
              INARA
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-[11px] uppercase tracking-[0.2em] font-medium transition-colors duration-300 ${
                  isActiveLink(link.href)
                    ? 'text-[#A67C82]'
                    : 'text-[#7A6365] hover:text-[#A67C82]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            <button className="p-2.5 rounded-full transition-colors duration-300 hover:bg-[#A67C82]/10">
              <Search className="w-[18px] h-[18px]" style={{ color: '#7A6365' }} />
            </button>

            <Link
              to={user ? '/account' : '/login'}
              className="p-2.5 rounded-full transition-colors duration-300 hover:bg-[#A67C82]/10 hidden sm:flex"
            >
              <User className="w-[18px] h-[18px]" style={{ color: '#7A6365' }} />
            </Link>

            <Link
              to="/cart"
              className="p-2.5 rounded-full transition-colors duration-300 hover:bg-[#A67C82]/10 relative"
            >
              <ShoppingBag className="w-[18px] h-[18px]" style={{ color: '#7A6365' }} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#A67C82] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Toggle */}
            <button
              className="p-2.5 lg:hidden rounded-full transition-colors duration-300 hover:bg-[#A67C82]/10"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" style={{ color: '#5C3D3F' }} />
              ) : (
                <Menu className="w-5 h-5" style={{ color: '#5C3D3F' }} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="lg:hidden overflow-hidden fixed left-0 right-0 z-40"
            style={{ top: '80px', backgroundColor: '#FDF6F0' }}
          >
            <div className="container mx-auto px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.href}
                    className={`block py-3 px-4 rounded-lg text-[11px] uppercase tracking-[0.2em] font-medium transition-colors duration-200 ${
                      isActiveLink(link.href)
                        ? 'text-[#A67C82] bg-[#A67C82]/8'
                        : 'text-[#7A6365] hover:text-[#A67C82] hover:bg-[#A67C82]/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="border-t mt-2 pt-3 flex items-center gap-4 px-4">
                <Link
                  to={user ? '/account' : '/login'}
                  className="flex items-center gap-2 text-[#7A6365] text-[11px] tracking-[0.2em] uppercase"
                >
                  <User className="w-4 h-4" />
                  Account
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
