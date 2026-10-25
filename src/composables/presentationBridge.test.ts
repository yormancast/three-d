import { describe, expect, it, vi } from 'vitest'
import { createPresentationBridge } from './presentationBridge'
import type { ScenePresentation } from '@/scene'

const home: ScenePresentation = { cameraId: 'Inicio', motionId: 'Recovery', anchorId: null }
const bio: ScenePresentation = { cameraId: 'Bio', motionId: 'Dribble', anchorId: 'seated' }
const contact: ScenePresentation = { cameraId: 'Contact', motionId: 'Recovery', anchorId: 'seated' }

describe('createPresentationBridge', () => {
  it('applies the latest requested presentation when a scene becomes available', () => {
    const bridge = createPresentationBridge(home)
    bridge.request(bio)
    bridge.request(contact)
    const setPresentation = vi.fn()

    bridge.apply({ setPresentation })

    expect(setPresentation).toHaveBeenCalledOnce()
    expect(setPresentation).toHaveBeenCalledWith(contact)
  })

  it('preserves the request across a failed load and applies it to a retry instance', () => {
    const bridge = createPresentationBridge(home)
    bridge.request(bio)
    const failedInstance = { setPresentation: vi.fn() }
    bridge.apply(failedInstance)

    bridge.request(contact)
    const retryInstance = { setPresentation: vi.fn() }
    bridge.apply(retryInstance)

    expect(failedInstance.setPresentation).toHaveBeenCalledWith(bio)
    expect(retryInstance.setPresentation).toHaveBeenCalledWith(contact)
    expect(bridge.current).toEqual(contact)
  })

  it('does not replace the saved request when applying to a stale instance fails', () => {
    const bridge = createPresentationBridge(bio)
    const staleInstance = {
      setPresentation: vi.fn(() => {
        throw new Error('disposed')
      }),
    }

    expect(() => bridge.request(contact, staleInstance)).toThrow('disposed')
    expect(bridge.current).toEqual(bio)
  })
})
