export type Subject = 'I' | 'you' | 'he' | 'she' | 'we' | 'they'
export type Intent = 'afirmar' | 'negar' | 'perguntar'
export type Tense = 'presente' | 'passado' | 'futuro'

export type Prompt = {
  id: string
  subject: Subject
  verb: string
  past: string
  intent: Intent
  tense: Tense
  expected: string
  pretty: string
}

const verbs: { base: string; past: string }[] = [
  { base: 'need', past: 'needed' },
  { base: 'want', past: 'wanted' },
  { base: 'work', past: 'worked' },
  { base: 'call', past: 'called' },
  { base: 'like', past: 'liked' },
  { base: 'start', past: 'started' },
  { base: 'use', past: 'used' },
  { base: 'help', past: 'helped' },
  { base: 'open', past: 'opened' },
  { base: 'ask', past: 'asked' },
]

const subjects: Subject[] = ['I', 'you', 'he', 'she', 'we', 'they']
const intents: Intent[] = ['afirmar', 'negar', 'perguntar']
const tenses: Tense[] = ['presente', 'passado', 'futuro']

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function thirdPerson(subject: Subject) {
  return subject === 'he' || subject === 'she'
}

export function normalizeAnswer(input: string): string {
  let text = input.trim().toLowerCase().replace(/[“”]/g, '"').replace(/[‘’]/g, "'")
  text = text.replace(/[.?!;,:]+/g, ' ')
  const swaps: [RegExp, string][] = [
    [/\bi'll\b/g, 'i will'],
    [/\byou'll\b/g, 'you will'],
    [/\bshe'll\b/g, 'she will'],
    [/\bhe'll\b/g, 'he will'],
    [/\bwe'll\b/g, 'we will'],
    [/\bthey'll\b/g, 'they will'],
    [/\bwon't\b/g, 'will not'],
    [/\bdon't\b/g, 'do not'],
    [/\bdoesn't\b/g, 'does not'],
    [/\bdidn't\b/g, 'did not'],
  ]
  for (const [pattern, to] of swaps) text = text.replace(pattern, to)
  return text.replace(/\s+/g, ' ').trim()
}

function build(subject: Subject, verb: string, past: string, intent: Intent, tense: Tense) {
  const who = subject === 'I' ? 'I' : subject[0].toUpperCase() + subject.slice(1)
  const low = subject.toLowerCase()
  const base = verb
  let pretty = ''
  let expected = ''

  if (tense === 'presente' && intent === 'afirmar') {
    const form = thirdPerson(subject) ? `${base}s` : base
    pretty = `${who} ${form}.`
    expected = `${low} ${form}`
  } else if (tense === 'presente' && intent === 'negar') {
    const aux = thirdPerson(subject) ? "doesn't" : "don't"
    pretty = `${who} ${aux} ${base}.`
    expected = `${low} ${thirdPerson(subject) ? 'does not' : 'do not'} ${base}`
  } else if (tense === 'presente' && intent === 'perguntar') {
    const aux = thirdPerson(subject) ? 'Does' : 'Do'
    pretty = `${aux} ${low} ${base}?`
    expected = `${aux.toLowerCase()} ${low} ${base}`
  } else if (tense === 'passado' && intent === 'afirmar') {
    pretty = `${who} ${past}.`
    expected = `${low} ${past}`
  } else if (tense === 'passado' && intent === 'negar') {
    pretty = `${who} didn't ${base}.`
    expected = `${low} did not ${base}`
  } else if (tense === 'passado' && intent === 'perguntar') {
    pretty = `Did ${low} ${base}?`
    expected = `did ${low} ${base}`
  } else if (tense === 'futuro' && intent === 'afirmar') {
    pretty = `${who} will ${base}.`
    expected = `${low} will ${base}`
  } else if (tense === 'futuro' && intent === 'negar') {
    pretty = `${who} won't ${base}.`
    expected = `${low} will not ${base}`
  } else {
    pretty = `Will ${low} ${base}?`
    expected = `will ${low} ${base}`
  }

  return { pretty, expected }
}

export function randomPrompt(avoidId?: string): Prompt {
  let prompt: Prompt | null = null
  for (let i = 0; i < 8; i++) {
    const verb = pick(verbs)
    const subject = pick(subjects)
    const intent = pick(intents)
    const tense = pick(tenses)
    const forms = build(subject, verb.base, verb.past, intent, tense)
    const id = `${subject}|${verb.base}|${tense}|${intent}`
    prompt = { id, subject, verb: verb.base, past: verb.past, intent, tense, ...forms }
    if (id !== avoidId) break
  }
  return prompt!
}

export function checkAnswer(input: string, expected: string) {
  return normalizeAnswer(input) === expected
}

export type DrillGuide = {
  task: string
  mold: string
  example: string
  modelVerb: string
}

export function guideFor(prompt: Prompt): DrillGuide {
  const modelVerb = prompt.verb === 'need' ? 'work' : 'need'
  const modelPast = prompt.verb === 'need' ? 'worked' : 'needed'
  const example = build(prompt.subject, modelVerb, modelPast, prompt.intent, prompt.tense).pretty
  const who = prompt.subject === 'I' ? 'I' : prompt.subject[0].toUpperCase() + prompt.subject.slice(1)
  const third = thirdPerson(prompt.subject)

  let mold = ''
  if (prompt.tense === 'presente' && prompt.intent === 'afirmar') {
    mold = third ? `${who} + verbo com -s. Sem auxiliar.` : `${who} + verbo. Sem auxiliar e sem -s.`
  } else if (prompt.tense === 'presente' && prompt.intent === 'negar') {
    mold = third
      ? `${who} + doesn't + verbo na base. O -s sai.`
      : `${who} + don't + verbo na base.`
  } else if (prompt.tense === 'presente' && prompt.intent === 'perguntar') {
    mold = third ? `Does ${who.toLowerCase()} + verbo na base?` : `Do ${who.toLowerCase()} + verbo na base?`
  } else if (prompt.tense === 'passado' && prompt.intent === 'afirmar') {
    mold = `${who} + passado do verbo. Sem did.`
  } else if (prompt.tense === 'passado' && prompt.intent === 'negar') {
    mold = `${who} + didn't + verbo na base. O passado fica só no didn't.`
  } else if (prompt.tense === 'passado' && prompt.intent === 'perguntar') {
    mold = `Did ${who.toLowerCase()} + verbo na base?`
  } else if (prompt.tense === 'futuro' && prompt.intent === 'afirmar') {
    mold =
      prompt.subject === 'I'
        ? `${who} + will + verbo na base. I'll também vale.`
        : `${who} + will + verbo na base.`
  } else if (prompt.tense === 'futuro' && prompt.intent === 'negar') {
    mold = `${who} + won't + verbo na base.`
  } else {
    mold = `Will ${who.toLowerCase()} + verbo na base?`
  }

  const action =
    prompt.intent === 'afirmar' ? 'Afirme' : prompt.intent === 'negar' ? 'Negue' : 'Faça a pergunta'
  const task = `${action} no ${prompt.tense}. Sujeito ${who}. Verbo ${prompt.verb}.`

  return { task, mold, example, modelVerb }
}

export function intentLabel(intent: Intent) {
  if (intent === 'afirmar') return 'Afirmar'
  if (intent === 'negar') return 'Negar'
  return 'Perguntar'
}

export function tenseLabel(tense: Tense) {
  if (tense === 'presente') return 'Presente'
  if (tense === 'passado') return 'Passado'
  return 'Futuro'
}
