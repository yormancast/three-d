import { afterEach, describe, expect, it, vi } from 'vitest'
import { PerspectiveCamera, Scene, WebGLRenderTarget } from 'three'
import type { WebGLRenderer } from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { TexturePass } from 'three/addons/postprocessing/TexturePass.js'
import { BokehShader } from 'three/addons/shaders/BokehShader.js'
import { createPostprocessing } from './postprocessing'

const atmosphere = {
  focusPoint: [0, 0, 0] as [number, number, number],
  aperture: 0.0005,
  maxBlur: 0.005,
  fogDensity: 0.02,
  bloom: 0.2,
}
function setup(previousTarget: WebGLRenderTarget | null = null) {
  const renderer = {
    getPixelRatio: () => 1,
    getRenderTarget: () => previousTarget,
    setRenderTarget: vi.fn(),
    render: vi.fn(),
  }
  const composition = vi.spyOn(EffectComposer.prototype, 'render').mockImplementation(() => {})
  const scene = new Scene()
  const camera = new PerspectiveCamera(40, 1, 0.05, 180)
  const pipeline = createPostprocessing(renderer as unknown as WebGLRenderer, scene, camera)
  pipeline.configure(800, 600, 1.25, false, atmosphere, 4)
  return { renderer, composition, scene, camera, pipeline }
}
afterEach(() => vi.restoreAllMocks())

describe('postprocessing shared scene depth', () => {
  it('renders geometry once with MSAA, then feeds its color and unpacked depth into fullscreen effects', () => {
    const { renderer, composition, scene, camera, pipeline } = setup()
    pipeline.render()
    const sceneTarget = renderer.setRenderTarget.mock.calls[0]![0] as WebGLRenderTarget
    const composer = composition.mock.contexts[0] as EffectComposer
    const input = composer.passes[0] as TexturePass
    const dof = composer.passes[1] as ShaderPass
    expect(renderer.render).toHaveBeenCalledExactlyOnceWith(scene, camera)
    expect(sceneTarget.samples).toBe(4)
    expect([sceneTarget.width, sceneTarget.height]).toEqual([1000, 750])
    expect(input.map).toBe(sceneTarget.texture)
    expect(dof.uniforms.tDepth!.value).toBe(sceneTarget.depthTexture)
    expect(dof.material.defines.DEPTH_PACKING).toBe(0)
    expect(BokehShader.defines.DEPTH_PACKING).toBe(1)
    expect(dof.uniforms.nearClip!.value).toBe(camera.near)
    expect(dof.uniforms.farClip!.value).toBe(camera.far)
    for (const buffer of [composer.renderTarget1, composer.renderTarget2]) {
      expect(buffer.samples).toBe(0)
      expect(buffer.depthBuffer).toBe(false)
    }
    pipeline.dispose()
  })

  it('keeps mobile depth testing while skipping its unused depth resolve, and restores DOF on desktop', () => {
    const { renderer, composition, pipeline } = setup()
    pipeline.configure(390, 844, 1, true, atmosphere, 3)
    pipeline.render()
    const sceneTarget = renderer.setRenderTarget.mock.calls[0]![0] as WebGLRenderTarget
    const composer = composition.mock.contexts[0] as EffectComposer
    const dof = composer.passes[1] as ShaderPass
    expect(sceneTarget.depthBuffer).toBe(true)
    expect(sceneTarget.resolveDepthBuffer).toBe(false)
    expect(dof.enabled).toBe(false)
    expect([sceneTarget.width, sceneTarget.height]).toEqual([390, 844])
    pipeline.configure(1280, 720, 1.25, false, atmosphere, 5)
    expect(dof.enabled).toBe(true)
    expect(sceneTarget.resolveDepthBuffer).toBe(true)
    expect(dof.uniforms.focus!.value).toBe(5)
    expect(dof.uniforms.aspect!.value).toBeCloseTo(1280 / 720)
    expect([sceneTarget.width, sceneTarget.height]).toEqual([1600, 900])
    pipeline.dispose()
  })

  it('restores the caller target if the scene render fails', () => {
    const original = new WebGLRenderTarget()
    const { renderer, composition, pipeline } = setup(original)
    renderer.render.mockImplementationOnce(() => {
      throw new Error('Render failed')
    })
    expect(() => pipeline.render()).toThrow('Render failed')
    expect(renderer.setRenderTarget).toHaveBeenLastCalledWith(original)
    expect(composition).not.toHaveBeenCalled()
    pipeline.dispose()
    original.dispose()
  })

  it('disposes the scene target, composer buffers and all effect passes', () => {
    const { renderer, composition, pipeline } = setup()
    pipeline.render()
    const sceneTarget = renderer.setRenderTarget.mock.calls[0]![0] as WebGLRenderTarget
    const composer = composition.mock.contexts[0] as EffectComposer
    const disposals = [sceneTarget, composer.renderTarget1, composer.renderTarget2, ...composer.passes].map(
      (resource) => vi.spyOn(resource, 'dispose'),
    )
    pipeline.dispose()
    for (const disposal of disposals) expect(disposal).toHaveBeenCalledOnce()
  })
})
