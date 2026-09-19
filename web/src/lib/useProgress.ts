import { useSyncExternalStore } from 'react'
import { getSnapshot, subscribe } from './progress'

export function useProgress() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
