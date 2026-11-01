import { describe, expect, it } from 'vitest'
import { MotionPlayback } from './motionPlayback'
import type { ClipId, MotionId, MotionDefinition } from './motionPlayback'
const definitions: Record<ClipId, MotionDefinition> = {
  Recovery: { duration: 8, gates: [0] },
  Dribble: { duration: 2.375, gates: [0] },
  Crossover: { duration: 76 / 24, gates: [0] },
  Standing: { duration: 106 / 24, gates: [0, 0.5, 50 / 24] },
  Shot: { duration: 10.5, gates: [0] },
  Pickup: { duration: 3.5, gates: [] },
  Rise: { duration: 2.5, gates: [] },
}
const angle = (clip: ClipId, time: number) =>
  ['Recovery', 'Pickup', 'Rise'].includes(clip) ? 0 : (time / definitions[clip].duration) * Math.PI * 2
const modes: MotionId[] = ['Recovery', 'Dribble', 'Crossover', 'Standing', 'Shot']

describe('continuous animation routing', () => {
  it('routes every pair from arbitrary phases through authored connectors', () => {
    for (const from of modes)
      for (const to of modes) {
        const player = new MotionPlayback(definitions, angle, from)
        player.seek(definitions[from].duration * 0.37)
        const before = player.sample()
        player.request(to)
        expect(player.sample()).toEqual(before)
        const clips = new Set<ClipId>()
        for (let i = 0; i < 1200; i++) {
          player.advance(1 / 60)
          clips.add(player.sample().clip)
        }
        expect(player.state().active).toBe(to === 'Shot' ? 'Standing' : to)
        if (to === 'Shot') expect(clips.has('Shot')).toBe(true)
        expect(player.state().phase).toBe('loop')
        if (from !== to && (from === 'Recovery' || to === 'Recovery')) expect(clips.has('Pickup')).toBe(true)
        if (['Standing', 'Shot'].includes(from) !== ['Standing', 'Shot'].includes(to))
          expect(clips.has('Rise')).toBe(true)
      }
  })
  it('finishes an airborne shot before following the latest request', () => {
    const player = new MotionPlayback(definitions, angle, 'Shot')
    player.seek(4.2)
    player.request('Recovery')
    player.advance(0.3)
    expect(player.sample().clip).toBe('Shot')
    expect(player.sample().time).toBeCloseTo(4.5)
    player.request('Dribble')
    player.advance(6)
    expect(player.sample().clip).toBe('Rise')
    expect(player.sample().time).toBeCloseTo(2.5)
    player.advance(2.5)
    expect(player.state().active).toBe('Dribble')
  })
  it('returns to standing dribble after exactly one shot', () => {
    const player = new MotionPlayback(definitions, angle, 'Standing')
    player.request('Shot')
    player.advance(0)
    expect(player.sample().clip).toBe('Shot')
    player.advance(10.5)
    expect(player.state().active).toBe('Standing')
    expect(player.state().target).toBe('Standing')
    expect(player.sample().time).toBe(0)
  })
  it('keeps spin continuous when leaving a standing catch before the loop ends', () => {
    const player = new MotionPlayback(definitions, angle, 'Standing')
    player.seek(0.49)
    player.request('Recovery')
    player.advance(0.01)
    const sample = player.sample()
    expect(sample.clip).toBe('Rise')
    expect(sample.time).toBeCloseTo(2.5)
    expect(sample.spinOffset + angle(sample.clip, sample.time)).toBeCloseTo(angle('Standing', 0.5))
  })
  it('finishes the current connector and follows the latest request without resetting its pose', () => {
    const player = new MotionPlayback(definitions, angle, 'Dribble')
    player.request('Standing')
    player.advance(0.7)
    const before = player.sample()
    player.request('Recovery')
    expect(player.sample()).toEqual(before)
    player.advance(0.2)
    expect(player.sample().time).toBeGreaterThan(before.time)
    player.request('Crossover')
    player.advance(10)
    expect(player.state().active).toBe('Crossover')
  })
  it('blocks timeline jumps during a connector and allows canceling a queued change', () => {
    const player = new MotionPlayback(definitions, angle, 'Dribble')
    player.seek(0.4)
    player.request('Standing')
    player.request('Dribble')
    player.advance(0.1)
    expect(player.state().phase).toBe('loop')
    player.seek(0)
    player.request('Standing')
    player.advance(0.2)
    const before = player.sample()
    player.seek(2)
    expect(player.sample()).toEqual(before)
  })
})
