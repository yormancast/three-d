<script setup lang="ts">
import { onMounted, ref } from 'vue'

withDefaults(
  defineProps<{
    language?: 'en' | 'es'
    status: 'loading' | 'ready' | 'error'
    posterUrl: string
    triangles: number
    drawCalls: number
    submissionMs: number
    quality: 'desktop' | 'mobile'
    atmosphere: boolean
    playing: boolean
    animationTime: number
    animation: string
    targetAnimation: string
    transitioning: boolean
    animationDuration: number
  }>(),
  { language: 'es' },
)

const emit = defineEmits<{ canvasReady: [canvas: HTMLCanvasElement] }>()
const canvas = ref<HTMLCanvasElement | null>(null)
onMounted(() => {
  if (canvas.value) emit('canvasReady', canvas.value)
})
</script>

<template>
  <div class="scene-viewport">
    <img
      v-if="status !== 'ready'"
      class="scene-poster"
      :src="posterUrl"
      :alt="
        language === 'en'
          ? 'Basketball character seated on a night court under the bridge'
          : 'Personaje de básquetbol sentado en una cancha nocturna bajo el puente'
      "
    />
    <canvas
      ref="canvas"
      :data-scene-status="status"
      :data-triangles="triangles"
      :data-draw-calls="drawCalls"
      :data-submission-ms="submissionMs"
      :data-quality="quality"
      :data-atmosphere="atmosphere"
      :data-playing="playing"
      :data-animation-time="animationTime"
      :data-animation="animation"
      :data-target-animation="targetAnimation"
      :data-transitioning="transitioning"
      :data-animation-duration="animationDuration"
      class="scene-canvas"
      :class="{ 'is-ready': status === 'ready' }"
      :aria-label="
        language === 'en'
          ? 'Basketball character resting, dribbling, standing and shooting hoops'
          : 'Personaje de básquetbol descansando y jugando con el balón, sentado, de pie y lanzando al aro'
      "
    />
  </div>
</template>

<style scoped>
.scene-viewport,
.scene-poster,
.scene-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.scene-poster {
  object-fit: cover;
}
.scene-canvas {
  display: block;
  opacity: 0;
}
.scene-canvas.is-ready {
  opacity: 1;
}
</style>
