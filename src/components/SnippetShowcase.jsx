import ScrollReveal from './ScrollReveal'
import CodeBlock from './CodeBlock'

function esc(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function hl(literals, ...vars) {
  let raw = ''
  literals.forEach((lit, i) => {
    raw += lit + (vars[i] !== undefined ? String(vars[i]) : '')
  })
  const escaped = esc(raw)
  return escaped
    .replace(/(\/\/[^\n]*)/g, '<span class="tk-com">$1</span>')
    .replace(/\b(import|from|export|function|const|let|var|return|if|else|true|false|null|undefined|new|throw|async|await)\b/g, '<span class="tk-key">$1</span>')
    .replace(/\b(useState|useEffect|useTypewriter|useCallback|setTimeout|clearTimeout|setText|setDel|setI|setGIdx|setDeleting)\b/g, '<span class="tk-fn">$1</span>')
    .replace(/'[^']*'/g, '<span class="tk-str">$&</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="tk-num">$1</span>')
    .replace(/=>/g, '<span class="tk-op">=&gt;</span>')
    .replace(/\b(string|number|boolean|void)\b/g, '<span class="tk-key">$1</span>')
    .replace(/([{}()[\];:,])/g, '<span class="tk-op">$1</span>')
}

export default function SnippetShowcase() {
  return (
    <section className="py-24 md:py-32 px-6" id="snippets" style={{ background: 'var(--bg-elev)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 lg:sticky" style={{ top: 120 }}>
            <ScrollReveal>
              <div className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>
                // snippet of the week
              </div>
              <h2 className="font-display font-black text-4xl md:text-5xl mb-6" style={{ letterSpacing: '-0.03em', lineHeight: 1.05 }}>
                <span style={{ fontStyle: 'italic', fontWeight: 400 }}>useTypewriter</span>() — the hook powering this hero.
              </h2>
              <p className="text-base mb-8" style={{ color: 'var(--muted)', lineHeight: 1.65 }}>
                The blinking greeting at the top of this page isn&apos;t a CSS animation — it&apos;s a real React hook. Type, pause, delete, advance. Click <em>copy</em> and paste it into your project.
              </p>
              <ul className="space-y-3 font-mono text-sm mb-8" style={{ color: 'var(--fg-dim)' }}>
                <li className="flex items-center gap-3"><span style={{ color: 'var(--accent)' }}>→</span> zero dependencies</li>
                <li className="flex items-center gap-3"><span style={{ color: 'var(--accent)' }}>→</span> ~30 lines, fully typed</li>
                <li className="flex items-center gap-3"><span style={{ color: 'var(--accent)' }}>→</span> cleanup-safe on unmount</li>
              </ul>
              <div className="flex flex-wrap gap-2">
                <span className="tag">React</span>
                <span className="tag">TypeScript</span>
                <span className="tag">Hooks</span>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-8">
            <ScrollReveal>
              <CodeBlock lang="tsx" filename="useTypewriter.ts" id="snippetCode">
                {hl`// A self-cleaning typewriter hook. No deps, ~30 lines.
import { useState, useEffect } from 'react';

export function useTypewriter(
  words: string[],
  speed = 80,
  pause = 1800,
) {
  const [text, setText] = useState('');
  const [i, setI] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const word = words[i % words.length];
    const delay = del ? speed / 2 : speed;

    const t = setTimeout(() => {
      setText(del
        ? word.slice(0, text.length - 1)
        : word.slice(0, text.length + 1));
    }, delay);

    if (!del && text === word) {
      const p = setTimeout(() => setDel(true), pause);
      return () => { clearTimeout(t); clearTimeout(p); };
    }
    if (del && text === '') {
      setDel(false);
      setI(i + 1);
    }
    return () => clearTimeout(t);
  }, [text, del, i, words, speed, pause]);

  return text;
}`}
              </CodeBlock>
            </ScrollReveal>

            <div className="mt-6">
              <ScrollReveal>
                <CodeBlock lang="tsx" filename="usage.tsx" id="usageCode">
                  {hl`function Hero() {
  const greeting = useTypewriter([
    'hello, traveler.',
    'you found /dev/log.',
    'console.log(love)',
  ]);

  return <h1>{greeting}</h1>;
}`}
                </CodeBlock>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
