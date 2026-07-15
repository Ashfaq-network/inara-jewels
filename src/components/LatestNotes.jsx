import ScrollReveal from './ScrollReveal'
import ArticleCard from './ArticleCard'

const ARTICLES = [
  {
    num: 1, tag: 'JavaScript', date: '11.12.24', readTime: 8,
    title: 'On the Quiet Violence of Implicit Conversions',
    excerpt: 'JavaScript will let you add [] to {} and thank you for it. A field guide to footguns.',
  },
  {
    num: 2, tag: 'Compilers', date: '10.28.24', readTime: 14,
    title: 'A Lexer, By Hand, On a Sunday Afternoon',
    excerpt: 'Skip the regex. Skip the generator. Two hundred lines of switch statements and you\'ll understand something new about every language you\'ve ever used.',
  },
  {
    num: 3, tag: 'Error Handling', date: '10.14.24', readTime: 6,
    title: 'Why I Removed Every Try/Catch From My Codebase',
    excerpt: 'Result types, error channels, and the curious peace of letting things crash loudly in development.',
  },
]

export default function LatestNotes() {
  return (
    <section className="py-24 md:py-32 px-6" id="notes">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <ScrollReveal>
            <div>
              <div className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>
                // recent notes
              </div>
              <h2 className="font-display font-black text-5xl md:text-7xl" style={{ letterSpacing: '-0.035em', lineHeight: 1 }}>
                Latest <span style={{ fontStyle: 'italic', fontWeight: 400 }}>writing</span>
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <a href="#archive" className="btn-secondary">
              all posts
              <i className="fas fa-arrow-right text-xs" />
            </a>
          </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {ARTICLES.map(a => (
            <ArticleCard key={a.num} {...a} />
          ))}
        </div>
      </div>
    </section>
  )
}
