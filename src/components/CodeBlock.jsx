import { useState, useCallback } from 'react'

export default function CodeBlock({ lang, filename, id, children }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    const text = typeof children === 'string' ? children : ''
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }, [children])

  return (
    <div className="code-window">
      <div className="code-header">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5">
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
          </span>
          <span className="font-mono text-xs" style={{ color: 'var(--muted)' }}>{filename}</span>
        </div>
        <button
          className={`copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          aria-label="Copy code"
        >
          <span className="copy-flash" />
          <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`} />
          <span>{copied ? 'copied' : 'copy'}</span>
        </button>
      </div>
      <pre
        className="p-6 md:p-7 text-xs md:text-sm overflow-x-auto"
        style={{ background: 'var(--code-bg)', margin: 0, lineHeight: 1.7 }}
      >
        <code id={id} dangerouslySetInnerHTML={{ __html: typeof children === 'string' ? children : '' }} />
      </pre>
    </div>
  )
}
