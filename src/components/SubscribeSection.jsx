import { useState } from 'react'
import ScrollReveal from './ScrollReveal'

export default function SubscribeSection() {
  const [email, setEmail] = useState('')
  const [toast, setToast] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return
    setToast(true)
    setEmail('')
    setTimeout(() => setToast(false), 4000)
  }

  return (
    <section className="py-24 md:py-32 px-6" id="about" style={{ background: 'var(--bg-elev)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <ScrollReveal>
            <div className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>
              // stay in the loop
            </div>
            <h2 className="font-display font-black text-5xl md:text-6xl mb-6" style={{ letterSpacing: '-0.035em', lineHeight: 1 }}>
              Every other <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Tuesday.</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>
              One essay. No tracking, no ads, no <em>&quot;10x&quot;</em> anything. Unsubscribe with a single click — I won&apos;t even be offended.
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="you@somewhere.dev"
              required
              className="input-field flex-1"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button type="submit" className="btn-primary justify-center">
              subscribe
              <i className="fas fa-arrow-right text-xs" />
            </button>
          </form>
        </ScrollReveal>

        <div
          className="font-mono text-sm mt-6 text-center transition-opacity duration-500"
          style={{ color: 'var(--accent)', opacity: toast ? 1 : 0 }}
        >
          ✓ welcome aboard. confirmation pending in your inbox.
        </div>

        <div className="mt-16 grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="text-center">
              <div className="font-mono font-bold text-2xl mb-2" style={{ color: 'var(--accent)' }}>No spam</div>
              <div className="text-sm" style={{ color: 'var(--muted)' }}>One email every two weeks. That&apos;s it.</div>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="text-center">
              <div className="font-mono font-bold text-2xl mb-2" style={{ color: 'var(--accent)' }}>No tracking</div>
              <div className="text-sm" style={{ color: 'var(--muted)' }}>Self-hosted on a $5 box. No analytics.</div>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="text-center">
              <div className="font-mono font-bold text-2xl mb-2" style={{ color: 'var(--accent)' }}>No paywall</div>
              <div className="text-sm" style={{ color: 'var(--muted)' }}>Free forever. Or until I run out of coffee.</div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
