import ScrollReveal from './ScrollReveal'

export default function ArticleCard({ num, tag, date, readTime, title, excerpt }) {
  return (
    <ScrollReveal>
      <article className="article-card">
        <div className="flex items-start justify-between mb-6">
          <div className="card-num">{String(num).padStart(2, '0')}</div>
          <span className="tag">{tag}</span>
        </div>
        <div className="font-mono text-xs mb-4" style={{ color: 'var(--muted)' }}>
          {date} — {readTime} min read
        </div>
        <h3 className="font-display font-bold text-2xl mb-4 leading-tight">
          {title}
        </h3>
        <p className="text-sm mb-8" style={{ color: 'var(--muted)', lineHeight: 1.65 }}>
          {excerpt}
        </p>
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
          <span>read essay</span>
          <span className="arrow">→</span>
        </div>
      </article>
    </ScrollReveal>
  )
}
