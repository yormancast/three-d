import { Mesh } from 'three'
import type { AnimationClip, Interpolant, Object3D } from 'three'
import { MotionPlayback } from './motionPlayback'
import type { ClipId, MotionId } from './motionPlayback'

interface Frame {
  time: number
  position: [number, number, number]
  scale: [number, number, number]
  rotation: [number, number, number]
  standing: number
  shot?: number
}
interface Motion {
  duration: number
  gates: number[]
  motion: Frame[]
}
export type MotionData = Record<ClipId, Motion>
const ids: ClipId[] = ['Recovery', 'Dribble', 'Crossover', 'Standing', 'Rise', 'Pickup', 'Shot']

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isFiniteVector(value: unknown): value is [number, number, number] {
  return Array.isArray(value) && value.length === 3 && value.every((component) => Number.isFinite(component))
}

export function parseMotionData(extras: unknown): MotionData {
  if (!isRecord(extras)) throw new Error('Los datos de movimiento de la escena no tienen un formato válido.')
  if (extras.formatVersion !== 1)
    throw new Error('La versión del formato de movimiento no es compatible (se requiere 1).')
  if (!isRecord(extras.motionData)) throw new Error('Falta el objeto motionData de la escena.')
  const data = extras.motionData
  for (const id of ids) {
    const clip = data[id]
    if (
      !isRecord(clip) ||
      typeof clip.duration !== 'number' ||
      !Number.isFinite(clip.duration) ||
      clip.duration <= 0 ||
      !Array.isArray(clip.gates) ||
      !Array.isArray(clip.motion) ||
      clip.motion.length < 2
    )
      throw new Error(`Falta el movimiento ${id}.`)
    let previousGate = -1
    for (const gate of clip.gates) {
      if (
        typeof gate !== 'number' ||
        !Number.isFinite(gate) ||
        gate < 0 ||
        gate >= clip.duration ||
        gate <= previousGate
      )
        throw new Error(`El movimiento ${id} tiene gates inválidos.`)
      previousGate = gate
    }
    let previous = -1
    for (const value of clip.motion) {
      if (!isRecord(value)) throw new Error(`El movimiento ${id} tiene un frame inválido.`)
      const frame = value
      if (
        typeof frame.time !== 'number' ||
        !Number.isFinite(frame.time) ||
        frame.time <= previous ||
        frame.time > clip.duration ||
        typeof frame.standing !== 'number' ||
        !Number.isFinite(frame.standing) ||
        frame.standing < 0 ||
        frame.standing > 1 ||
        (frame.shot !== undefined &&
          (typeof frame.shot !== 'number' || !Number.isFinite(frame.shot) || frame.shot < 0 || frame.shot > 1)) ||
        !isFiniteVector(frame.position) ||
        !isFiniteVector(frame.scale) ||
        !isFiniteVector(frame.rotation)
      )
        throw new Error(`El movimiento ${id} está incompleto.`)
      previous = frame.time
    }
    if (clip.motion[0]!.time !== 0 || Math.abs(previous - clip.duration) > 1e-5)
      throw new Error(`La duración de ${id} no coincide con el movimiento.`)
  }
  return data as unknown as MotionData
}

function between(motion: Motion, seconds: number) {
  const frames = motion.motion
  let low = 0
  let high = frames.length - 1
  while (low + 1 < high) {
    const mid = (low + high) >> 1
    if (frames[mid]!.time <= seconds) low = mid
    else high = mid
  }
  const a = frames[low]!
  const b = frames[high]!
  return { a, b, t: Math.max(0, Math.min(1, (seconds - a.time) / (b.time - a.time))) }
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export function createContinuousMotion(
  root: Object3D,
  ball: Object3D,
  clips: AnimationClip[],
  data: MotionData,
  initial: MotionId,
) {
  let mesh: Mesh | undefined
  root.traverse((node) => {
    if (node instanceof Mesh && node.morphTargetInfluences) mesh = node
  })
  const weights = mesh?.morphTargetInfluences
  if (!mesh || !weights) throw new Error('No se encontró la animación del personaje.')
  const interpolants = new Map<ClipId, Interpolant>()
  for (const id of ids) {
    const clip = clips.find((clip) => clip.name === id)
    const track = clip?.tracks.find((track) => track.name.endsWith('.morphTargetInfluences'))
    if (!track || track.getValueSize() !== weights.length) throw new Error(`No se encontró la animación ${id}.`)
    // createInterpolant is installed by setInterpolation; its factory is typed by getInterpolation().
    const factory = track.InterpolantFactoryMethodLinear
    interpolants.set(id, factory.call(track, new Float32Array(weights.length)))
  }
  const angleAt = (id: ClipId, time: number) => {
    const { a, b, t } = between(data[id], time)
    return lerp(a.rotation[2], b.rotation[2], t)
  }
  const playback = new MotionPlayback(data, angleAt, initial)
  const frozenWeights = new Float32Array(weights.length)
  function apply() {
    const sample = playback.sample()
    const interpolant = interpolants.get(sample.clip)!
    if (sample.blendFrom) frozenWeights.set(interpolant.evaluate(sample.blendFrom.time))
    const evaluated = interpolant.evaluate(sample.time)
    for (let i = 0; i < weights!.length; i++)
      weights![i] = sample.blendFrom ? lerp(frozenWeights[i]!, evaluated[i]!, sample.blendFrom.amount) : evaluated[i]!
    const { a, b, t } = between(data[sample.clip], sample.time)
    ball.position.set(
      lerp(a.position[0], b.position[0], t),
      lerp(a.position[2], b.position[2], t),
      -lerp(a.position[1], b.position[1], t),
    )
    ball.scale.set(lerp(a.scale[0], b.scale[0], t), lerp(a.scale[2], b.scale[2], t), lerp(a.scale[1], b.scale[1], t))
    ball.rotation.set(0, lerp(a.rotation[2], b.rotation[2], t) + sample.spinOffset, 0)
    // Bounds include every authored pose; disabling culling also avoids stale morph bounds.
    mesh!.frustumCulled = false
    return { standing: lerp(a.standing, b.standing, t), shot: lerp(a.shot ?? 0, b.shot ?? 0, t) }
  }
  return { playback, apply }
}
