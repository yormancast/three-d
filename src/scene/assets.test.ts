import { BufferGeometry, Group, Mesh, MeshBasicMaterial, Texture } from 'three'
import { describe, expect, it, vi } from 'vitest'
import { releaseSceneAsset } from './assets'

describe('releaseSceneAsset', () => {
  it('releases shared geometry, materials, and textures once across roots and repeated calls', () => {
    const geometry = new BufferGeometry()
    const texture = new Texture()
    const material = new MeshBasicMaterial({ map: texture })
    const geometryDispose = vi.spyOn(geometry, 'dispose')
    const textureDispose = vi.spyOn(texture, 'dispose')
    const materialDispose = vi.spyOn(material, 'dispose')
    const firstRoot = new Group()
    firstRoot.add(new Mesh(geometry, material), new Mesh(geometry, material))
    const secondRoot = new Group()
    secondRoot.add(new Mesh(geometry, material))

    releaseSceneAsset(firstRoot)
    releaseSceneAsset(secondRoot)
    releaseSceneAsset(firstRoot)

    expect(geometryDispose).toHaveBeenCalledTimes(1)
    expect(materialDispose).toHaveBeenCalledTimes(1)
    expect(textureDispose).toHaveBeenCalledTimes(1)
  })

  it('releases owned materials that are no longer attached to the scene tree', () => {
    const texture = new Texture()
    const material = new MeshBasicMaterial({ map: texture })
    const textureDispose = vi.spyOn(texture, 'dispose')
    const materialDispose = vi.spyOn(material, 'dispose')

    releaseSceneAsset(new Group(), [material])

    expect(materialDispose).toHaveBeenCalledTimes(1)
    expect(textureDispose).toHaveBeenCalledTimes(1)
  })
})
