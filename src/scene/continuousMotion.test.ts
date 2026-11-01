import { describe, expect, it } from 'vitest'
import { parseMotionData } from './continuousMotion'

function createExtras() {
  const clips = Object.fromEntries(
    ['Recovery', 'Dribble', 'Crossover', 'Standing', 'Rise', 'Pickup', 'Shot'].map((id) => [
      id,
      {
        duration: 1,
        gates: [0],
        motion: [
          { time: 0, position: [0, 0, 0], scale: [1, 1, 1], rotation: [0, 0, 0], standing: 0, shot: 0 },
          { time: 1, position: [0, 0, 0], scale: [1, 1, 1], rotation: [0, 0, 0], standing: 1, shot: 0 },
        ],
      },
    ]),
  )
  return { formatVersion: 1, motionData: clips }
}

describe('parseMotionData', () => {
  it('accepts the complete motion format, a zero gate, and empty gate lists', () => {
    const extras = createExtras()
    extras.motionData.Recovery!.gates = []
    expect(parseMotionData(extras).Recovery.gates).toEqual([])
  })

  it.each([undefined, null, [], {}])('rejects invalid scene extras: %s', (extras) => {
    expect(() => parseMotionData(extras)).toThrow(/movimiento|motionData/i)
  })

  it.each([undefined, 0, 2, '1'])('rejects unsupported format versions: %s', (formatVersion) => {
    expect(() => parseMotionData({ ...createExtras(), formatVersion })).toThrow(/versión/i)
  })

  it.each([{ gates: [Number.NaN] }, { gates: [-0.1] }, { gates: [1] }, { gates: [0.5, 0.5] }, { gates: [0.75, 0.5] }])(
    'rejects invalid gates: $gates',
    ({ gates }) => {
      const extras = createExtras()
      extras.motionData.Standing!.gates = gates
      expect(() => parseMotionData(extras)).toThrow(/Standing.*gates inválidos/)
    },
  )

  it('rejects a non-finite duration and out-of-range standing or shot values', () => {
    const durationExtras = createExtras()
    durationExtras.motionData.Recovery!.duration = Number.POSITIVE_INFINITY
    expect(() => parseMotionData(durationExtras)).toThrow(/Recovery/)

    const standingExtras = createExtras()
    standingExtras.motionData.Recovery!.motion[0]!.standing = 1.1
    expect(() => parseMotionData(standingExtras)).toThrow(/Recovery está incompleto/)

    const shotExtras = createExtras()
    shotExtras.motionData.Shot!.motion[0]!.shot = -0.1
    expect(() => parseMotionData(shotExtras)).toThrow(/Shot está incompleto/)
  })

  it('rejects malformed vectors, repeated frame times, and frames beyond duration', () => {
    const vectorExtras = createExtras()
    vectorExtras.motionData.Dribble!.motion[0]!.position = [0, Number.NaN, 0]
    expect(() => parseMotionData(vectorExtras)).toThrow(/Dribble está incompleto/)

    const timeExtras = createExtras()
    timeExtras.motionData.Crossover!.motion[1]!.time = 0
    expect(() => parseMotionData(timeExtras)).toThrow(/Crossover está incompleto/)

    const boundsExtras = createExtras()
    boundsExtras.motionData.Shot!.motion[1]!.time = 1.01
    expect(() => parseMotionData(boundsExtras)).toThrow(/Shot está incompleto/)
  })
})
