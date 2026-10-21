import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import { createScene } from '@/scene'
import type { MotionId } from '@/scene/motionPlayback'
import { cameras, views, atmosphere, characterLight, toonBands, animations } from '@/content'
export function useEnvironment(canvas: Ref<HTMLCanvasElement | null>) {
  const status = ref<'loading' | 'ready' | 'error'>('loading')
  const error = ref('')
  const progress = ref(0)
  const activeView = ref('Inicio')
  const stats = ref({ triangles: 0, drawCalls: 0, submissionMs: 0, quality: 'desktop' as 'desktop' | 'mobile' })
  const atmosphereEnabled = ref(true)
  const playing = ref(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const animationTime = ref(0)
  const animationDuration = ref(8)
  const activeAnimation = ref<MotionId>('Recovery')
  const targetAnimation = ref<MotionId>('Recovery')
  const transitioning = ref(false)
  const transitionLabel = ref('')
  let scene: ReturnType<typeof createScene> | undefined
  let generation = 0
  let unmounted = false
  async function load() {
    const current = ++generation
    scene?.dispose()
    scene = undefined
    status.value = 'loading'
    progress.value = 0
    error.value = ''
    if (!canvas.value) return
    try {
      const styles = getComputedStyle(document.documentElement)
      const token = (name: string) => styles.getPropertyValue(name).trim()
      const instance = createScene(canvas.value, {
        modelUrl: `${import.meta.env.BASE_URL}models/continuous/dirto-continuous.glb`,
        initialAnimation: activeAnimation.value,
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
        cameras,
        onProgress(completed, total) {
          if (current === generation && !unmounted) progress.value = Math.round((completed / total) * 100)
        },
      })
      scene = instance
      instance.setCamera(activeView.value)
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
  function selectView(id: string) {
    activeView.value = id
    scene?.setCamera(id)
    if (scene) stats.value = scene.getStats()
  }
  function toggleAtmosphere() {
    atmosphereEnabled.value = !atmosphereEnabled.value
    scene?.setAtmosphereEnabled(atmosphereEnabled.value)
  }
  function selectAnimation(id: MotionId) {
    scene?.setAnimation(id)
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
  onMounted(load)
  onBeforeUnmount(() => {
    unmounted = true
    generation++
    scene?.dispose()
  })
  return {
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
    error,
    progress,
    activeView,
    views,
    stats,
    selectView,
    atmosphereEnabled,
    toggleAtmosphere,
    retry: load,
  }
}
