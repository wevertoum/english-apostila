import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { chapters } from '../data/chapters'
import { Layout } from '../components/Markdown'
import { chapterStatus, isChapterDone, resetProgress } from '../lib/progress'
import { useProgress } from '../lib/useProgress'

type InstallPrompt = Event & { prompt: () => Promise<void> }

export function Home() {
  const progress = useProgress()
  const [install, setInstall] = useState<InstallPrompt | null>(null)
  const done = chapters.filter((chapter) =>
    isChapterDone(progress, chapter.id, chapter.parts.exerciseCount),
  ).length
  const percent = Math.round((done / chapters.length) * 100)
  const last = chapters.find((chapter) => chapter.id === progress.lastChapterId)
  const next =
    (last && !isChapterDone(progress, last.id, last.parts.exerciseCount) ? last : null) ??
    chapters.find((chapter) => !isChapterDone(progress, chapter.id, chapter.parts.exerciseCount)) ??
    chapters[0]

  useEffect(() => {
    document.title = 'Apostila de inglês'
    const onPrompt = (event: Event) => {
      event.preventDefault()
      setInstall(event as InstallPrompt)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  return (
    <Layout>
      <p className="kicker">Afirmar → negar → perguntar</p>
      <h1>Apostila de inglês</h1>
      <p className="lede">
        A frase se monta por intenção e tempo. O auxiliar carrega a informação. O verbo principal, quase
        sempre, fica na forma base.
      </p>

      <section className="panel">
        <div className="panel-head">
          <h2>Progresso</h2>
          <span>
            {done} de {chapters.length}
          </span>
        </div>
        <div className="bar" aria-hidden="true">
          <span style={{ width: `${percent}%` }} />
        </div>
        <p className="muted">
          Treino 3×3: {progress.practice.correct} certos em {progress.practice.attempted}. O progresso
          fica neste aparelho.
        </p>
        <div className="actions">
          <Link className="button" to={`/cap/${next.id}`}>
            {progress.lastChapterId ? 'Continuar' : 'Começar'}
          </Link>
          <Link className="button ghost" to="/treino">
            Treino
          </Link>
          {install && (
            <button type="button" className="button ghost" onClick={() => void install.prompt()}>
              Instalar
            </button>
          )}
        </div>
      </section>

      <section>
        <h2>Mapa 3×3</h2>
        <p className="muted">Verbo-modelo: need. Quando entra o auxiliar, need não muda.</p>
        <div className="table-wrap">
          <table className="map">
            <thead>
              <tr>
                <th />
                <th>Presente</th>
                <th>Passado</th>
                <th>Futuro</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Afirmar</th>
                <td>I need.</td>
                <td>I needed.</td>
                <td>I will need.</td>
              </tr>
              <tr>
                <th>Negar</th>
                <td>I don't need.</td>
                <td>I didn't need.</td>
                <td>I won't need.</td>
              </tr>
              <tr>
                <th>Perguntar</th>
                <td>Do you need?</td>
                <td>Did you need?</td>
                <td>Will you need?</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Capítulos</h2>
        <ol className="toc">
          {chapters.map((chapter) => {
            const status = chapterStatus(progress, chapter.id, chapter.parts.exerciseCount)
            const made = progress.chapters[chapter.id]?.exercisesDone.length ?? 0
            return (
              <li key={chapter.id}>
                <Link to={`/cap/${chapter.id}`}>
                  <span className="num">{chapter.label}</span>
                  <span className="toc-title">{chapter.title}</span>
                  <span className={`pill ${status}`}>
                    {status === 'done' ? 'feito' : status === 'doing' ? 'no meio' : 'novo'}
                    {chapter.parts.exerciseCount > 0 ? ` · ${made}/${chapter.parts.exerciseCount}` : ''}
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
      </section>

      <p className="hint">
        No celular, use Adicionar à tela inicial para abrir como app. Depois da primeira visita, o
        material abre offline.
      </p>
      <button
        type="button"
        className="text-button"
        onClick={() => {
          if (window.confirm('Apagar o progresso neste aparelho?')) resetProgress()
        }}
      >
        Zerar progresso
      </button>
    </Layout>
  )
}
