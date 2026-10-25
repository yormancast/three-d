import { sectionIds } from '@/content/sections'
import type { SectionId } from '@/content/sections'

export interface SectionHashAdapter {
  read: () => string
  write: (id: SectionId, mode: 'push' | 'replace') => void
  subscribe: (listener: () => void) => () => void
}

export function resolveSectionHash(hash: string): SectionId {
  const value = hash.startsWith('#') ? hash.slice(1) : hash
  return sectionIds.find((id) => id === value) ?? 'home'
}

export function createSectionHashNavigation(adapter: SectionHashAdapter, onChange: (id: SectionId) => void) {
  const initialHash = adapter.read()
  let current = resolveSectionHash(initialHash)
  if (initialHash !== `#${current}`) adapter.write(current, 'replace')

  const unsubscribe = adapter.subscribe(() => {
    const hash = adapter.read()
    const next = resolveSectionHash(hash)
    if (hash !== `#${next}`) adapter.write(next, 'replace')
    if (next === current) return
    current = next
    onChange(next)
  })

  return {
    get current() {
      return current
    },
    navigate(id: SectionId) {
      if (id === current) return
      current = id
      adapter.write(id, 'push')
    },
    dispose: unsubscribe,
  }
}
