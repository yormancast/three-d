export { portfolio } from './portfolio'
export { sections, sectionById, sectionIds } from './sections'
export type { PortfolioSection, SectionId, SectionPresentation } from './sections'
export { cameras, atmosphere, characterLight, toonBands } from './scenePresets'
export type { CameraPresetId } from './scenePresets'
export { layoutBreakpoint, compactLandscapeHeight } from './layout'

export const views = [
  { id: 'Inicio', label: 'Inicio' },
  { id: 'Bio', label: 'Bio' },
  { id: 'Projects', label: 'Proyectos' },
  { id: 'Experience', label: 'Experiencia' },
  { id: 'Contact', label: 'Contacto' },
]

export const animations = [
  { id: 'Recovery', label: 'Descanso', description: 'Mirada al frente · Respiración suave' },
  { id: 'Dribble', label: 'Dribble', description: 'Cinco botes · Mano derecha' },
  { id: 'Crossover', label: 'Crossover', description: 'Cambio de manos · Sentado en la banca' },
  { id: 'Standing', label: 'De pie', description: 'Dribble · Crossover · Entre las piernas' },
  { id: 'Shot', label: 'Lanzamiento', description: 'Tiro al aro · Regreso al dribble' },
] as const
