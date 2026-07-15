import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Clock, Gift, Heart, Headphones, Sparkles } from 'lucide-react'
import Newsletter from '@components/Newsletter'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/shop?category=couple' },
  { label: 'About Us', href: '/about' },
]

const customerCare = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Shipping', href: '/shipping-policy' },
  { label: 'Returns', href: '/return-policy' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms', href: '/terms' },
]

const trustItems = [
  { icon: Gift, title: 'Premium Packaging', desc: 'Elegantly wrapped for you' },
  { icon: Heart, title: 'Perfect for Gifting', desc: 'Make every moment special' },
  { icon: Headphones, title: 'Customer Support', desc: 'Here whenever you need us' },
  { icon: Sparkles, title: 'Shine Everyday', desc: 'Luxury that lasts' },
]

export default function Footer() {
  return (
    <footer>
      <Newsletter />

      <div className="bg-[#A67C82]">
        <div className="container-custom py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustItems.map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center text-white">
                <item.icon className="w-8 h-8 mb-3" strokeWidth={1.5} />
                <h4 className="font-semibold text-sm tracking-[0.15em] uppercase mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-white/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#5C3D3F]">
        <div className="container-custom py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 lg:pl-4">
              <Link to="/" className="inline-block">
                <span className="font-display text-2xl tracking-[0.35em] text-white font-semibold">
                  INARA
                </span>
              </Link>
              <p className="mt-3 text-white/60 text-sm leading-relaxed max-w-xs">
                An opulent touch everyday
              </p>

              <div className="flex items-center gap-3 mt-6">
                <a
                  href="https://instagram.com/jewel.inara"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-[#B76E79] transition-all duration-300"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a
                  href="https://facebook.com/jewel.inara"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-[#B76E79] transition-all duration-300"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-white text-xs tracking-[0.15em] uppercase font-semibold mb-5">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-white/60 hover:text-[#B76E79] transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-white text-xs tracking-[0.15em] uppercase font-semibold mb-5">
                Customer Care
              </h4>
              <ul className="space-y-3">
                {customerCare.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-white/60 hover:text-[#B76E79] transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-4">
              <h4 className="text-white text-xs tracking-[0.15em] uppercase font-semibold mb-5">
                Contact Info
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-white/60">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#B76E79]" />
                  <span>No. 42, Galle Road, Colombo 03, Sri Lanka</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-white/60">
                  <Phone className="w-4 h-4 shrink-0 text-[#B76E79]" />
                  <a href="tel:+94112345678" className="hover:text-white transition-colors duration-300">
                    +94 11 234 5678
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm text-white/60">
                  <Mail className="w-4 h-4 shrink-0 text-[#B76E79]" />
                  <a href="mailto:info@jewelinara.com" className="hover:text-white transition-colors duration-300">
                    info@jewelinara.com
                  </a>
                </li>
                <li className="flex items-start gap-3 text-sm text-white/60">
                  <Clock className="w-4 h-4 mt-0.5 shrink-0 text-[#B76E79]" />
                  <span>Mon - Sat: 10:00 AM - 7:00 PM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-[#B76E79]/30">
          <div className="container-custom py-5">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/50">
              <span>&copy; {new Date().getFullYear()} INARA. All rights reserved.</span>
              <span className="text-white/40">Crafted with love in Sri Lanka</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
