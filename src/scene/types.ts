import type { MotionId, PlaybackState } from './motionPlayback'
export type Point3 = readonly [number, number, number]
export interface CameraPreset {
  position: Point3
  target: Point3
  lens: number
}
export interface AtmospherePreset {
  focusPoint: Point3
  aperture: number
  maxBlur: number
  fogDensity: number
  bloom: number
}
export interface SceneStats {
  triangles: number
  drawCalls: number
  submissionMs: number
  quality: 'desktop' | 'mobile'
}
export interface SceneConfig {
  modelUrl: string
  initialAnimation: MotionId
  colors: { background: string; warm: string; cool: string; ground: string; lime: string; shadow: string; fog: string }
  cameras: Record<string, CameraPreset>
  atmosphere: Record<string, AtmospherePreset>
  light: { position: Point3; target: Point3; intensity: number; ambientIntensity: number; shadowOpacity: number }
  toonBands: readonly number[]
  onProgress: (completed: number, total: number) => void
  onPlayback: (state: PlaybackState) => void
  onStats: (stats: SceneStats) => void
}
