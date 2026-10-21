import { HalfFloatType, Vector2, WebGLRenderTarget } from 'three'
import type { PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import type { AtmospherePreset } from './types'

export function createPostprocessing(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera) {
  const target = new WebGLRenderTarget(1, 1, { type: HalfFloatType, samples: 4 })
  const composer = new EffectComposer(renderer, target)
  const scenePass = new RenderPass(scene, camera)
  const dof = new BokehPass(scene, camera, { focus: 4, aperture: 0.0005, maxblur: 0.004 })
  const focusUniforms = dof.uniforms as Record<'focus' | 'aperture' | 'maxblur' | 'aspect', { value: number }>
  const bloom = new UnrealBloomPass(new Vector2(1, 1), 0.2, 0.35, 1.05)
  const output = new OutputPass()
  composer.addPass(scenePass)
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
        composer.setPixelRatio(ratio)
        composer.setSize(width, height)
        cachedSize = key
      }
      dof.enabled = !mobile
      focusUniforms.focus.value = focus
      focusUniforms.aperture.value = atmosphere.aperture
      focusUniforms.maxblur.value = atmosphere.maxBlur
      focusUniforms.aspect.value = width / height
      bloom.strength = atmosphere.bloom * (mobile ? 0.7 : 1)
    },
    render() {
      composer.render()
    },
    dispose() {
      dof.dispose()
      bloom.dispose()
      output.dispose()
      composer.dispose()
    },
  }
}
