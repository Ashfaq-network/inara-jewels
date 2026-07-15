import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Check, Sparkles } from 'lucide-react'
import { supabase } from '@lib/supabase'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    setStatus('loading')
    setErrorMsg('')

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email })

    if (error) {
      if (error.code === '23505') {
        setStatus('duplicate')
      } else {
        setErrorMsg('Something went wrong. Please try again.')
        setStatus('error')
      }
      return
    }

    setStatus('success')
    setEmail('')
  }

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-rosegold-50 via-rosegold-100 to-cream-50" />

      <div className="absolute top-0 left-1/4 w-64 h-64 bg-rosegold-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-rosegold-200/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cream-50/30 rounded-full blur-3xl" />

      <div className="relative container-custom">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-rosegold-200 text-rosegold-600 text-xs font-medium tracking-wide uppercase mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Newsletter
            </div>

            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Stay in the Loop
            </h2>

            <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">
              Subscribe for exclusive offers, new arrivals, and styling tips
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="w-7 h-7 text-emerald-600" />
                </div>
                <p className="text-gray-700 font-medium text-lg">
                  You&apos;re all set! Welcome to the Inara family.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="text-rosegold-500 text-sm font-medium hover:underline mt-1"
                >
                  Subscribe another email
                </button>
              </motion.div>
            ) : status === 'duplicate' ? (
              <motion.div
                key="duplicate"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-14 h-14 rounded-full bg-rosegold-100 flex items-center justify-center">
                  <Check className="w-7 h-7 text-rosegold-600" />
                </div>
                <p className="text-gray-700 font-medium text-lg">
                  You&apos;re already subscribed!
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="text-rosegold-500 text-sm font-medium hover:underline mt-1"
                >
                  Use a different email
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-5 py-3.5 rounded-2xl bg-white border border-rosegold-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rosegold-400 focus:border-transparent transition-all duration-300 text-sm"
                />
                <motion.button
                  type="submit"
                  disabled={status === 'loading'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-7 py-3.5 rounded-2xl bg-white border-2 border-rosegold-400 text-rosegold-600 font-semibold text-sm shadow-md hover:bg-rosegold-50 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 min-w-[140px]"
                >
                  {status === 'loading' ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Subscribe
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          {status === 'error' && errorMsg && (
            <p className="text-red-400 text-sm mt-3">{errorMsg}</p>
          )}
        </div>
      </div>
    </section>
  )
}
