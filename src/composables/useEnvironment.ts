import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { ProjectedAnchor, ScenePresentation } from '@/scene'
import type { MotionId } from '@/scene/motionPlayback'
import {
  cameras,
  views,
  atmosphere,
  characterLight,
  toonBands,
  animations,
  sections,
  layoutBreakpoint,
  compactLandscapeHeight,
} from '@/content'
import { getViewportProfile } from '@/scene/viewport'
import { createPresentationBridge } from './presentationBridge'
export function useEnvironment(canvas: Ref<HTMLCanvasElement | null>) {
  const canvasVersion = ref(0)
  const status = ref<'loading' | 'ready' | 'error'>('loading')
  const error = ref('')
  const projectedAnchor = ref<ProjectedAnchor | null>(null)
  const requestedPresentation = ref<ScenePresentation>(sections[0].presentation)
  const presentationBridge = createPresentationBridge(requestedPresentation.value)
  const activeView = ref(requestedPresentation.value.cameraId)
  const stats = ref({ triangles: 0, drawCalls: 0, submissionMs: 0, quality: 'desktop' as 'desktop' | 'mobile' })
  const atmosphereEnabled = ref(true)
  const playing = ref(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const animationTime = ref(0)
  const animationDuration = ref(8)
  const activeAnimation = ref<MotionId>('Recovery')
  const targetAnimation = ref<MotionId>('Recovery')
  const transitioning = ref(false)
  const transitionLabel = ref('')
  const coarsePointer = window.matchMedia('(pointer: coarse)')
  const viewportProfile = ref(
    getViewportProfile(
      window.innerWidth,
      window.innerHeight,
      coarsePointer.matches,
      layoutBreakpoint,
      compactLandscapeHeight,
    ),
  )
  function syncViewportProfile() {
    viewportProfile.value = getViewportProfile(
      window.innerWidth,
      window.innerHeight,
      coarsePointer.matches,
      layoutBreakpoint,
      compactLandscapeHeight,
    )
    scene?.refresh()
  }
  let scene: ReturnType<(typeof import('@/scene'))['createScene']> | undefined
  let generation = 0
  let unmounted = false
  let mounted = false
  let contextLost = false
  let observedCanvas: HTMLCanvasElement | null = null
  function onContextLost(event: Event) {
    event.preventDefault()
    if (unmounted || contextLost) return
    contextLost = true
    generation++
    scene?.dispose()
    scene = undefined
    projectedAnchor.value = null
    status.value = 'error'
    error.value = 'Se perdió la conexión con la vista 3D. Puedes volver a intentarlo.'
  }
  function observeCanvas() {
    observedCanvas?.removeEventListener('webglcontextlost', onContextLost)
    observedCanvas = canvas.value
    observedCanvas?.addEventListener('webglcontextlost', onContextLost)
  }
  watch(canvas, () => {
    if (!mounted || unmounted) return
    contextLost = false
    observeCanvas()
    void load()
  })
  async function retry() {
    if (contextLost) {
      status.value = 'loading'
      canvasVersion.value++
      return
    }
    await load()
  }
  async function load() {
    const current = ++generation
    scene?.dispose()
    scene = undefined
    status.value = 'loading'
    error.value = ''
    if (!canvas.value) return
    try {
      const styles = getComputedStyle(document.documentElement)
      const token = (name: string) => styles.getPropertyValue(name).trim()
      const { createScene } = await import('@/scene')
      if (current !== generation || unmounted) return
      const instance = createScene(canvas.value, {
        modelUrl: `${import.meta.env.BASE_URL}models/continuous/dirto-continuous.glb`,
        initialAnimation: requestedPresentation.value.motionId,
        colors: {
          background: token('--color-night'),
          warm: token('--color-light-warm'),
          cool: token('--color-light-cool'),
          ground: token('--color-purple-950'),
          lime: token('--color-lime'),
          shadow: token('--color-shadow-3d'),
          fog: token('--color-fog-3d'),
        },
        atmosphere,
        light: characterLight,
        toonBands,
        getViewportProfile: () => viewportProfile.value,
        onPlayback(state) {
          if (current !== generation || unmounted) return
          activeAnimation.value = state.active
          targetAnimation.value = state.target
          transitioning.value = state.transitioning
          transitionLabel.value =
            state.phase === 'loop' && state.transitioning
              ? state.active === 'Shot'
                ? 'Terminando el lanzamiento'
                : 'Terminando el bote'
              : state.label
          animationDuration.value = state.duration
          animationTime.value = state.time
        },
        onStats(value) {
          if (current === generation && !unmounted) stats.value = value
        },
        onAnchor(value) {
          if (current === generation && !unmounted) projectedAnchor.value = value
        },
        cameras,
      })
      scene = instance
      presentationBridge.apply(instance)
      instance.setAtmosphereEnabled(atmosphereEnabled.value)
      instance.setPlaying(playing.value)
      await instance.load()
      if (current !== generation || unmounted) return
      status.value = 'ready'
      stats.value = instance.getStats()
    } catch (cause) {
      if (current !== generation || unmounted) return
      scene?.dispose()
      scene = undefined
      status.value = 'error'
      const message = cause instanceof Error ? cause.message : ''
      error.value =
        message.startsWith('No se pudo cargar el recurso 3D.') ||
        message.startsWith('No se pudo validar el recurso 3D:')
          ? message
          : 'No se pudo abrir la vista 3D en este dispositivo. Puedes ver la imagen de la escena o volver a intentarlo.'
    }
  }
  function selectPresentation(presentation: ScenePresentation) {
    requestedPresentation.value = presentation
    activeView.value = presentation.cameraId
    presentationBridge.request(presentation, scene)
    if (scene) stats.value = scene.getStats()
  }
  function selectView(id: string) {
    selectPresentation({ ...requestedPresentation.value, cameraId: id })
  }
  function toggleAtmosphere() {
    atmosphereEnabled.value = !atmosphereEnabled.value
    scene?.setAtmosphereEnabled(atmosphereEnabled.value)
  }
  function selectAnimation(id: MotionId) {
    selectPresentation({ ...requestedPresentation.value, motionId: id })
  }
  function togglePlayback() {
    playing.value = !playing.value
    scene?.setPlaying(playing.value)
  }
  function seekAnimation(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return
    playing.value = false
    scene?.setPlaying(false)
    scene?.seek(Number(event.target.value))
  }
  onMounted(() => {
    mounted = true
    observeCanvas()
    window.addEventListener('resize', syncViewportProfile)
    window.addEventListener('orientationchange', syncViewportProfile)
    coarsePointer.addEventListener('change', syncViewportProfile)
    syncViewportProfile()
    void load()
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', syncViewportProfile)
    window.removeEventListener('orientationchange', syncViewportProfile)
    coarsePointer.removeEventListener('change', syncViewportProfile)
    observedCanvas?.removeEventListener('webglcontextlost', onContextLost)
    unmounted = true
    generation++
    scene?.dispose()
  })
  return {
    canvasVersion,
    playing,
    animationTime,
    animationDuration,
    activeAnimation,
    targetAnimation,
    transitioning,
    transitionLabel,
    animations,
    selectAnimation,
    togglePlayback,
    seekAnimation,
    status,
    compactLayout: computed(() => viewportProfile.value.compactLayout),
    error,
    projectedAnchor,
    activeView,
    requestedPresentation,
    selectPresentation,
    views,
    stats,
    selectView,
    atmosphereEnabled,
    toggleAtmosphere,
    retry,
  }
}
