import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useEnvironment } from './useEnvironment'
import { sectionById } from '@/content/sections'

const mocks = vi.hoisted(() => ({
  createScene: vi.fn(),
  mounted: [] as (() => void)[],
  unmounted: [] as (() => void)[],
}))
vi.mock('vue', async (original) => ({
  ...(await original<typeof import('vue')>()),
  onMounted: (callback: () => void) => mocks.mounted.push(callback),
  onBeforeUnmount: (callback: () => void) => mocks.unmounted.push(callback),
}))
vi.mock('@/scene', () => ({ createScene: mocks.createScene }))

function scene() {
  return {
    load: vi.fn().mockResolvedValue(undefined),
    dispose: vi.fn(),
    setPresentation: vi.fn(),
    setPlaying: vi.fn(),
    setAtmosphereEnabled: vi.fn(),
    getStats: vi.fn().mockReturnValue({ triangles: 1, drawCalls: 1, submissionMs: 0, quality: 'mobile' }),
  }
}
function environment(reducedMotion = false, canvas = ref({} as HTMLCanvasElement)) {
  vi.stubGlobal('window', {
    innerWidth: 390,
    innerHeight: 844,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    matchMedia: (query: string) => ({
      matches: query.includes('reduced-motion') && reducedMotion,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  })
  vi.stubGlobal('document', { documentElement: {} })
  vi.stubGlobal('getComputedStyle', () => ({ getPropertyValue: () => '' }))
  return useEnvironment(canvas)
}
beforeEach(() => {
  mocks.createScene.mockReset()
  mocks.mounted.length = 0
  mocks.unmounted.length = 0
})
afterEach(() => vi.unstubAllGlobals())

function testCanvas() {
  return Object.assign(new EventTarget(), {}) as HTMLCanvasElement
}

describe('scene recovery preferences', () => {
  it('replaces a lost canvas on retry and preserves pause and section', async () => {
    const first = scene()
    const recovered = scene()
    mocks.createScene.mockReturnValueOnce(first).mockReturnValueOnce(recovered)
    const oldCanvas = testCanvas()
    const canvas = ref(oldCanvas)
    const state = environment(false, canvas)
    mocks.mounted[0]!()
    await vi.waitFor(() => expect(state.status.value).toBe('ready'))
    state.togglePlayback()
    state.selectPresentation(sectionById.contact.presentation)
    const loss = new Event('webglcontextlost', { cancelable: true })
    oldCanvas.dispatchEvent(loss)
    expect(loss.defaultPrevented).toBe(true)
    expect(state.status.value).toBe('error')
    expect(first.dispose).toHaveBeenCalledOnce()
    await state.retry()
    expect(state.canvasVersion.value).toBe(1)
    expect(mocks.createScene).toHaveBeenCalledTimes(1)
    state.selectPresentation(sectionById.bio.presentation)
    const replacement = testCanvas()
    canvas.value = replacement
    await nextTick()
    await vi.waitFor(() => expect(state.status.value).toBe('ready'))
    expect(mocks.createScene.mock.calls[1]![0]).toBe(replacement)
    expect(recovered.setPlaying).toHaveBeenCalledWith(false)
    expect(recovered.setPresentation).toHaveBeenCalledWith(sectionById.bio.presentation)
    oldCanvas.dispatchEvent(new Event('webglcontextlost'))
    expect(state.status.value).toBe('ready')
    mocks.unmounted[0]!()
    replacement.dispatchEvent(new Event('webglcontextlost'))
    expect(state.status.value).toBe('ready')
    expect(recovered.dispose).toHaveBeenCalledOnce()
  })

  it('does not mark a context-lost pending load as ready when it later finishes', async () => {
    let finish: () => void = () => {}
    const pendingScene = scene()
    pendingScene.load.mockImplementation(() => new Promise<void>((resolve) => (finish = resolve)))
    mocks.createScene.mockReturnValue(pendingScene)
    const element = testCanvas()
    const state = environment(false, ref(element))
    mocks.mounted[0]!()
    await vi.waitFor(() => expect(pendingScene.load).toHaveBeenCalledOnce())
    element.dispatchEvent(new Event('webglcontextlost', { cancelable: true }))
    finish()
    await nextTick()
    expect(state.status.value).toBe('error')
    expect(pendingScene.dispose).toHaveBeenCalledOnce()
  })

  it('keeps the latest section and a prior pause through a failed reload and retry', async () => {
    const first = scene()
    const failed = scene()
    failed.load.mockRejectedValue(new Error('Resource unavailable'))
    const recovered = scene()
    mocks.createScene.mockReturnValueOnce(first).mockReturnValueOnce(failed).mockReturnValueOnce(recovered)
    const state = environment()
    await state.retry()
    state.togglePlayback()
    state.selectPresentation(sectionById.contact.presentation)
    await state.retry()
    expect(state.status.value).toBe('error')
    expect(state.playing.value).toBe(false)
    expect(failed.dispose).toHaveBeenCalledOnce()
    state.selectPresentation(sectionById.bio.presentation)
    await state.retry()
    expect(state.status.value).toBe('ready')
    expect(recovered.setPlaying).toHaveBeenCalledWith(false)
    expect(recovered.setPresentation).toHaveBeenCalledWith(sectionById.bio.presentation)
  })

  it('starts and retries paused when reduced motion is preferred', async () => {
    const first = scene()
    const second = scene()
    mocks.createScene.mockReturnValueOnce(first).mockReturnValueOnce(second)
    const state = environment(true)
    await state.retry()
    await state.retry()
    expect(state.playing.value).toBe(false)
    expect(first.setPlaying).toHaveBeenCalledWith(false)
    expect(second.setPlaying).toHaveBeenCalledWith(false)
  })

  it('ignores a stale load failure after a newer retry succeeds', async () => {
    let rejectLoad: (reason: Error) => void = () => {}
    const old = scene()
    old.load.mockImplementation(() => new Promise<void>((_, reject) => (rejectLoad = reject)))
    const latest = scene()
    mocks.createScene.mockReturnValueOnce(old).mockReturnValueOnce(latest)
    const state = environment()
    const pending = state.retry()
    await vi.waitFor(() => expect(old.load).toHaveBeenCalledOnce())
    await state.retry()
    rejectLoad(new Error('Obsolete failure'))
    await pending
    expect(state.status.value).toBe('ready')
    expect(latest.dispose).not.toHaveBeenCalled()
    expect(old.dispose).toHaveBeenCalledOnce()
  })
})
