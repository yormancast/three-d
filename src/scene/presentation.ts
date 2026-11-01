import type { MotionId } from './motionPlayback'
import type { ScenePresentation } from './types'

const motionIds = new Set<string>(['Recovery', 'Dribble', 'Crossover', 'Standing', 'Shot'] satisfies MotionId[])
const anchorIds = new Set(['seated', 'standing', null])

export function validateScenePresentation(
  value: unknown,
  cameraIds: ReadonlySet<string>,
  atmosphereIds: ReadonlySet<string>,
): value is ScenePresentation {
  if (typeof value !== 'object' || value === null) return false
  if (!('cameraId' in value) || typeof value.cameraId !== 'string') return false
  if (!('motionId' in value) || typeof value.motionId !== 'string') return false
  if (!('anchorId' in value) || (typeof value.anchorId !== 'string' && value.anchorId !== null)) return false

  return (
    cameraIds.has(value.cameraId) &&
    atmosphereIds.has(value.cameraId) &&
    motionIds.has(value.motionId) &&
    anchorIds.has(value.anchorId)
  )
}

export function createPresentationIntent(
  initial: ScenePresentation,
  cameraIds: ReadonlySet<string>,
  atmosphereIds: ReadonlySet<string>,
) {
  let current = initial

  return {
    get current() {
      return current
    },
    request(value: unknown) {
      if (!validateScenePresentation(value, cameraIds, atmosphereIds)) return false
      current = value
      return true
    },
  }
}
