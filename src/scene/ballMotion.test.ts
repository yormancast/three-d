import { describe, expect, it } from 'vitest'
import { AnimationClip, AnimationMixer, Group, Object3D } from 'three'
import { ballTracks, parseBallMotion, restingBallTracks } from './ballMotion'

describe('existing scene ball playback', () => {
  it('maps native vertical motion and squash to the web axes', () => {
    const frames = parseBallMotion([
      { time: 0, position: [0.39, -0.48, 0.45], scale: [1, 1, 1], rotation: [0, 0, 0] },
      { time: 1, position: [0, -0.78, 0.1055], scale: [1.078, 1.078, 0.86], rotation: [0, 0, Math.PI] },
    ])
    const root = new Group()
    const ball = new Object3D()
    ball.name = 'Ball'
    root.add(ball)
    const mixer = new AnimationMixer(root)
    const dribble = mixer.clipAction(new AnimationClip('Dribble', 2, ballTracks(frames))).play()
    mixer.setTime(1)
    expect(ball.position.toArray()).toEqual(
      expect.arrayContaining([expect.closeTo(0), expect.closeTo(0.1055), expect.closeTo(0.78)]),
    )
    expect(ball.scale.y).toBeCloseTo(0.86)
    expect(Math.abs(ball.quaternion.y)).toBeCloseTo(1)
    dribble.stop()
    mixer.clipAction(new AnimationClip('Recovery', 8, restingBallTracks(8))).play()
    mixer.setTime(0)
    expect(ball.position.x).toBeCloseTo(-1.02)
    expect(ball.position.y).toBeCloseTo(0.12)
    expect(ball.position.z).toBeCloseTo(0.48)
    expect(ball.scale.toArray()).toEqual([1, 1, 1])
    expect(ball.quaternion.toArray()).toEqual([0, 0, 0, 1])
  })

  it('rejects broken timing instead of silently desynchronizing the ball', () => {
    const frame = { time: 0, position: [0, 0, 0], scale: [1, 1, 1], rotation: [0, 0, 0] }
    expect(() => parseBallMotion([frame, frame])).toThrow()
    expect(() => parseBallMotion([frame, { ...frame, time: 1, position: [0, NaN, 0] }])).toThrow()
  })
})
