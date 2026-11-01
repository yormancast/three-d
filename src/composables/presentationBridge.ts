import type { ScenePresentation } from '@/scene'

export interface PresentationSceneAdapter {
  setPresentation: (presentation: ScenePresentation) => void
}

export function createPresentationBridge(initial: ScenePresentation) {
  let current = initial

  return {
    get current() {
      return current
    },
    request(presentation: ScenePresentation, scene?: PresentationSceneAdapter) {
      scene?.setPresentation(presentation)
      current = presentation
    },
    apply(scene: PresentationSceneAdapter) {
      scene.setPresentation(current)
    },
  }
}
