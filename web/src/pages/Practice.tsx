import { useState, type FormEvent } from 'react'
import { Layout } from '../components/Markdown'
import {
  checkAnswer,
  guideFor,
  intentLabel,
  randomPrompt,
  tenseLabel,
  type Prompt,
} from '../lib/practice'
import { recordPractice, resetPractice } from '../lib/progress'
import { useProgress } from '../lib/useProgress'

export function Practice() {
  const progress = useProgress()
  const [prompt, setPrompt] = useState<Prompt>(() => randomPrompt())
  const [value, setValue] = useState('')
  const [result, setResult] = useState<boolean | null>(null)

  function submit(event: FormEvent) {
    event.preventDefault()
    if (result !== null || !value.trim()) return
    const ok = checkAnswer(value, prompt.expected)
    setResult(ok)
    recordPractice(ok)
  }

  function next() {
    setPrompt(randomPrompt(prompt.id))
    setValue('')
    setResult(null)
  }

  const guide = guideFor(prompt)

  return (
    <Layout>
      <p className="kicker">Máquina</p>
      <h1>Treino 3×3</h1>
      <p className="lede">
        Cada cartão pede uma frase completa. O exemplo usa outro verbo. Você mantém sujeito, tempo e
        intenção, e troca o verbo.
      </p>
      <p className="score">
        {progress.practice.correct} certos em {progress.practice.attempted}
      </p>

      <form className="drill" onSubmit={submit}>
        <dl className="facts">
          <div>
            <dt>Sujeito</dt>
            <dd>{prompt.subject}</dd>
          </div>
          <div>
            <dt>Verbo</dt>
            <dd>{prompt.verb}</dd>
          </div>
          <div>
            <dt>Tempo</dt>
            <dd>{tenseLabel(prompt.tense)}</dd>
          </div>
          <div>
            <dt>Intenção</dt>
            <dd>{intentLabel(prompt.intent)}</dd>
          </div>
        </dl>
        <Guide guide={guide} verb={prompt.verb} />
        <label className="field">
          Sua frase, com {prompt.verb}
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            disabled={result !== null}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="done"
            placeholder={`ex.: ${guide.example}`}
          />
        </label>
        {result === null && (
          <button className="button" type="submit" disabled={!value.trim()}>
            Conferir
          </button>
        )}
      </form>

      {result !== null && (
        <div className={result ? 'feedback ok' : 'feedback bad'}>
          {result ? (
            <p>Certo.</p>
          ) : (
            <p>
              A frase esperada era <strong>{prompt.pretty}</strong>
            </p>
          )}
          <button type="button" className="button" onClick={next}>
            Próxima
          </button>
        </div>
      )}

      <button
        type="button"
        className="text-button"
        onClick={() => {
          if (window.confirm('Zerar só o placar do treino?')) {
            resetPractice()
            next()
          }
        }}
      >
        Zerar placar
      </button>
    </Layout>
  )
}

function Guide({
  guide,
  verb,
}: {
  guide: ReturnType<typeof guideFor>
  verb: string
}) {
  return (
    <aside className="guide">
      <p className="guide-label">Frase esperada</p>
      <p>{guide.task} Escreva a frase inteira, não só o verbo.</p>
      <p className="example">{guide.example}</p>
      <p>
        Esse exemplo usa <strong>{guide.modelVerb}</strong>. Faça a mesma frase trocando por{' '}
        <strong>{verb}</strong>.
      </p>
      <p className="mold">{guide.mold}</p>
    </aside>
  )
}
