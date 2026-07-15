const ITEMS = ['JavaScript', 'TypeScript', 'Rust', 'Go', 'WebAssembly', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'Linux', 'NeoVim']

export default function Marquee() {
  return (
    <div className="py-5 border-y marquee-wrap" style={{ borderColor: 'var(--border)', background: 'var(--bg-elev)' }}>
      <div className="marquee font-mono text-sm uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
        {[...Array(2)].map((_, group) =>
          ITEMS.map((item, i) => (
            <span key={`${group}-${i}`}>
              {i > 0 && <span> · </span>}
              <span>{item}</span>
            </span>
          ))
        )}
      </div>
    </div>
  )
}
