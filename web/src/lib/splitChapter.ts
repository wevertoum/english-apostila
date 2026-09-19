export type ExerciseSegment = {
  kind: 'exercise'
  id: string
  title: string
  prompt: string
  answer: string | null
}

export type Segment = { kind: 'md'; text: string } | ExerciseSegment

export type ChapterParts = {
  segments: Segment[]
  looseAnswer: string | null
  tail: string
  exerciseCount: number
}

const exerciseRe = /^(#{2,3}) Exercício\s+([0-9]+|[A-Z])\b\s*[—–-]?\s*(.*)$/

type Block = { id: string | null; heading: string | null; body: string }

function parseBlocks(lines: string[]): Block[] {
  const blocks: Block[] = []
  let id: string | null = null
  let heading: string | null = null
  let buf: string[] = []
  let started = false

  const flush = () => {
    if (!started) return
    blocks.push({ id, heading, body: buf.join('\n').trim() })
    buf = []
  }

  for (const line of lines) {
    const h = line.match(/^###\s+(.+?)\s*$/)
    if (h) {
      flush()
      started = true
      heading = h[1]
      const m = heading.match(/^Exercício\s+([0-9]+|[A-Z])\b/)
      id = m ? m[1] : null
      continue
    }
    if (!started) started = true
    buf.push(line)
  }
  flush()
  return blocks.filter((b) => b.body || b.heading)
}

function walk(lines: string[]): Segment[] {
  const segments: Segment[] = []
  let md: string[] = []
  let ex: { id: string; title: string; lines: string[] } | null = null

  const flushMd = () => {
    const text = md.join('\n').trim()
    if (text) segments.push({ kind: 'md', text })
    md = []
  }

  const flushEx = () => {
    if (!ex) return
    const title = ex.title ? `Exercício ${ex.id} — ${ex.title}` : `Exercício ${ex.id}`
    segments.push({
      kind: 'exercise',
      id: ex.id,
      title,
      prompt: ex.lines.join('\n').trim(),
      answer: null,
    })
    ex = null
  }

  for (const line of lines) {
    const m = line.match(exerciseRe)
    if (m) {
      flushMd()
      flushEx()
      ex = { id: m[2], title: m[3].trim(), lines: [] }
      continue
    }
    if (ex && /^## /.test(line)) {
      flushEx()
      md.push(line)
      continue
    }
    if (ex) ex.lines.push(line)
    else md.push(line)
  }
  flushEx()
  flushMd()
  return segments
}

function formatLoose(blocks: Block[]): string | null {
  const text = blocks
    .map((b) => [b.heading ? `### ${b.heading}` : '', b.body].filter(Boolean).join('\n\n'))
    .filter(Boolean)
    .join('\n\n')
    .trim()
  return text || null
}

export function splitChapter(markdown: string): ChapterParts {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const gabStart = lines.findIndex((l) => /^## Gabarito\s*$/.test(l))
  let gabEnd = lines.length
  if (gabStart >= 0) {
    const next = lines.findIndex((l, i) => i > gabStart && /^## /.test(l))
    gabEnd = next < 0 ? lines.length : next
  }

  const before = gabStart < 0 ? lines : lines.slice(0, gabStart)
  const gabLines = gabStart < 0 ? [] : lines.slice(gabStart + 1, gabEnd)
  const tail = gabStart < 0 ? '' : lines.slice(gabEnd).join('\n').trim()

  const segments = walk(before)
  const blocks = parseBlocks(gabLines)
  const byId = new Map<string, Block>()
  const loose: Block[] = []

  for (const block of blocks) {
    if (block.id && !byId.has(block.id)) byId.set(block.id, block)
    else loose.push(block)
  }

  for (const seg of segments) {
    if (seg.kind !== 'exercise') continue
    const block = byId.get(seg.id)
    if (!block) continue
    seg.answer = block.body.trim() || null
    byId.delete(seg.id)
  }

  for (const block of byId.values()) loose.push(block)

  if (segments[0]?.kind === 'md') {
    segments[0] = { kind: 'md', text: segments[0].text.replace(/^# .+\n+/, '').trim() }
  }

  const cleaned = segments.filter((s) => s.kind === 'exercise' || s.text.trim())
  const exerciseCount = cleaned.filter((s) => s.kind === 'exercise').length

  return {
    segments: cleaned,
    looseAnswer: formatLoose(loose),
    tail,
    exerciseCount,
  }
}
