import { Vector3 } from 'three'
import type { Camera } from 'three'
import type { PresentationAnchorId, ProjectedAnchor } from './types'

const seated = new Vector3(-0.33, 1.05, 0)
const standing = new Vector3(-0.2, 1.55, 0)

export function projectSemanticAnchor(
  id: PresentationAnchorId,
  camera: Camera,
  standingAmount: number,
): ProjectedAnchor | null {
  if (!id) return null
  const point = seated.clone().lerp(standing, standingAmount).project(camera)
  return {
    x: (point.x + 1) / 2,
    y: (1 - point.y) / 2,
    visible: point.z >= -1 && point.z <= 1 && Math.abs(point.x) <= 1 && Math.abs(point.y) <= 1,
  }
}
