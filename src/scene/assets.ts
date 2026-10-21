import { Mesh, Texture } from 'three'
import type { AnimationClip, Material, Object3D } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'
import { parseMotionData } from './continuousMotion'
import type { MotionData } from './continuousMotion'

const clipIds = ['Recovery', 'Dribble', 'Crossover', 'Standing', 'Rise', 'Pickup', 'Shot'] as const
const releasedGeometries = new WeakSet<Mesh['geometry']>()
const releasedMaterials = new WeakSet<Material>()
const releasedTextures = new WeakSet<Texture>()

export interface SceneAssets {
  gltf: GLTF
  character: Object3D
  environment: Object3D
  emissives: Object3D
  ball: Object3D
  clips: AnimationClip[]
  motionData: MotionData
  morphTargetCount: number
}

export function releaseSceneAsset(root: Object3D, extraMaterials: Iterable<Material> = []) {
  const geometries = new Set<Mesh['geometry']>()
  const materials = new Set<Material>()
  const textures = new Set<Texture>()
  root.traverse((node) => {
    if (!(node instanceof Mesh)) return
    if (!releasedGeometries.has(node.geometry)) geometries.add(node.geometry)
    for (const material of Array.isArray(node.material) ? node.material : [node.material]) materials.add(material)
  })
  for (const material of extraMaterials) materials.add(material)
  for (const material of materials) {
    if (releasedMaterials.has(material)) continue
    for (const value of Object.values(material))
      if (value instanceof Texture && !releasedTextures.has(value)) textures.add(value)
  }
  for (const geometry of geometries) {
    releasedGeometries.add(geometry)
    geometry.dispose()
  }
  for (const material of materials) {
    if (releasedMaterials.has(material)) continue
    releasedMaterials.add(material)
    material.dispose()
  }
  for (const texture of textures) {
    releasedTextures.add(texture)
    texture.dispose()
  }
}

function requiredNode(scene: Object3D, name: string) {
  const node = scene.getObjectByName(name)
  if (!node) throw new Error(`Falta un componente de la escena: ${name}.`)
  return node
}

export function validateSceneAssets(gltf: GLTF): SceneAssets {
  const scene = gltf.scene
  const character = requiredNode(scene, 'ElDirto_Character')
  const environment = requiredNode(scene, 'ElDirto_Environment')
  const emissives = requiredNode(scene, 'ElDirto_Emissives')
  const ball = requiredNode(scene, 'Ball')
  let morphTargetCount = 0
  character.traverse((node) => {
    if (node instanceof Mesh && node.morphTargetInfluences && node.morphTargetInfluences.length > morphTargetCount)
      morphTargetCount = node.morphTargetInfluences.length
  })
  if (morphTargetCount === 0) throw new Error('No se encontró una malla animada dentro de ElDirto_Character.')

  const data = parseMotionData(scene.userData)
  const clipsByName = new Map<string, AnimationClip>()
  for (const clip of gltf.animations) {
    if (clipsByName.has(clip.name)) throw new Error(`El recurso contiene clips duplicados: ${clip.name}.`)
    clipsByName.set(clip.name, clip)
  }
  for (const id of clipIds) {
    const clip = clipsByName.get(id)
    if (!clip) throw new Error(`Falta el clip de animación ${id}.`)
    if (!Number.isFinite(clip.duration) || Math.abs(clip.duration - data[id].duration) > 1e-5)
      throw new Error(`La duración del clip ${id} no coincide con motionData.`)
    const tracks = new Map(clip.tracks.map((track) => [track.name, track]))
    const morphTrack = clip.tracks.find((track) => track.name.endsWith('.morphTargetInfluences'))
    if (!morphTrack || morphTrack.getValueSize() !== morphTargetCount)
      throw new Error(`El clip ${id} no tiene una pista de morph weights compatible con el personaje.`)
    for (const property of ['position', 'quaternion', 'scale']) {
      if (!tracks.has(`Ball.${property}`)) throw new Error(`El clip ${id} no tiene la pista Ball.${property}.`)
    }
  }
  return { gltf, character, environment, emissives, ball, clips: gltf.animations, motionData: data, morphTargetCount }
}

export async function loadSceneAssets(url: string): Promise<SceneAssets> {
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
  let gltf: GLTF
  try {
    gltf = await loader.loadAsync(url)
  } catch (error) {
    throw new Error('No se pudo cargar el recurso 3D. Comprueba que está disponible y vuelve a intentarlo.', {
      cause: error,
    })
  }
  try {
    return validateSceneAssets(gltf)
  } catch (error) {
    releaseSceneAsset(gltf.scene)
    const detail = error instanceof Error ? error.message : 'El archivo no cumple el contrato de la escena.'
    throw new Error(`No se pudo validar el recurso 3D: ${detail}`, { cause: error })
  }
}
