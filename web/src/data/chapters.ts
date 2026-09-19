import { splitChapter, type ChapterParts } from '../lib/splitChapter'

const files = import.meta.glob('../../../apostila/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const catalog = [
  ['1', 'cap1', 'Como pensar em inglês'],
  ['2', 'cap2', 'O segredo dos auxiliares'],
  ['3', 'cap3', 'Present Simple'],
  ['4', 'cap4', 'Past Simple'],
  ['5', 'cap5', 'Future'],
  ['6', 'cap6', 'To be'],
  ['7', 'cap7', 'Can, could e modais'],
  ['8', 'cap8', 'Have'],
  ['9', 'cap9', 'Os 60 verbos mais importantes'],
  ['10', 'cap10', 'Transformação de frases'],
  ['11', 'cap11', 'Português → inglês'],
  ['12', 'cap12', 'Inglês → português'],
  ['13', 'cap13', 'Erros comuns de brasileiros'],
  ['14', 'cap14', 'Contrações e inglês real'],
  ['15', 'cap15', 'Respostas curtas'],
  ['16', 'cap16', 'WH questions'],
  ['17', 'cap17', 'Treino de automatização'],
  ['18', 'cap18', 'Speaking drills'],
  ['19', 'cap19', 'Frases do dia a dia'],
  ['20', 'cap20', 'Resumo visual'],
  ['frases', 'frases-essenciais', '100 frases essenciais'],
  ['desafio', 'desafio-final', 'Desafio final'],
] as const

export type Chapter = {
  id: string
  slug: string
  title: string
  label: string
  parts: ChapterParts
}

function readFile(slug: string) {
  const entry = Object.entries(files).find(([path]) => path.endsWith(`/${slug}.md`))
  if (!entry) throw new Error(`Arquivo da apostila não encontrado: ${slug}.md`)
  return entry[1]
}

export const chapters: Chapter[] = catalog.map(([id, slug, title]) => ({
  id,
  slug,
  title,
  label: /^\d+$/.test(id) ? id : 'Extra',
  parts: splitChapter(readFile(slug)),
}))

export function getChapter(id: string) {
  return chapters.find((chapter) => chapter.id === id)
}
