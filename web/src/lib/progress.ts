const KEY = 'apostila-progress'

export type ChapterProgress = {
  started: boolean
  read: boolean
  exercisesDone: string[]
}

export type Progress = {
  lastChapterId: string | null
  chapters: Record<string, ChapterProgress>
  practice: { correct: number; attempted: number }
}

function empty(): Progress {
  return { lastChapterId: null, chapters: {}, practice: { correct: 0, attempted: 0 } }
}

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty()
    const parsed = JSON.parse(raw) as Partial<Progress>
    return {
      lastChapterId: parsed.lastChapterId ?? null,
      chapters: parsed.chapters ?? {},
      practice: {
        correct: parsed.practice?.correct ?? 0,
        attempted: parsed.practice?.attempted ?? 0,
      },
    }
  } catch {
    return empty()
  }
}

let snapshot: Progress = typeof localStorage === 'undefined' ? empty() : load()
const listeners = new Set<() => void>()

function commit(next: Progress) {
  snapshot = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* private mode or full storage — keep the session copy */
  }
  for (const listener of listeners) listener()
}

export function getSnapshot(): Progress {
  return snapshot
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function chapterOf(id: string): ChapterProgress {
  return snapshot.chapters[id] ?? { started: false, read: false, exercisesDone: [] }
}

export function openChapter(id: string) {
  const prev = chapterOf(id)
  if (snapshot.lastChapterId === id && prev.started) return
  commit({
    ...snapshot,
    lastChapterId: id,
    chapters: { ...snapshot.chapters, [id]: { ...prev, started: true } },
  })
}

export function toggleExercise(chapterId: string, exerciseId: string, total: number) {
  const prev = chapterOf(chapterId)
  const has = prev.exercisesDone.includes(exerciseId)
  const exercisesDone = has
    ? prev.exercisesDone.filter((id) => id !== exerciseId)
    : [...prev.exercisesDone, exerciseId]
  commit({
    ...snapshot,
    lastChapterId: chapterId,
    chapters: {
      ...snapshot.chapters,
      [chapterId]: {
        started: true,
        exercisesDone,
        read: total > 0 && exercisesDone.length >= total,
      },
    },
  })
}

export function markRead(id: string) {
  const prev = chapterOf(id)
  commit({
    ...snapshot,
    lastChapterId: id,
    chapters: {
      ...snapshot.chapters,
      [id]: { ...prev, started: true, read: true },
    },
  })
}

export function recordPractice(correct: boolean) {
  commit({
    ...snapshot,
    practice: {
      correct: snapshot.practice.correct + (correct ? 1 : 0),
      attempted: snapshot.practice.attempted + 1,
    },
  })
}

export function resetPractice() {
  commit({ ...snapshot, practice: { correct: 0, attempted: 0 } })
}

export function resetProgress() {
  commit(empty())
}

export function isChapterDone(progress: Progress, id: string, exerciseCount: number) {
  const chapter = progress.chapters[id]
  if (!chapter) return false
  if (exerciseCount === 0) return chapter.read
  return chapter.exercisesDone.length >= exerciseCount
}

export function chapterStatus(
  progress: Progress,
  id: string,
  exerciseCount: number,
): 'done' | 'doing' | 'new' {
  if (isChapterDone(progress, id, exerciseCount)) return 'done'
  const chapter = progress.chapters[id]
  if (chapter?.started || (chapter?.exercisesDone.length ?? 0) > 0) return 'doing'
  return 'new'
}
