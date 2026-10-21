import type { CameraPreset, AtmospherePreset } from '@/scene/types'

export const cameras: Record<string, CameraPreset> = {
  Shot: { position: [5, -9, 5.6], target: [-2.6, 3.5, 1.3], lens: 32 },
  Shot_mobile: { position: [5, -9, 5.6], target: [-2.6, 3.5, 1.3], lens: 28 },
  Inicio: {
    position: [2.25, -6.2, 1.65],
    target: [0, 0.5, 1.15],
    lens: 38,
  },
  Bio: {
    position: [0.65, -3.35, 1.48],
    target: [0.3, 0, 0.95],
    lens: 49,
  },
  Projects: {
    position: [-1.45, -3.15, 1.18],
    target: [0.45, -0.1, 0.65],
    lens: 45,
  },
  Experience: {
    position: [3.4, -4.3, 1.0],
    target: [0.48, 0.1, 0.8],
    lens: 50,
  },
  Contact: {
    position: [0.65, -2.45, 0.78],
    target: [0.24, 0.02, 1.0],
    lens: 45,
  },
  Pose_front: {
    position: [0, -4, 1.1],
    target: [0, 0, 0.79],
    lens: 48,
  },
  Pose_side: {
    position: [4, -0.02, 1.03],
    target: [0, -0.03, 0.8],
    lens: 48,
  },
  Pose_three_quarter: {
    position: [2.6, -3.6, 1.6],
    target: [0, -0.04, 0.82],
    lens: 52,
  },
  Overview: {
    position: [18, -22, 20],
    target: [0, 7, 1],
    lens: 38,
  },
  Inicio_mobile: {
    position: [1.25, -4.2, 1.5],
    target: [0, 0, 0.5],
    lens: 48,
  },
  Bio_mobile: {
    position: [0.45, -3.2, 1.35],
    target: [0, 0, 0.6],
    lens: 55,
  },
  Projects_mobile: {
    position: [-1.3, -3.4, 1.2],
    target: [0, -0.1, 0.55],
    lens: 51,
  },
  Experience_mobile: {
    position: [2.7, -3.4, 1.1],
    target: [-0.28, -0.13, 0.48],
    lens: 52,
  },
  Contact_mobile: {
    position: [0.45, -3.5, 0.5],
    target: [0, 0, 0.8],
    lens: 46,
  },
}

export const views = [
  { id: 'Inicio', label: 'Inicio' },
  { id: 'Bio', label: 'Bio' },
  { id: 'Projects', label: 'Proyectos' },
  { id: 'Experience', label: 'Experiencia' },
  { id: 'Contact', label: 'Contacto' },
]

export const atmosphere: Record<string, AtmospherePreset> = {
  Inicio: { focusPoint: [0, -0.28, 0.75], aperture: 0.00035, maxBlur: 0.0035, fogDensity: 0.022, bloom: 0.18 },
  Bio: { focusPoint: [0, -0.35, 1.06], aperture: 0.0007, maxBlur: 0.006, fogDensity: 0.026, bloom: 0.16 },
  Projects: { focusPoint: [0, -0.4, 0.56], aperture: 0.0005, maxBlur: 0.005, fogDensity: 0.025, bloom: 0.16 },
  Experience: { focusPoint: [0, -0.25, 0.75], aperture: 0.0004, maxBlur: 0.004, fogDensity: 0.024, bloom: 0.18 },
  Contact: { focusPoint: [0, -0.35, 1.03], aperture: 0.00065, maxBlur: 0.006, fogDensity: 0.028, bloom: 0.16 },
}
export const characterLight = {
  position: [-1.4, -2.7, 3] as const,
  target: [0, -0.25, 0.7] as const,
  intensity: 24,
  ambientIntensity: 1.5,
  shadowOpacity: 0.42,
}
export const toonBands = [0.18, 0.45, 0.78, 1] as const

export const animations = [
  { id: 'Recovery', label: 'Descanso', description: 'Mirada al frente · Respiración suave' },
  { id: 'Dribble', label: 'Dribble', description: 'Cinco botes · Mano derecha' },
  { id: 'Crossover', label: 'Crossover', description: 'Cambio de manos · Sentado en la banca' },
  { id: 'Standing', label: 'De pie', description: 'Dribble · Crossover · Entre las piernas' },
  { id: 'Shot', label: 'Lanzamiento', description: 'Tiro al aro · Regreso al dribble' },
] as const
