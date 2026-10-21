import { Mesh, MeshBasicMaterial, MeshStandardMaterial, type MeshToonMaterial, type ShadowMaterial } from 'three'
import type { Material } from 'three'
import type { Object3D } from 'three'
import type { SceneAssets } from './assets'
import type { SceneConfig } from './types'

export function adaptSceneMaterials(
  assets: SceneAssets,
  config: Pick<SceneConfig, 'colors' | 'light'>,
  toon: MeshToonMaterial,
  shadowMaterial: ShadowMaterial,
  retiredMaterials: Set<Material>,
) {
  const components = [
    { kind: 'environment', root: assets.environment },
    { kind: 'character', root: assets.character },
    { kind: 'emissives', root: assets.emissives },
  ] as const

  for (const { kind, root } of components) {
    const receivers: Mesh[] = []
    root.traverse((node) => {
      if (!(node instanceof Mesh)) return
      if (kind === 'character') {
        for (const material of Array.isArray(node.material) ? node.material : [node.material])
          retiredMaterials.add(material)
        node.material = toon
        node.castShadow = true
        node.receiveShadow = true
      } else if (kind === 'environment' && ['P2_Ground', 'P2_Props'].includes(node.name)) {
        const receiver = new Mesh(node.geometry, shadowMaterial)
        receiver.position.copy(node.position)
        receiver.quaternion.copy(node.quaternion)
        receiver.scale.copy(node.scale)
        receiver.receiveShadow = true
        receiver.name = `${node.name}_DynamicShadow`
        receivers.push(receiver)
      } else if (kind === 'emissives') {
        const materials = Array.isArray(node.material) ? node.material : [node.material]
        for (const material of materials) {
          if (!(material instanceof MeshStandardMaterial) && !(material instanceof MeshBasicMaterial)) continue
          if (!(material instanceof MeshStandardMaterial)) continue
          if (material.name.includes('neon')) {
            material.emissive.set(config.colors.lime)
            material.emissiveIntensity = 3.2
          }
          if (material.name.includes('violet')) {
            material.emissive.set(config.colors.cool)
            material.emissiveIntensity = 2
          }
          if (material.name.includes('window')) {
            material.emissive.set(config.colors.warm)
            material.emissiveIntensity = 0.55
          }
        }
      }
    })
    for (const receiver of receivers) root.add(receiver)
  }
}

export function enableBallShadows(ball: Object3D) {
  ball.traverse((node) => {
    if (node instanceof Mesh) node.castShadow = true
  })
}
