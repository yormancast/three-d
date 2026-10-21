/// <reference types="node" />
import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'
import { validateSceneAssets } from './assets'
import { parseMotionData } from './continuousMotion'
import { MotionPlayback } from './motionPlayback'
import type { ClipId } from './motionPlayback'

const root = new URL('../../public/models/continuous/', import.meta.url)

describe('exported continuous motion', () => {
  it('keeps common poses, ball contacts and all seven clips on the original character', async () => {
    const bytes = await readFile(new URL('dirto-continuous.glb', root))
    const length = bytes.readUInt32LE(12)
    const definition = JSON.parse(bytes.subarray(20, 20 + length).toString())
    const data = parseMotionData(definition.scenes[definition.scene ?? 0].extras)
    expect(definition.images.length).toBeGreaterThanOrEqual(8)
    for (const image of definition.images) {
      expect(image.bufferView).toBeTypeOf('number')
      expect(image.uri).toBeUndefined()
    }
    const ballNode = definition.nodes.find((node: { name: string }) => node.name === 'Ball_Surface')
    const ballMesh = definition.meshes[ballNode.mesh]
    expect(ballMesh.primitives).toHaveLength(1)
    expect(definition.accessors[ballMesh.primitives[0].indices].count).toBe(440 * 3)
    const leather = definition.materials.find((material: { name: string }) => material.name === 'MAT_ball_leather')
    expect(leather.normalTexture).toBeDefined()
    expect(leather.pbrMetallicRoughness.baseColorTexture).toBeDefined()
    expect(leather.pbrMetallicRoughness.metallicRoughnessTexture).toBeDefined()
    // The Node test checks geometry and clips; image references are verified above.
    for (const material of definition.materials) {
      delete material.normalTexture
      delete material.occlusionTexture
      delete material.emissiveTexture
      delete material.pbrMetallicRoughness?.baseColorTexture
      delete material.pbrMetallicRoughness?.metallicRoughnessTexture
    }
    const json = Buffer.from(JSON.stringify(definition))
    const padded = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 32)])
    const tail = bytes.subarray(20 + length)
    const header = Buffer.from(bytes.subarray(0, 20))
    header.writeUInt32LE(20 + padded.length + tail.length, 8)
    header.writeUInt32LE(padded.length, 12)
    const geometryBytes = Buffer.concat([header, padded, tail])
    const gltf = await new GLTFLoader()
      .setMeshoptDecoder(MeshoptDecoder)
      .parseAsync(
        geometryBytes.buffer.slice(geometryBytes.byteOffset, geometryBytes.byteOffset + geometryBytes.byteLength),
        '',
      )
    const assets = validateSceneAssets(gltf)
    expect(assets.morphTargetCount).toBe(112)
    expect(assets.clips).toHaveLength(7)
    expect(() =>
      validateSceneAssets({ ...gltf, animations: gltf.animations.filter((clip) => clip.name !== 'Shot') }),
    ).toThrow(/Falta el clip de animación Shot/)
    const sceneWithoutEnvironment = gltf.scene.clone(true)
    sceneWithoutEnvironment.remove(sceneWithoutEnvironment.getObjectByName('ElDirto_Environment')!)
    expect(() => validateSceneAssets({ ...gltf, scene: sceneWithoutEnvironment })).toThrow(/ElDirto_Environment/)
    expect(gltf.scene.getObjectByName('ElDirto_Character')).toBeDefined()
    expect(gltf.scene.getObjectByName('ElDirto_Environment')).toBeDefined()
    expect(gltf.scene.getObjectByName('ElDirto_Emissives')).toBeDefined()
    for (const clip of gltf.animations) {
      for (const property of ['position', 'quaternion', 'scale']) {
        expect(clip.tracks.some((track) => track.name === `Ball.${property}`)).toBe(true)
      }
    }
    expect(gltf.animations.map((clip) => clip.name).sort()).toEqual(Object.keys(data).sort())
    const tracks = new Map(
      gltf.animations.map((clip) => [
        clip.name,
        clip.tracks.find((track) => track.name.endsWith('.morphTargetInfluences'))!,
      ]),
    )
    for (const [name, track] of tracks) {
      expect(track).toBeDefined()
      expect(track.times[0]).toBe(0)
      expect(track.times[track.times.length - 1]).toBeCloseTo(data[name as ClipId].duration, 5)
    }
    const joins: [ClipId, number, ClipId, number][] = [
      ['Recovery', 0, 'Pickup', 0],
      ['Pickup', 3.5, 'Dribble', 0],
      ['Dribble', 0, 'Crossover', 0],
      ['Dribble', 0, 'Rise', 0],
      ['Rise', 2.5, 'Standing', 0],
      ['Standing', 0, 'Shot', 0],
      ['Shot', 10.5, 'Standing', 0],
      ...data.Standing.gates.map((time) => ['Standing', time, 'Standing', 0] as [ClipId, number, ClipId, number]),
    ]
    for (const [a, ta, b, tb] of joins) {
      const wa = tracks.get(a)!.InterpolantFactoryMethodLinear().evaluate(ta)
      const wb = tracks.get(b)!.InterpolantFactoryMethodLinear().evaluate(tb)
      expect(Math.max(...Array.from(wa, (value, i) => Math.abs(value - wb[i]!)))).toBeLessThan(0.0001)
      const pa = data[a].motion[Math.round(ta * 24)]!
      const pb = data[b].motion[Math.round(tb * 24)]!
      expect(pa.position).toEqual(pb.position)
      expect(pa.scale).toEqual(pb.scale)
    }
    for (const name of ['Recovery', 'Dribble', 'Crossover', 'Standing'] as const) {
      const track = tracks.get(name)!
      const interpolant = track.InterpolantFactoryMethodLinear()
      const first = Array.from(interpolant.evaluate(0))
      const last = interpolant.evaluate(data[name].duration)
      expect(Math.max(...first.map((value, i) => Math.abs(value - last[i]!)))).toBeLessThan(0.0001)
    }
    // The self-propelled entry spins once; joining Dribble must preserve that turn.
    const angleAt = (name: ClipId, time: number) => {
      const frames = data[name].motion
      const frame = Math.min(frames.length - 1, Math.round(time * 24))
      return frames[frame]!.rotation[2]
    }
    const player = new MotionPlayback(data, angleAt)
    player.request('Dribble')
    player.advance(0.35 + data.Pickup.duration)
    expect(player.sample().clip).toBe('Dribble')
    expect(player.sample().spinOffset).toBeCloseTo(2 * Math.PI, 5)
    player.request('Recovery')
    player.advance(0)
    expect(player.sample().clip).toBe('Pickup')
    expect(angleAt('Pickup', player.sample().time) + player.sample().spinOffset).toBeCloseTo(2 * Math.PI, 5)

    expect(data.Shot.motion[0]!.shot).toBe(0)
    expect(data.Shot.motion.at(-1)!.shot).toBe(0)
    const rim = data.Shot.motion[108]!.position
    expect(rim[0]).toBeCloseTo(-5.8, 4)
    expect(rim[1]).toBeCloseTo(9.16, 4)
    expect(rim[2]).toBeCloseTo(3.05, 4)
    expect(data.Shot.motion[107]!.position[2]).toBeGreaterThan(rim[2])
    expect(data.Shot.motion[109]!.position[2]).toBeLessThan(rim[2])
    const spin = data.Standing.motion.map((frame) => frame.rotation[2])
    expect(spin.every((angle, i) => i === 0 || angle >= spin[i - 1]!)).toBe(true)
    expect(spin[spin.length - 1]).toBeCloseTo(2 * Math.PI, 5)
  })
})
