export type MotionId = 'Recovery' | 'Dribble' | 'Crossover' | 'Standing' | 'Shot'
export type ClipId = MotionId | 'Rise' | 'Pickup'
type Place = 'rest' | 'seat' | 'stand'
export interface MotionDefinition {
  duration: number
  gates: readonly number[]
}
export interface MotionSample {
  clip: ClipId
  time: number
  spinOffset: number
  blendFrom?: { time: number; amount: number }
}
export interface PlaybackState {
  active: MotionId
  target: MotionId
  transitioning: boolean
  phase: 'loop' | 'settle' | 'edge'
  label: string
  time: number
  duration: number
}

const labels: Record<ClipId, string> = {
  Recovery: 'Descanso',
  Dribble: 'Dribble',
  Crossover: 'Crossover',
  Standing: 'De pie',
  Shot: 'Lanzamiento',
  Rise: 'Levantándose',
  Pickup: 'El balón se acerca',
}
const place = (id: MotionId): Place =>
  id === 'Recovery' ? 'rest' : id === 'Standing' || id === 'Shot' ? 'stand' : 'seat'
const ease = (t: number) => t * t * t * (10 - 15 * t + 6 * t * t)
const EPS = 1e-7

export class MotionPlayback {
  private active: MotionId
  private target: MotionId
  private clip: ClipId
  private time = 0
  private offset = 0
  private phase: 'loop' | 'settle' | 'edge' = 'loop'
  private direction = 1
  private destination: Place = 'rest'
  private settleTime = 0
  private settleFrom = 0

  private readonly definitions: Record<ClipId, MotionDefinition>
  private readonly angleAt: (clip: ClipId, time: number) => number

  constructor(
    definitions: Record<ClipId, MotionDefinition>,
    angleAt: (clip: ClipId, time: number) => number,
    initial: MotionId = 'Recovery',
  ) {
    this.definitions = definitions
    this.angleAt = angleAt
    this.active = this.target = this.clip = initial
  }

  request(id: MotionId) {
    this.target = id
  }

  snap(id: MotionId) {
    this.active = this.target = this.clip = id
    this.time = 0
    this.phase = 'loop'
    this.direction = 1
    this.destination = place(id)
    this.settleTime = 0
    this.offset = 0
  }

  private enter(clip: ClipId, time: number) {
    const angle = this.offset + this.angleAt(this.clip, this.time)
    this.clip = clip
    this.time = time
    this.offset = angle - this.angleAt(clip, time)
  }

  private loop(id: MotionId) {
    this.enter(id, 0)
    this.active = id
    this.phase = 'loop'
    this.direction = 1
  }

  private edge(clip: 'Pickup' | 'Rise', reverse: boolean, destination: Place) {
    this.enter(clip, reverse ? this.definitions[clip].duration : 0)
    this.direction = reverse ? -1 : 1
    this.destination = destination
    this.phase = 'edge'
  }

  private route(from: Place) {
    const to = place(this.target)
    if (from === to) {
      this.loop(this.target)
    } else if (from === 'rest') {
      this.edge('Pickup', false, 'seat')
    } else if (from === 'stand') {
      this.edge('Rise', true, 'seat')
    } else if (to === 'stand') {
      this.edge('Rise', false, 'stand')
    } else {
      this.edge('Pickup', true, 'rest')
    }
  }

  advance(delta: number) {
    let remaining = Math.max(0, delta)
    // Consume boundaries exactly, even if one display frame spans a clip boundary.
    for (let iteration = 0; iteration < 100; iteration++) {
      if (this.phase === 'settle') {
        const step = Math.min(remaining, 0.35 - this.settleTime)
        this.settleTime += step
        remaining -= step
        if (this.settleTime < 0.35 - EPS) break
        this.time = 0
        this.route('rest')
        continue
      }
      const duration = this.definitions[this.clip].duration
      if (this.phase === 'edge') {
        const distance = this.direction === 1 ? duration - this.time : this.time
        const step = Math.min(remaining, distance)
        this.time += step * this.direction
        remaining -= step
        if (step < distance - EPS) break
        this.time = this.direction === 1 ? duration : 0
        this.route(this.destination)
        if (remaining <= EPS) break
        continue
      }
      if (this.target !== this.active && this.active === 'Recovery') {
        this.settleFrom = this.time
        this.settleTime = 0
        this.phase = 'settle'
        continue
      }
      let until = duration - this.time
      if (this.target !== this.active) {
        for (const gate of this.definitions[this.active].gates) {
          const distance = gate >= this.time - EPS ? Math.max(0, gate - this.time) : duration - this.time + gate
          until = Math.min(until, distance)
        }
      }
      const step = Math.min(remaining, until)
      this.time += step
      remaining -= step
      if (step < until - EPS) break
      if (this.active === 'Shot' && this.target === 'Shot') this.target = 'Standing'
      if (this.target !== this.active) {
        this.route(place(this.active))
      } else {
        const angle = this.offset + this.angleAt(this.clip, duration)
        this.time = 0
        this.offset = angle - this.angleAt(this.clip, 0)
      }
      if (remaining <= EPS) break
    }
  }

  seek(seconds: number) {
    if (this.phase !== 'loop') return
    this.target = this.active
    this.time = Math.max(0, Math.min(seconds, this.definitions[this.active].duration - EPS))
  }

  sample(): MotionSample {
    if (this.phase === 'settle')
      return {
        clip: 'Recovery',
        time: 0,
        spinOffset: this.offset,
        blendFrom: { time: this.settleFrom, amount: ease(this.settleTime / 0.35) },
      }
    return { clip: this.clip, time: this.time, spinOffset: this.offset }
  }

  state(): PlaybackState {
    const reversing = this.phase === 'edge' && this.direction === -1
    const label =
      this.phase === 'settle'
        ? 'Preparándose'
        : reversing
          ? this.clip === 'Rise'
            ? 'Volviendo a la banca'
            : 'El balón vuelve a su lugar'
          : labels[this.clip]
    return {
      active: this.active,
      target: this.target,
      transitioning: this.phase !== 'loop' || this.target !== this.active,
      phase: this.phase,
      label,
      time:
        this.phase === 'settle'
          ? this.settleTime
          : reversing
            ? this.definitions[this.clip].duration - this.time
            : this.time,
      duration: this.phase === 'settle' ? 0.35 : this.definitions[this.clip].duration,
    }
  }
}
