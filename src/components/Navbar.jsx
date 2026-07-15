import ThemeToggle from './ThemeToggle'
import GitHubStats from './GitHubStats'

export default function Navbar() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: 'rgba(var(--accent-rgb), 0.02)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#hero" className="font-mono font-bold text-lg flex items-center" style={{ color: 'var(--fg)', textDecoration: 'none' }}>
          <span style={{ color: 'var(--accent)' }}>/</span>dev
          <span style={{ color: 'var(--muted)' }}>/</span>log
          <span className="logo-cursor" />
        </a>

        <div className="hidden md:flex items-center gap-9 font-mono text-sm">
          <a href="#notes" className="hover-link">notes</a>
          <a href="#snippets" className="hover-link">snippets</a>
          <a href="#archive" className="hover-link">archive</a>
          <a href="#about" className="hover-link">about</a>
        </div>

        <div className="flex items-center gap-3">
          <GitHubStats />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
