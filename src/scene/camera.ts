import type { Point3 } from './types'
/** Blender's Z-up export becomes glTF Y-up. */
export function toWorld([x, y, z]: Point3): [number, number, number] {
  return [x, z, -y]
}
/** Blender AUTO sensor fit uses 36 mm horizontally in landscape and vertically in portrait. */
export function verticalFov(lens: number, aspect: number): number {
  return (2 * Math.atan(36 / (2 * lens * Math.max(1, aspect))) * 180) / Math.PI
}
