import { describe, expect, it } from 'vitest'
import { toWorld, verticalFov } from './camera'
describe('Blender camera parity', () => {
  it('keeps floor horizontal and height vertical after glTF export', () => {
    expect(toWorld([2.25, -6.2, 1.65])).toEqual([2.25, 1.65, 6.2])
  })
  it('preserves horizontal field of view across desktop aspect ratios', () => {
    const radians = (verticalFov(38, 1.6) * Math.PI) / 180
    const horizontal = 2 * Math.atan(Math.tan(radians / 2) * 1.6)
    expect(horizontal).toBeCloseTo(2 * Math.atan(36 / 76), 10)
  })
  it('matches Blender vertical sensor fit on portrait screens', () => {
    expect(verticalFov(48, 390 / 844)).toBeCloseTo(41.112, 2)
  })
})
