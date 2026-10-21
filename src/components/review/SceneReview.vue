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
  activeView,
  views,
  stats,
  selectView,
  atmosphereEnabled,
  toggleAtmosphere,
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
  retry,
} = useEnvironment(canvas)
const posterUrl = `${import.meta.env.BASE_URL}models/continuous/preview.jpg`
</script>

<template>
  <main class="environment-review">
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
    <header class="review-header">
      <div class="wordmark">EL DIRTO<span>®</span></div>
      <div class="review-context">
        <span class="status-dot" />Bajo el puente<span class="review-phase">Del descanso al juego</span>
      </div>
      <button class="atmosphere-toggle" type="button" :aria-pressed="atmosphereEnabled" @click="toggleAtmosphere">
        Atmósfera
      </button>
    </header>
    <nav v-if="status === 'ready'" class="animation-controls" aria-label="Animaciones del personaje">
      <button
        v-for="animation in animations"
        :key="animation.id"
        type="button"
        :aria-pressed="targetAnimation === animation.id"
        @click="selectAnimation(animation.id)"
      >
        {{ animation.label }}
      </button>
    </nav>
    <div v-if="status === 'ready'" class="playback-controls">
      <button type="button" @click="togglePlayback">{{ playing ? 'Pausar' : 'Reproducir' }}</button>
      <input
        aria-label="Momento de la animación"
        type="range"
        min="0"
        :max="animationDuration"
        step="0.04"
        :value="animationTime"
        :disabled="transitioning"
        @input="seekAnimation"
      />
      <output>{{ animationTime.toFixed(1) }} / {{ animationDuration.toFixed(2) }} s</output>
    </div>
    <p v-if="status === 'ready' && transitioning" class="transition-status" aria-live="polite">
      {{ playing ? transitionLabel : 'Reproduce para continuar el cambio' }}
    </p>
    <SceneStatus :status="status" :error="error" :progress="progress" @retry="retry" />
    <footer class="review-footer">
      <div class="scene-caption">
        <span>01 / NOCHE</span>
        <p>Una pausa<br />bajo el puente.</p>
      </div>
      <nav class="camera-nav" aria-label="Puntos de vista de la escena">
        <button
          v-for="(view, index) in views"
          :key="view.id"
          type="button"
          :aria-pressed="activeView === view.id"
          @click="selectView(view.id)"
        >
          <span>0{{ index + 1 }}</span
          >{{ view.label }}
        </button>
      </nav>
      <span class="review-note">{{
        animations.find((animation) => animation.id === activeAnimation)?.description
      }}</span>
    </footer>
  </main>
</template>

<style scoped>
.environment-review {
  position: relative;
  width: 100%;
  height: 100svh;
  min-height: 480px;
  overflow: hidden;
  background: var(--color-night);
  color: var(--color-paper);
}
.review-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 28px 40px;
  display: flex;
  justify-content: space-between;
  align-items: start;
  background: linear-gradient(var(--color-night), var(--color-transparent));
  pointer-events: none;
}
.atmosphere-toggle {
  pointer-events: auto;
  position: absolute;
  right: 40px;
  top: 78px;
  border: 1px solid var(--color-border-chip);
  padding: 8px 12px;
  font: 10px var(--font-mono);
  background: var(--color-surface-nav);
}
.animation-controls {
  position: absolute;
  right: 40px;
  top: 124px;
  display: flex;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--color-border-chip);
  border-radius: var(--radius-card);
  background: var(--color-surface-nav);
}
.playback-controls {
  position: absolute;
  right: 40px;
  top: 178px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border: 1px solid var(--color-border-chip);
  border-radius: var(--radius-card);
  background: var(--color-surface-nav);
  font: 10px var(--font-mono);
}
.playback-controls input {
  width: 100px;
  accent-color: var(--color-lime);
}
.playback-controls button {
  padding: 6px;
  min-width: 76px;
}
.transition-status {
  position: absolute;
  top: 218px;
  right: 40px;
  font: 11px var(--font-mono);
  color: var(--color-paper-muted);
}
.wordmark {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.06em;
}
.wordmark span {
  color: var(--color-lime);
  font: 12px var(--font-mono);
  margin-left: 6px;
  vertical-align: top;
}
.review-context {
  font: 12px var(--font-mono);
  display: grid;
  grid-template-columns: 8px auto;
  gap: 8px;
}
.status-dot {
  width: 6px;
  height: 6px;
  background: var(--color-lime);
  border-radius: 50%;
  align-self: center;
}
.review-phase {
  grid-column: 2;
  font-size: 10px;
  color: var(--color-paper-muted);
}
.review-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 50px 40px 26px;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  background: linear-gradient(var(--color-transparent), var(--color-night));
  pointer-events: none;
}
.scene-caption span,
.review-note {
  font: 10px var(--font-mono);
  color: var(--color-paper-muted);
}
.scene-caption p {
  margin: 9px 0 0;
  font-size: 25px;
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.04em;
}
.camera-nav {
  display: flex;
  border: 1px solid var(--color-border-chip);
  border-radius: var(--radius-card);
  background: var(--color-surface-nav);
  padding: 5px;
  pointer-events: auto;
}
button {
  cursor: pointer;
  border: 0;
  border-radius: 3px;
  padding: 12px 14px;
  color: var(--color-paper);
  background: var(--color-transparent);
  font: 12px var(--font-sans);
}
button span {
  display: block;
  margin-bottom: 4px;
  font: 9px var(--font-mono);
  opacity: 0.6;
}
button[aria-pressed='true'],
.load-panel button {
  color: var(--color-on-accent);
  background: var(--color-lime);
}
button:focus-visible {
  outline: 2px solid var(--color-lime);
  outline-offset: 4px;
}
@media (width < 800px) {
  .review-header {
    padding: 22px;
  }
  .atmosphere-toggle {
    pointer-events: auto;
    position: absolute;
    right: 40px;
    top: 78px;
    border: 1px solid var(--color-border-chip);
    padding: 8px 12px;
    font: 10px var(--font-mono);
    background: var(--color-surface-nav);
  }
  .animation-controls {
    inset: auto 16px 132px;
    justify-content: space-between;
    gap: 0;
  }
  .animation-controls button {
    padding: 12px 6px;
    font-size: 11px;
  }
  .playback-controls {
    inset: auto 16px 86px;
    justify-content: space-between;
  }
  .transition-status {
    inset: auto 16px 180px;
    text-align: right;
  }
  .scene-caption {
    display: none;
  }
  .wordmark {
    font-size: 24px;
  }
  .review-context {
    font-size: 10px;
  }
  .review-phase {
    max-width: 130px;
    line-height: 1.5;
  }
  .review-footer {
    padding: 50px 16px 20px;
    flex-direction: column;
    align-items: start;
    gap: 16px;
  }
  .scene-caption p {
    font-size: 22px;
  }
  .camera-nav {
    width: 100%;
    justify-content: space-between;
  }
  .camera-nav button {
    padding: 10px 9px;
    font-size: 11px;
  }
  .review-note {
    display: none;
  }
}
</style>
