import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { ReactLenis } from 'lenis/react'
import { useAuthStore } from '@stores/authStore'

// Layout
import Header from '@components/layout/Header'
import Footer from '@components/layout/Footer'

// Pages
import Home from '@pages/Home'
import Shop from '@pages/Shop'
import ProductDetail from '@pages/ProductDetail'
import Cart from '@pages/Cart'
import Checkout from '@pages/Checkout'
import Login from '@pages/Login'
import Register from '@pages/Register'
import Account from '@pages/Account'
import About from '@pages/About'
import Contact from '@pages/Contact'
import FAQ from '@pages/FAQ'
import OrderConfirmation from '@pages/OrderConfirmation'
import OrderTracking from '@pages/OrderTracking'
import Wishlist from '@pages/Wishlist'
import Reviews from '@pages/Reviews'

// Policies
import PrivacyPolicy from '@pages/policies/PrivacyPolicy'
import ReturnPolicy from '@pages/policies/ReturnPolicy'
import ShippingPolicy from '@pages/policies/ShippingPolicy'
import Terms from '@pages/policies/Terms'
import JewelryCare from '@pages/policies/JewelryCare'

// Components
import WhatsAppButton from '@components/WhatsAppButton'

// Admin
import AdminLogin from '@pages/admin/AdminLogin'
import AdminLayout from '@pages/admin/AdminLayout'
import Dashboard from '@pages/admin/Dashboard'
import AdminProducts from '@pages/admin/AdminProducts'
import AdminOrders from '@pages/admin/AdminOrders'
import AdminCustomers from '@pages/admin/AdminCustomers'
import AdminCategories from '@pages/admin/AdminCategories'
import AdminBanners from '@pages/admin/AdminBanners'
import AdminDiscounts from '@pages/admin/AdminDiscounts'
import AdminSettings from '@pages/admin/AdminSettings'

function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-display font-bold text-rosegold-300 mb-4">404</h1>
        <h2 className="text-2xl font-display text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
        <a href="/" className="btn-rose">Back to Home</a>
      </div>
    </div>
  )
}

function StoreLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <WhatsAppButton />
      <Footer />
    </div>
  )
}

export default function App() {
  const { initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <ReactLenis root>
      <Router>
        <Routes>
          {/* Admin routes — no Header/Footer */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="discounts" element={<AdminDiscounts />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Store routes — with Header + Footer */}
          <Route path="*" element={
            <StoreLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:slug" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/account" element={<Account />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/track-order" element={<OrderTracking />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/return-policy" element={<ReturnPolicy />} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/jewelry-care" element={<JewelryCare />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </StoreLayout>
          } />
        </Routes>
      </Router>
    </ReactLenis>
  )
}
