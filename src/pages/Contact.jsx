import { useState } from 'react'
import { Mail, Phone, MapPin, MessageCircle, Camera, Globe, Send, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '@lib/supabase'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    value: '+94 XX XXX XXXX',
    href: 'tel:+94XXXXXXXXX',
    color: 'green',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    value: '+94 XX XXX XXXX',
    href: 'https://wa.me/94XXXXXXXXX',
    color: 'green',
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'info@jewelinara.com',
    href: 'mailto:info@jewelinara.com',
    color: 'blue',
  },
  {
    icon: MapPin,
    title: 'Location',
    value: 'Sri Lanka',
    href: '#',
    color: 'red',
  },
]

const socialLinks = [
  { icon: Camera, label: 'Instagram', href: 'https://instagram.com/jewel.inara', color: 'pink' },
  { icon: Globe, label: 'Facebook', href: 'https://facebook.com/jewel.inara', color: 'blue' },
]

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await supabase.from('contact_messages').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
      })
      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      console.error('Contact form error:', err)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-softwhite">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-rosegold-50 to-softwhite">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="mt-6 text-xl text-gray-500">
              Have a question? We'd love to hear from you
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="space-y-6"
              >
                <h2 className="text-2xl font-display font-bold text-gray-800 mb-6">
                  Contact Information
                </h2>

                {contactInfo.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-start gap-4 p-4 rounded-xl bg-cream-50 hover:bg-rosegold-50 border border-rosegold-100 transition-colors"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      item.color === 'green' ? 'bg-green-50' :
                      item.color === 'blue' ? 'bg-blue-50' :
                      'bg-red-50'
                    }`}>
                      <item.icon className={`w-6 h-6 ${
                        item.color === 'green' ? 'text-green-500' :
                        item.color === 'blue' ? 'text-blue-500' :
                        'text-red-500'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{item.title}</p>
                      <p className="font-medium text-gray-800">{item.value}</p>
                    </div>
                  </a>
                ))}

                <div className="pt-6">
                  <p className="text-sm font-medium text-gray-800 mb-4">Follow Us</p>
                  <div className="flex items-center gap-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-cream-50 border border-rosegold-200 flex items-center justify-center text-gray-400 hover:bg-rosegold-50 hover:text-rosegold-500 transition-all"
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <form onSubmit={handleSubmit} className="card-rose p-6 md:p-8">
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                      <h3 className="text-xl font-display font-semibold text-gray-800 mb-2">Message Sent!</h3>
                      <p className="text-gray-500 mb-6">We'll get back to you as soon as possible.</p>
                      <button
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="btn-rose"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                  <>
                  <h2 className="text-2xl font-display font-bold text-gray-800 mb-6">
                    Send a Message
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="input-rose"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="input-rose"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="input-rose"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          required
                          className="input-rose"
                        >
                          <option value="">Select a subject</option>
                          <option value="order">Order Inquiry</option>
                          <option value="product">Product Question</option>
                          <option value="shipping">Shipping & Delivery</option>
                          <option value="return">Returns & Exchanges</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        rows={5}
                        className="input-rose resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-rose mt-6 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                  </>
                  )}
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-96 bg-cream-50 relative">
        <iframe
          title="Inara Jewels Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63371.816158573!2d79.837898!3d6.921838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sSri%20Lanka!5e0!3m2!1sen!2s!4v1234567890"
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
        />
      </section>
    </div>
  )
}
