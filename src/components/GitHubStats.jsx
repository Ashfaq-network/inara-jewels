import { useState, useEffect, useRef } from 'react'

const REPO = 'tailwindlabs/tailwindcss'

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n.toString()
}

export default function GitHubStats() {
  const [stars, setStars] = useState(null)
  const [forks, setForks] = useState(null)
  const starsEl = useRef(null)
  const rawRef = useRef(0)

  useEffect(() => {
    let cancelled = false
    const fallbackStars = 82400
    const fallbackForks = 4180

    fetch(`https://api.github.com/repos/${REPO}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return
        animateTo(data.stargazers_count || fallbackStars)
        setForks(data.forks_count ?? fallbackForks)
      })
      .catch(() => {
        if (cancelled) return
        animateTo(fallbackStars)
        setForks(fallbackForks)
      })

    return () => { cancelled = true }
  }, [])

  function animateTo(target) {
    const start = rawRef.current || 0
    const duration = 1400
    const startTime = performance.now()
    function frame(now) {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const value = Math.floor(start + (target - start) * eased)
      rawRef.current = value
      setStars(value)
      if (t < 1) requestAnimationFrame(frame)
      else { rawRef.current = target; setStars(target) }
    }
    requestAnimationFrame(frame)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.35) {
        rawRef.current += 1
        setStars(rawRef.current)
        if (starsEl.current) {
          starsEl.current.classList.remove('flash-up')
          void starsEl.current.offsetWidth
          starsEl.current.classList.add('flash-up')
        }
      }
    }, 9000)
    return () => clearInterval(interval)
  }, [])

  return (
    <a
      href={`https://github.com/${REPO}`}
      target="_blank"
      rel="noopener"
      className="stat-pill hidden sm:inline-flex"
      ref={starsEl}
      title="Live from GitHub"
    >
      <span className="stat-dot" />
      <i className="fas fa-star text-xs" style={{ color: 'var(--accent)' }} />
      <span>{stars !== null ? formatNumber(stars) : '—'}</span>
      <span style={{ color: 'var(--muted)' }}>·</span>
      <i className="fas fa-code-branch text-xs" style={{ color: 'var(--accent-2)' }} />
      <span>{forks !== null ? formatNumber(forks) : '—'}</span>
    </a>
  )
}
