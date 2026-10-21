<script setup lang="ts">
import { ref } from 'vue'
import SceneStatus from '@/components/SceneStatus.vue'
import SceneViewport from '@/components/SceneViewport.vue'
import { useEnvironment } from '@/composables/useEnvironment'

const canvas = ref<HTMLCanvasElement | null>(null)
const {
  status,
  error,
  progress,
  stats,
  atmosphereEnabled,
  playing,
  animationTime,
  activeAnimation,
  targetAnimation,
  transitioning,
  animationDuration,
  retry,
} = useEnvironment(canvas)
const posterUrl = `${import.meta.env.BASE_URL}models/continuous/preview.jpg`
</script>

<template>
  <main class="public-scene">
    <SceneViewport
      :status="status"
      :poster-url="posterUrl"
      :triangles="stats.triangles"
      :draw-calls="stats.drawCalls"
      :submission-ms="stats.submissionMs"
      :quality="stats.quality"
      :atmosphere="atmosphereEnabled"
      :playing="playing"
      :animation-time="animationTime"
      :animation="activeAnimation"
      :target-animation="targetAnimation"
      :transitioning="transitioning"
      :animation-duration="animationDuration"
      @canvas-ready="(element) => (canvas = element)"
    />
    <header class="public-header">
      <span class="wordmark">EL DIRTO<span>®</span></span>
      <span class="location"><i /> Bajo el puente</span>
    </header>
    <SceneStatus :status="status" :error="error" :progress="progress" @retry="retry" />
  </main>
</template>

<style scoped>
.public-scene {
  position: relative;
  width: 100%;
  height: 100svh;
  min-height: 480px;
  overflow: hidden;
  background: var(--color-night);
  color: var(--color-paper);
}
.public-header {
  position: absolute;
  z-index: 1;
  inset: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 40px;
  background: linear-gradient(var(--color-night), var(--color-transparent));
  pointer-events: none;
}
.wordmark {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.06em;
}
.wordmark span {
  margin-left: 6px;
  color: var(--color-lime);
  font: 12px var(--font-mono);
  vertical-align: top;
}
.location {
  display: flex;
  align-items: center;
  gap: 8px;
  font: 12px var(--font-mono);
}
.location i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-lime);
}
@media (width < 800px) {
  .public-header {
    padding: 22px;
  }
  .wordmark {
    font-size: 24px;
  }
  .location {
    font-size: 10px;
  }
}
</style>
