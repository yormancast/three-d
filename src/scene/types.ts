import type { MotionId, PlaybackState } from './motionPlayback'
import type { ViewportProfile } from './viewport'
export type PresentationAnchorId = 'seated' | 'standing' | null
export interface ProjectedAnchor {
  x: number
  y: number
  visible: boolean
}
export interface ScenePresentation {
  cameraId: string
  motionId: MotionId
  anchorId: PresentationAnchorId
}
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
  getViewportProfile: () => ViewportProfile
  onPlayback: (state: PlaybackState) => void
  onStats: (stats: SceneStats) => void
  onAnchor: (anchor: ProjectedAnchor | null) => void
}
