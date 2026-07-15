export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="font-mono text-sm" style={{ color: 'var(--muted)' }}>
            &copy; 2024 Alex Rivera · built with care, not frameworks
          </div>
          <div className="flex items-center gap-5">
            <a href="https://github.com" target="_blank" rel="noopener" className="hover-link text-lg" aria-label="GitHub">
              <i className="fab fa-github" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener" className="hover-link text-lg" aria-label="Twitter">
              <i className="fab fa-x-twitter" />
            </a>
            <a href="#" className="hover-link text-lg" aria-label="RSS">
              <i className="fas fa-rss" />
            </a>
            <a href="mailto:hi@devlog.example" className="hover-link text-lg" aria-label="Email">
              <i className="fas fa-envelope" />
            </a>
          </div>
        </div>
        <div className="text-center font-mono text-xs pt-8" style={{ borderTop: '1px solid var(--border)', color: 'var(--muted)' }}>
          <span style={{ color: 'var(--accent)' }}>$</span> echo &quot;thanks for reading&quot; | sudo tee /dev/stdout
        </div>
      </div>
    </footer>
  )
}
