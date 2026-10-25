import { DepthTexture, HalfFloatType, UnsignedIntType, Vector2, WebGLRenderTarget } from 'three'
import type { PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { TexturePass } from 'three/addons/postprocessing/TexturePass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { BokehShader } from 'three/addons/shaders/BokehShader.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import type { AtmospherePreset } from './types'

export function createPostprocessing(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera) {
  // Only scene geometry needs multisampling. Fullscreen effects reuse its color and depth.
  const sceneTarget = new WebGLRenderTarget(1, 1, {
    type: HalfFloatType,
    samples: 4,
    depthTexture: new DepthTexture(1, 1, UnsignedIntType),
  })
  const target = new WebGLRenderTarget(1, 1, { type: HalfFloatType, depthBuffer: false })
  const composer = new EffectComposer(renderer, target)
  const input = new TexturePass(sceneTarget.texture)
  const dof = new ShaderPass({ ...BokehShader, defines: { ...BokehShader.defines, DEPTH_PACKING: 0 } }, 'tColor')
  const focusUniforms = dof.uniforms as Record<
    'focus' | 'aperture' | 'maxblur' | 'aspect' | 'nearClip' | 'farClip',
    { value: number }
  > & { tDepth: { value: DepthTexture | null } }
  focusUniforms.tDepth.value = sceneTarget.depthTexture
  const bloom = new UnrealBloomPass(new Vector2(1, 1), 0.2, 0.35, 1.05)
  const output = new OutputPass()
  composer.addPass(input)
  composer.addPass(dof)
  composer.addPass(bloom)
  composer.addPass(output)
  let cachedSize = ''
  return {
    configure(
      width: number,
      height: number,
      ratio: number,
      mobile: boolean,
      atmosphere: AtmospherePreset,
      focus: number,
    ) {
      const key = `${width}:${height}:${ratio}`
      if (key !== cachedSize) {
        sceneTarget.setSize(Math.max(1, Math.floor(width * ratio)), Math.max(1, Math.floor(height * ratio)))
        composer.setPixelRatio(ratio)
        composer.setSize(width, height)
        cachedSize = key
      }
      dof.enabled = !mobile
      // Mobile does not sample depth; retain the depth test, skip the unused MSAA depth resolve.
      sceneTarget.resolveDepthBuffer = !mobile
      focusUniforms.focus.value = focus
      focusUniforms.aperture.value = atmosphere.aperture
      focusUniforms.maxblur.value = atmosphere.maxBlur
      focusUniforms.aspect.value = width / height
      focusUniforms.nearClip.value = camera.near
      focusUniforms.farClip.value = camera.far
      bloom.strength = atmosphere.bloom * (mobile ? 0.7 : 1)
    },
    render() {
      const previousTarget = renderer.getRenderTarget()
      try {
        renderer.setRenderTarget(sceneTarget)
        renderer.render(scene, camera)
        renderer.setRenderTarget(previousTarget)
        composer.render()
      } finally {
        renderer.setRenderTarget(previousTarget)
      }
    },
    dispose() {
      sceneTarget.dispose()
      input.dispose()
      dof.dispose()
      bloom.dispose()
      output.dispose()
      composer.dispose()
    },
  }
}
