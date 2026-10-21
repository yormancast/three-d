import {
  AgXToneMapping,
  Color,
  DataTexture,
  FogExp2,
  HemisphereLight,
  MeshToonMaterial,
  NearestFilter,
  PCFShadowMap,
  PerspectiveCamera,
  RedFormat,
  Scene,
  ShadowMaterial,
  SpotLight,
  Vector3,
  WebGLRenderer,
} from 'three'
import type { Material, Object3D } from 'three'
import { createContinuousMotion } from './continuousMotion'
import type { MotionId } from './motionPlayback'
import { toWorld, verticalFov } from './camera'
import { createPostprocessing } from './postprocessing'
import { loadSceneAssets, releaseSceneAsset } from './assets'
import { adaptSceneMaterials, enableBallShadows } from './materials'
import type { SceneConfig, SceneStats } from './types'
export type * from './types'

export function createScene(canvas: HTMLCanvasElement, config: SceneConfig) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'low-power' })
  renderer.toneMapping = AgXToneMapping
  renderer.toneMappingExposure = Math.SQRT2
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFShadowMap
  renderer.shadowMap.autoUpdate = false
  renderer.info.autoReset = false
  const scene = new Scene()
  scene.background = new Color(config.colors.background)
  const fog = new FogExp2(config.colors.fog, 0.025)
  scene.fog = fog
  const camera = new PerspectiveCamera(40, 1, 0.05, 180)
  const ambient = new HemisphereLight(config.colors.cool, config.colors.ground, config.light.ambientIntensity)
  scene.add(ambient)
  const key = new SpotLight(config.colors.warm, config.light.intensity, 9, Math.PI / 3, 0.75, 2)
  key.position.set(...toWorld(config.light.position))
  key.target.position.set(...toWorld(config.light.target))
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  key.shadow.camera.near = 0.15
  key.shadow.camera.far = 9
  key.shadow.bias = -0.0001
  key.shadow.normalBias = 0.003
  key.shadow.focus = 0.45
  key.shadow.radius = 2
  scene.add(key, key.target)
  let pipeline: ReturnType<typeof createPostprocessing>
  try {
    pipeline = createPostprocessing(renderer, scene, camera)
  } catch (error) {
    key.shadow.dispose()
    renderer.dispose()
    throw error
  }
  let shadowMaterial: ShadowMaterial | undefined
  let gradient: DataTexture | undefined
  let toon: MeshToonMaterial | undefined
  try {
    shadowMaterial = new ShadowMaterial({
      color: config.colors.shadow,
      opacity: config.light.shadowOpacity,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    })
    gradient = new DataTexture(
      new Uint8Array(config.toonBands.map((value) => Math.round(value * 255))),
      config.toonBands.length,
      1,
      RedFormat,
    )
    gradient.minFilter = NearestFilter
    gradient.magFilter = NearestFilter
    gradient.generateMipmaps = false
    gradient.needsUpdate = true
    toon = new MeshToonMaterial({ vertexColors: true, gradientMap: gradient })
  } catch (error) {
    toon?.dispose()
    gradient?.dispose()
    shadowMaterial?.dispose()
    pipeline.dispose()
    key.shadow.dispose()
    renderer.dispose()
    throw error
  }
  if (!shadowMaterial || !gradient || !toon) throw new Error('No se pudieron preparar los materiales de la escena.')
  let disposed = false
  let active = 'Inicio'
  let ready = false
  let assetRoot: Object3D | undefined
  const retiredMaterials = new Set<Material>()
  let atmosphereEnabled = true
  let cachedSize = ''
  let motion: ReturnType<typeof createContinuousMotion> | undefined
  let character: Object3D | undefined
  let pose = { standing: 0, shot: 0 }
  let activeAnimation = config.initialAnimation
  let playing = false
  let lastFrame = 0
  let animationFrame = 0
  let lastReport = 0
  function tick(now: number) {
    animationFrame = 0
    if (disposed || !ready || !playing || document.hidden || !motion) return
    const delta = lastFrame ? Math.min((now - lastFrame) / 1000, 0.1) : 0
    lastFrame = now
    motion.playback.advance(delta)
    pose = motion.apply()
    renderer.shadowMap.needsUpdate = true
    render()
    animationFrame = requestAnimationFrame(tick)
  }
  function syncPlayback() {
    cancelAnimationFrame(animationFrame)
    lastFrame = 0
    if (playing && ready && !disposed && !document.hidden) animationFrame = requestAnimationFrame(tick)
  }
  document.addEventListener('visibilitychange', syncPlayback)
  let stats: SceneStats = { triangles: 0, drawCalls: 0, submissionMs: 0, quality: 'desktop' }
  function render() {
    if (disposed) return
    const width = Math.max(canvas.clientWidth, 1)
    const height = Math.max(canvas.clientHeight, 1)
    const mobile = width < 700
    const portrait = mobile && height > width
    const preset = config.cameras[portrait ? `${active}_mobile` : active] ?? config.cameras[active]
    const atmosphere = config.atmosphere[active]
    if (!preset || !atmosphere) return
    const shotCamera = config.cameras[portrait ? 'Shot_mobile' : 'Shot'] ?? preset
    const ratio = Math.min(window.devicePixelRatio, mobile ? 1 : 1.25)
    const size = `${width}:${height}:${ratio}`
    if (size !== cachedSize) {
      renderer.setPixelRatio(ratio)
      renderer.setSize(width, height, false)
      cachedSize = size
    }
    camera.aspect = width / height
    const shotLens = shotCamera.lens * Math.min(1, 16 / 9 / camera.aspect)
    camera.fov = verticalFov(preset.lens + (shotLens - preset.lens) * pose.shot, camera.aspect)
    const framing = new Vector3(0, 0.25 * pose.standing, 0.3 * pose.standing)
    camera.position.set(...toWorld(preset.position)).add(framing)
    camera.position.lerp(new Vector3(...toWorld(shotCamera.position)), pose.shot)
    camera.lookAt(
      new Vector3(...toWorld(preset.target)).add(framing).lerp(new Vector3(...toWorld(shotCamera.target)), pose.shot),
    )
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld()
    const focus = -new Vector3(...toWorld(atmosphere.focusPoint))
      .add(framing)
      .lerp(new Vector3(...toWorld(shotCamera.target)), pose.shot)
      .applyMatrix4(camera.matrixWorldInverse).z
    fog.density = atmosphere.fogDensity
    scene.fog = atmosphereEnabled ? fog : null
    pipeline.configure(width, height, ratio, mobile, atmosphere, focus)
    renderer.info.reset()
    const start = performance.now()
    if (atmosphereEnabled) pipeline.render()
    else renderer.render(scene, camera)
    if (ready) {
      stats = {
        triangles: renderer.info.render.triangles,
        drawCalls: renderer.info.render.calls,
        submissionMs: performance.now() - start,
        quality: mobile ? 'mobile' : 'desktop',
      }
      if (!playing || performance.now() - lastReport > 100) {
        config.onStats(stats)
        if (motion) config.onPlayback(motion.playback.state())
        lastReport = performance.now()
      }
    }
  }
  function selectAnimation(id: MotionId) {
    activeAnimation = id
    if (!motion) return
    motion.playback.request(id)
    config.onPlayback(motion.playback.state())
    render()
  }
  let observer: ResizeObserver
  try {
    observer = new ResizeObserver(render)
    observer.observe(canvas)
  } catch (error) {
    document.removeEventListener('visibilitychange', syncPlayback)
    pipeline.dispose()
    key.shadow.dispose()
    releaseSceneAsset(scene, [toon, shadowMaterial])
    renderer.dispose()
    throw error
  }
  return {
    async load() {
      const assets = await loadSceneAssets(config.modelUrl)
      const { gltf, ball, clips, motionData } = assets
      assetRoot = gltf.scene
      if (disposed) {
        releaseSceneAsset(gltf.scene)
        assetRoot = undefined
        return
      }
      adaptSceneMaterials(assets, config, toon, shadowMaterial, retiredMaterials)
      character = assets.character
      scene.add(gltf.scene)
      config.onProgress(1, 1)
      enableBallShadows(ball)
      if (!character) throw new Error('No se encontró el personaje de la escena.')
      motion = createContinuousMotion(character, ball, clips, motionData, activeAnimation)
      pose = motion.apply()
      ready = true
      config.onPlayback(motion.playback.state())
      syncPlayback()
      renderer.shadowMap.needsUpdate = true
      render()
    },
    setCamera(name: string) {
      active = name
      render()
    },
    getStats: () => stats,
    setAnimation: selectAnimation,
    setPlaying(enabled: boolean) {
      playing = enabled
      syncPlayback()
    },
    seek(seconds: number) {
      if (!motion) return
      motion.playback.seek(seconds)
      pose = motion.apply()
      renderer.shadowMap.needsUpdate = true
      config.onPlayback(motion.playback.state())
      render()
    },
    setAtmosphereEnabled(enabled: boolean) {
      atmosphereEnabled = enabled
      render()
    },
    dispose() {
      if (disposed) return
      disposed = true
      cancelAnimationFrame(animationFrame)
      document.removeEventListener('visibilitychange', syncPlayback)
      motion = undefined
      observer.disconnect()
      pipeline.dispose()
      key.shadow.dispose()
      const ownedMaterials = new Set<Material>([toon, shadowMaterial, ...retiredMaterials])
      releaseSceneAsset(scene, ownedMaterials)
      if (assetRoot?.parent !== scene && assetRoot) releaseSceneAsset(assetRoot, ownedMaterials)
      assetRoot = undefined
      scene.clear()
      renderer.dispose()
    },
  }
}
