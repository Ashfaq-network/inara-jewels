import { useState, useEffect, useRef } from 'react'
import ScrollReveal from './ScrollReveal'

const GREETINGS = [
  "hello, traveler.",
  "you found /dev/log.",
  "i write bugs so you don't have to.",
  "console.log('welcome back.');",
  "0x72656164657220313a20666f756e642e",
]

export default function HeroBlog() {
  const [text, setText] = useState('')
  const [gIdx, setGIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const glowRef = useRef(null)
  const heroRef = useRef(null)

  useEffect(() => {
    const current = GREETINGS[gIdx]
    if (deleting) {
      if (text.length === 0) {
        setDeleting(false)
        setGIdx(g => (g + 1) % GREETINGS.length)
        return
      }
      const t = setTimeout(() => setText(text.slice(0, -1)), 35)
      return () => clearTimeout(t)
    }
    if (text.length < current.length) {
      const speed = 75 + Math.random() * 50
      const t = setTimeout(() => setText(current.slice(0, text.length + 1)), speed)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setDeleting(true), 2200)
    return () => clearTimeout(t)
  }, [text, deleting, gIdx])

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    function onMove(e) {
      const rect = hero.getBoundingClientRect()
      if (glowRef.current) {
        glowRef.current.style.left = (e.clientX - rect.left) + 'px'
        glowRef.current.style.top = (e.clientY - rect.top) + 'px'
        glowRef.current.style.opacity = '1'
      }
    }
    function onLeave() { if (glowRef.current) glowRef.current.style.opacity = '0' }
    hero.addEventListener('mousemove', onMove)
    hero.addEventListener('mouseleave', onLeave)
    return () => { hero.removeEventListener('mousemove', onMove); hero.removeEventListener('mouseleave', onLeave) }
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-grid pt-24 pb-20"
      id="hero"
    >
      <div className="float-dot" style={{ width: '500px', height: '500px', top: '5%', left: '-150px', background: 'var(--accent)' }} />
      <div className="float-dot" style={{ width: '600px', height: '600px', bottom: '-200px', right: '-200px', background: 'var(--accent-2)', animationDelay: '-5s' }} />
      <div className="mouse-glow" ref={glowRef} />

      <div className="relative max-w-7xl mx-auto px-6 w-full" style={{ zIndex: 2 }}>
        <div className="max-w-5xl">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-8 font-mono text-xs flex-wrap" style={{ color: 'var(--muted)' }}>
              <span className="tag">Issue 042</span>
              <span>·</span>
              <span>November 12, 2024</span>
              <span>·</span>
              <span className="flex items-center gap-2">
                <span className="stat-dot" /> currently publishing
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <h1 className="font-mono font-bold mb-8" style={{ fontSize: 'clamp(2.5rem, 7.5vw, 6.5rem)', lineHeight: 1.02, letterSpacing: '-0.045em' }}>
              <span style={{ color: 'var(--muted)' }}>$</span>{' '}
              <span className="typewriter-cursor">{text}</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal>
            <p
              className="font-display text-2xl md:text-3xl mb-5"
              style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--fg)', lineHeight: 1.3 }}
            >
              Notes from a programmer&apos;s desk — on code, systems, and the strange joy of debugging at 2am.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <p className="text-base md:text-lg mb-12 max-w-2xl" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>
              I&apos;m <span style={{ color: 'var(--fg)', fontWeight: 500 }}>Alex Rivera</span> — software engineer writing about the craft. TypeScript today, Rust tomorrow, assembly for fun. New essay every other Tuesday.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="flex flex-wrap gap-4 mb-20">
              <a href="#notes" className="btn-primary">
                read latest
                <i className="fas fa-arrow-right text-xs" />
              </a>
              <a href="#about" className="btn-secondary">
                <i className="fas fa-rss text-xs" />
                subscribe
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl">
              <div>
                <div className="font-mono font-bold text-3xl md:text-4xl" style={{ color: 'var(--accent)' }}>142</div>
                <div className="font-mono text-xs uppercase tracking-widest mt-2" style={{ color: 'var(--muted)' }}>essays published</div>
              </div>
              <div>
                <div className="font-mono font-bold text-3xl md:text-4xl" style={{ color: 'var(--accent)' }}>8.2k</div>
                <div className="font-mono text-xs uppercase tracking-widest mt-2" style={{ color: 'var(--muted)' }}>regular readers</div>
              </div>
              <div>
                <div className="font-mono font-bold text-3xl md:text-4xl" style={{ color: 'var(--accent)' }}>2d</div>
                <div className="font-mono text-xs uppercase tracking-widest mt-2" style={{ color: 'var(--muted)' }}>since last commit</div>
              </div>
              <div>
                <div className="font-mono font-bold text-3xl md:text-4xl" style={{ color: 'var(--accent)' }}>∞</div>
                <div className="font-mono text-xs uppercase tracking-widest mt-2" style={{ color: 'var(--muted)' }}>cups of coffee</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs flex flex-col items-center gap-3" style={{ color: 'var(--muted)' }}>
        <span className="tracking-widest uppercase">scroll</span>
        <div style={{ width: '1px', height: '30px', background: 'linear-gradient(to bottom, var(--accent), transparent)' }} />
      </div>
    </section>
  )
}
