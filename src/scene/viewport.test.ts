import { describe, expect, it } from 'vitest'
import { getViewportProfile } from './viewport'

describe('getViewportProfile', () => {
  it.each([
    [699, 558, false, true, false, true],
    [700, 558, false, true, false, true],
    [799, 558, false, true, false, true],
    [800, 558, false, false, false, false],
    [390, 844, true, true, true, true],
    [844, 390, true, true, false, true],
    [390, 480, true, true, true, true],
    [1280, 480, false, false, false, false],
    [1280, 720, false, false, false, false],
  ])('classifies %ix%i with coarsePointer=%s', (width, height, coarsePointer, compactLayout, portrait, lowPower) => {
    expect(getViewportProfile(width, height, coarsePointer, 800, 480)).toEqual({
      compactLayout,
      portrait,
      lowPower,
    })
  })

  it('selects portrait framing independently of the compact layout flag', () => {
    expect(getViewportProfile(1000, 1200, false, 800, 480)).toEqual({
      compactLayout: false,
      portrait: true,
      lowPower: false,
    })
  })
})
