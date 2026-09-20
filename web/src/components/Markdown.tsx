import type { ReactNode } from 'react'
import { Link } from 'react-router'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function chapterHref(href?: string) {
  if (!href) return null
  const clean = href.replace(/^\.\//, '').split('#')[0]
  const cap = clean.match(/^cap(\d+)\.md$/)
  if (cap) return `/cap/${cap[1]}`
  if (clean === 'frases-essenciais.md') return '/cap/frases'
  if (clean === 'desafio-final.md') return '/cap/desafio'
  return null
}

export function Markdown({ text }: { text: string }) {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            const to = chapterHref(href)
            if (to) return <Link to={to}>{children}</Link>
            if (href?.startsWith('http')) {
              return (
                <a href={href} target="_blank" rel="noreferrer">
                  {children}
                </a>
              )
            }
            return <a href={href}>{children}</a>
          },
          table: ({ children }) => (
            <div className="table-wrap">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="top">
        <div className="top-inner">
          <Link to="/" className="brand">
            Easy English 3×3
          </Link>
          <nav>
            <Link to="/treino">Treino</Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </>
  )
}
