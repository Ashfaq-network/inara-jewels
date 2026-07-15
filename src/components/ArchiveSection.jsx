import ScrollReveal from './ScrollReveal'

const ARCHIVE = [
  { date: '09.30.24', title: 'The Hidden Cost of Abstraction', excerpt: 'Every layer you add is a layer you\'ll debug. A meditation on when to stop.', tag: 'Architecture', readTime: 11 },
  { date: '09.18.24', title: 'Plain Text Will Outlive Us All', excerpt: 'On choosing formats that your grandchildren\'s operating system can still open.', tag: 'Tools', readTime: 5 },
  { date: '09.02.24', title: 'Garbage Collection, But Make It Personal', excerpt: 'What tracing collectors can teach you about letting go of side projects.', tag: 'Memory', readTime: 9 },
  { date: '08.21.24', title: 'A Letter to Junior Me About Imposter Syndrome', excerpt: 'Eight things I wish someone had told me in my first year of writing code for money.', tag: 'Career', readTime: 7 },
  { date: '08.07.24', title: 'I Wrote a Database in 200 Lines of Go', excerpt: 'A WAL, an LSM-tree, and a HTTP API. Surprised how far you can get on a Saturday.', tag: 'Systems', readTime: 16 },
  { date: '07.24.24', title: 'Stop Using useEffect for Everything', excerpt: 'Most effects are an admission that your state model is wrong. A re-education.', tag: 'React', readTime: 6 },
]

export default function ArchiveSection() {
  return (
    <section className="py-24 md:py-32 px-6" id="archive">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <ScrollReveal>
            <div className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>
              // the archive
            </div>
            <h2 className="font-display font-black text-5xl md:text-7xl" style={{ letterSpacing: '-0.035em', lineHeight: 1 }}>
              Older <span style={{ fontStyle: 'italic', fontWeight: 400 }}>posts</span>
            </h2>
            <p className="text-base mt-6 max-w-xl" style={{ color: 'var(--muted)' }}>
              142 essays on programming, written over four years. Filtered here by recency — the full index lives in the JSON.
            </p>
          </ScrollReveal>
        </div>

        <div>
          {ARCHIVE.map((item, i) => (
            <ScrollReveal key={i}>
              <a href="#" className="archive-item">
                <div className="font-mono text-xs w-24 flex-shrink-0" style={{ color: 'var(--muted)' }}>{item.date}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-xl md:text-2xl archive-title mb-1" style={{ fontWeight: 700 }}>
                    {item.title}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--muted)' }}>{item.excerpt}</div>
                </div>
                <span className="tag hidden md:inline-block">{item.tag}</span>
                <div className="font-mono text-xs w-16 text-right flex-shrink-0" style={{ color: 'var(--muted)' }}>{item.readTime} min</div>
              </a>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <ScrollReveal>
            <a href="#" className="btn-secondary">
              browse all 142 essays
              <i className="fas fa-arrow-right text-xs" />
            </a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
