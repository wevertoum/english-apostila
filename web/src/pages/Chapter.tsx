import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { getChapter } from '../data/chapters'
import { Layout, Markdown } from '../components/Markdown'
import { markRead, openChapter, toggleExercise } from '../lib/progress'
import { useProgress } from '../lib/useProgress'
import type { ExerciseSegment } from '../lib/splitChapter'

export function ChapterPage() {
  const { id } = useParams()
  const chapter = id ? getChapter(id) : undefined
  const progress = useProgress()

  useEffect(() => {
    if (!chapter) {
      document.title = 'Easy English 3×3'
      return
    }
    document.title = `${chapter.title} — Easy English 3×3`
    openChapter(chapter.id)
  }, [chapter])

  if (!chapter) {
    return (
      <Layout>
        <h1>Capítulo não encontrado</h1>
        <Link to="/">Voltar</Link>
      </Layout>
    )
  }

  const state = progress.chapters[chapter.id]
  const made = state?.exercisesDone.length ?? 0
  const total = chapter.parts.exerciseCount

  return (
    <Layout>
      <p className="kicker">
        <Link to="/">Índice</Link>
        {chapter.label === 'Extra' ? ' · Extra' : ` · Capítulo ${chapter.label}`}
      </p>
      <h1>{chapter.title}</h1>
      {total > 0 && (
        <p className="muted">
          {made} de {total} exercícios marcados como feitos.
        </p>
      )}

      {chapter.parts.segments.map((segment, index) =>
        segment.kind === 'md' ? (
          <Markdown key={`md-${index}`} text={segment.text} />
        ) : (
          <ExerciseCard
            key={`ex-${segment.id}`}
            chapterId={chapter.id}
            total={total}
            exercise={segment}
            done={state?.exercisesDone.includes(segment.id) ?? false}
          />
        ),
      )}

      {chapter.parts.looseAnswer && (
        <Reveal
          label={total > 0 ? 'Conferir outras respostas' : 'Conferir gabarito'}
          text={chapter.parts.looseAnswer}
        />
      )}

      {total === 0 && (
        <button
          type="button"
          className="button"
          onClick={() => markRead(chapter.id)}
          disabled={state?.read}
        >
          {state?.read ? 'Marcado como lido' : 'Marcar como lido'}
        </button>
      )}

      {chapter.parts.tail && <Markdown text={chapter.parts.tail} />}
    </Layout>
  )
}

function ExerciseCard({
  chapterId,
  total,
  exercise,
  done,
}: {
  chapterId: string
  total: number
  exercise: ExerciseSegment
  done: boolean
}) {
  return (
    <section className="exercise" id={`ex-${exercise.id}`}>
      <h2>{exercise.title}</h2>
      {exercise.prompt && <Markdown text={exercise.prompt} />}
      {exercise.answer && <Reveal label="Conferir gabarito" text={exercise.answer} />}
      <label className="check">
        <input
          type="checkbox"
          checked={done}
          onChange={() => toggleExercise(chapterId, exercise.id, total)}
        />
        Feito
      </label>
    </section>
  )
}

function Reveal({ label, text }: { label: string; text: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="reveal">
      <button type="button" className="button ghost" onClick={() => setOpen((value) => !value)}>
        {open ? 'Esconder gabarito' : label}
      </button>
      {open && (
        <div className="answer">
          <Markdown text={text} />
        </div>
      )}
    </div>
  )
}
