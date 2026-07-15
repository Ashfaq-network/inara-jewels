import { useState, useEffect } from 'react'

const THEMES = ['dark', 'light', 'cyber']
const ICONS = { dark: 'fa-moon', light: 'fa-sun', cyber: 'fa-terminal' }

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try { const s = localStorage.getItem('devlog-theme'); return s && THEMES.includes(s) ? s : 'dark' }
    catch { return 'dark' }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('devlog-theme', theme) } catch {}
  }, [theme])

  const handleSet = (t) => {
    document.body.classList.add('theme-anim')
    setTimeout(() => document.body.classList.remove('theme-anim'), 700)
    setTheme(t)
  }

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 't' || e.key === 'T') {
        const idx = THEMES.indexOf(theme)
        handleSet(THEMES[(idx + 1) % THEMES.length])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [theme])

  return (
    <div className="theme-toggle" role="group" aria-label="Theme selector">
      {THEMES.map(t => (
        <button
          key={t}
          className={`theme-btn ${theme === t ? 'active' : ''}`}
          data-theme={t}
          onClick={() => handleSet(t)}
          title={t}
          aria-label={`${t} theme`}
        >
          <i className={`fas ${ICONS[t]}`} />
        </button>
      ))}
    </div>
  )
}
