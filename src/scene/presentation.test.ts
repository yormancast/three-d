import { describe, expect, it } from 'vitest'
import { createPresentationIntent, validateScenePresentation } from './presentation'

const cameras = new Set(['Inicio', 'Bio', 'Projects', 'Experience', 'Contact'])
const atmospheres = new Set(['Inicio', 'Bio', 'Projects', 'Experience', 'Contact'])

describe('validateScenePresentation', () => {
  it('accepts a complete presentation whose camera and atmosphere are available', () => {
    expect(
      validateScenePresentation({ cameraId: 'Bio', motionId: 'Dribble', anchorId: 'seated' }, cameras, atmospheres),
    ).toBe(true)
  })

  it('rejects an invalid field without accepting a partial presentation', () => {
    expect(
      validateScenePresentation({ cameraId: 'Bio', motionId: 'Unknown', anchorId: 'seated' }, cameras, atmospheres),
    ).toBe(false)
    expect(
      validateScenePresentation({ cameraId: 'Overview', motionId: 'Recovery', anchorId: null }, cameras, atmospheres),
    ).toBe(false)
    expect(validateScenePresentation(null, cameras, atmospheres)).toBe(false)
  })

  it('requires matching camera and atmosphere presets', () => {
    expect(
      validateScenePresentation(
        { cameraId: 'Bio', motionId: 'Dribble', anchorId: 'seated' },
        cameras,
        new Set(['Inicio']),
      ),
    ).toBe(false)
  })

  it('keeps the latest request made before the scene is ready', () => {
    const intent = createPresentationIntent(
      { cameraId: 'Inicio', motionId: 'Recovery', anchorId: null },
      cameras,
      atmospheres,
    )

    expect(intent.request({ cameraId: 'Bio', motionId: 'Dribble', anchorId: 'seated' })).toBe(true)
    expect(intent.request({ cameraId: 'Contact', motionId: 'Recovery', anchorId: 'seated' })).toBe(true)
    expect(intent.current).toEqual({ cameraId: 'Contact', motionId: 'Recovery', anchorId: 'seated' })
  })

  it('does not partially apply an invalid request', () => {
    const intent = createPresentationIntent(
      { cameraId: 'Inicio', motionId: 'Recovery', anchorId: null },
      cameras,
      atmospheres,
    )

    expect(intent.request({ cameraId: 'Bio', motionId: 'Dribble', anchorId: 'unknown' })).toBe(false)
    expect(intent.current).toEqual({ cameraId: 'Inicio', motionId: 'Recovery', anchorId: null })
  })
})
