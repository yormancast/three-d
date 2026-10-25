import { describe, expect, it, vi } from 'vitest'
import { createSectionHashNavigation } from './sectionHash'
import type { SectionHashAdapter } from './sectionHash'
import type { SectionId } from '@/content/sections'

function createAdapter(initialHash: string) {
  let hash = initialHash
  const listeners = new Set<() => void>()
  const writes: Array<{ id: SectionId; mode: 'push' | 'replace' }> = []
  const adapter: SectionHashAdapter = {
    read: () => hash,
    write(id, mode) {
      hash = `#${id}`
      writes.push({ id, mode })
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }

  return {
    adapter,
    writes,
    changeHash(value: string) {
      hash = value
      listeners.forEach((listener) => listener())
    },
  }
}

describe('createSectionHashNavigation', () => {
  it('initializes from a direct section link without changing its history entry', () => {
    const { adapter, writes } = createAdapter('#experience')
    const navigation = createSectionHashNavigation(adapter, vi.fn())

    expect(navigation.current).toBe('experience')
    expect(writes).toEqual([])
  })

  it('normalizes empty and unknown hashes to Home with replace semantics', () => {
    const empty = createAdapter('')
    const emptyNavigation = createSectionHashNavigation(empty.adapter, vi.fn())
    const unknown = createAdapter('#not-a-section')
    const unknownNavigation = createSectionHashNavigation(unknown.adapter, vi.fn())

    expect(emptyNavigation.current).toBe('home')
    expect(unknownNavigation.current).toBe('home')
    expect(empty.writes).toEqual([{ id: 'home', mode: 'replace' }])
    expect(unknown.writes).toEqual([{ id: 'home', mode: 'replace' }])
  })

  it('pushes new selections, follows back and forward changes, and ignores duplicate events', () => {
    const { adapter, writes, changeHash } = createAdapter('#home')
    const onChange = vi.fn()
    const navigation = createSectionHashNavigation(adapter, onChange)

    navigation.navigate('bio')
    expect(writes).toEqual([{ id: 'bio', mode: 'push' }])
    navigation.navigate('bio')
    expect(writes).toHaveLength(1)

    changeHash('#home')
    changeHash('#home')
    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith('home')

    changeHash('#projects')
    expect(onChange).toHaveBeenLastCalledWith('projects')
    expect(navigation.current).toBe('projects')
  })

  it('normalizes an invalid hash reached from history and stops listening when disposed', () => {
    const { adapter, writes, changeHash } = createAdapter('#home')
    const onChange = vi.fn()
    const navigation = createSectionHashNavigation(adapter, onChange)

    changeHash('#unknown')
    expect(writes).toEqual([{ id: 'home', mode: 'replace' }])
    expect(onChange).not.toHaveBeenCalled()

    navigation.dispose()
    changeHash('#contact')
    expect(onChange).not.toHaveBeenCalled()
  })
})
