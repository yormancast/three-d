import { QuaternionKeyframeTrack, VectorKeyframeTrack } from 'three'
import type { KeyframeTrack } from 'three'
import { toWorld } from './camera'
import type { Point3 } from './types'

interface BallFrame {
  time: number
  position: Point3
  rotation: Point3
  scale: Point3
}

function isPoint(value: unknown): value is Point3 {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    value.every((entry) => typeof entry === 'number' && Number.isFinite(entry))
  )
}

export function parseBallMotion(value: unknown): BallFrame[] {
  if (!Array.isArray(value) || value.length < 2) throw new Error('Trayectoria del balón incompleta.')
  let previous = -1
  return value.map((entry: unknown) => {
    if (typeof entry !== 'object' || entry === null) throw new Error('Fotograma del balón inválido.')
    const frame = entry as Record<string, unknown>
    if (
      typeof frame.time !== 'number' ||
      !Number.isFinite(frame.time) ||
      frame.time <= previous ||
      !isPoint(frame.position) ||
      !isPoint(frame.rotation) ||
      !isPoint(frame.scale)
    )
      throw new Error('Fotograma del balón inválido.')
    previous = frame.time
    return { time: frame.time, position: frame.position, rotation: frame.rotation, scale: frame.scale }
  })
}

export function ballTracks(frames: readonly BallFrame[]): KeyframeTrack[] {
  const times = frames.map((frame) => frame.time)
  return [
    new VectorKeyframeTrack(
      'Ball.position',
      times,
      frames.flatMap((frame) => toWorld(frame.position)),
    ),
    new VectorKeyframeTrack(
      'Ball.scale',
      times,
      frames.flatMap((frame) => [frame.scale[0], frame.scale[2], frame.scale[1]]),
    ),
    new QuaternionKeyframeTrack(
      'Ball.quaternion',
      times,
      frames.flatMap((frame) => {
        // Spin around native vertical Z (web Y), keeping squash vertical at impact.
        const half = frame.rotation[2] / 2
        return [0, Math.sin(half), 0, Math.cos(half)]
      }),
    ),
  ]
}

export function restingBallTracks(duration: number): KeyframeTrack[] {
  return ballTracks(
    [0, duration].map((time) => ({
      time,
      position: [-1.02, -0.48, 0.12],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    })),
  )
}
