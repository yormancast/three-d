<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import SceneStatus from '@/components/SceneStatus.vue'
import SceneViewport from '@/components/SceneViewport.vue'
import PortfolioIdentity from '@/components/PortfolioIdentity.vue'
import SectionCard from '@/components/SectionCard.vue'
import SectionNavigation from '@/components/SectionNavigation.vue'
import { useEnvironment } from '@/composables/useEnvironment'
import { usePortfolio } from '@/composables/usePortfolio'
import type { SectionId } from '@/content/sections'

const canvas = ref<HTMLCanvasElement | null>(null)
const {
  status,
  canvasVersion,
  projectedAnchor,
  stats,
  compactLayout,
  atmosphereEnabled,
  playing,
  togglePlayback,
  animationTime,
  activeAnimation,
  targetAnimation,
  transitioning,
  animationDuration,
  selectPresentation,
  retry,
} = useEnvironment(canvas)
const { selectedSection, activeCard, selectSection, closeSection } = usePortfolio(selectPresentation)
const navigation = ref<InstanceType<typeof SectionNavigation> | null>(null)
const card = ref<InstanceType<typeof SectionCard> | null>(null)
const root = ref<HTMLElement | null>(null)
const layoutTick = ref(0)
const connectorPath = ref('')
function updateConnector() {
  const host = root.value
  const section = card.value?.$el as HTMLElement | undefined
  const anchor = projectedAnchor.value
  if (!host || !section || !anchor?.visible || compactLayout.value) {
    connectorPath.value = ''
    return
  }
  const box = section.getBoundingClientRect()
  const hostBox = host.getBoundingClientRect()
  connectorPath.value = `M ${anchor.x * host.clientWidth} ${anchor.y * host.clientHeight} L ${box.left - hostBox.left} ${box.top - hostBox.top + 30}`
}
const posterUrl = `${import.meta.env.BASE_URL}models/continuous/preview.jpg`
const publicError = 'The 3D scene is unavailable on this device. You can still navigate the portfolio or try again.'
watch(activeCard, async (value, previous) => {
  layoutTick.value++
  if (!value) return
  await nextTick()
  if (previous || window.location.hash) card.value?.focus()
})
function refreshLayout() {
  layoutTick.value++
}
watch([layoutTick, projectedAnchor, activeCard], updateConnector, { flush: 'post' })
onMounted(() => window.addEventListener('resize', refreshLayout))
onMounted(async () => {
  if (window.location.hash && selectedSection.value !== 'home') {
    await nextTick()
    card.value?.focus()
  }
})
onBeforeUnmount(() => window.removeEventListener('resize', refreshLayout))
function close() {
  closeSection()
  void nextTick(() => navigation.value?.focus('home'))
}
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && activeCard.value) {
    event.preventDefault()
    close()
  }
}
function select(id: SectionId) {
  selectSection(id)
}
</script>

<template>
  <main ref="root" class="public-scene" :class="{ 'layout-compact': compactLayout }" @keydown="onKeydown">
    <SceneViewport
      :key="canvasVersion"
      language="en"
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
      <PortfolioIdentity />
    </header>
    <button
      v-if="status === 'ready'"
      class="playback-control"
      type="button"
      :aria-pressed="playing"
      :aria-label="playing ? 'Pause animations' : 'Play animations'"
      :title="playing ? 'Pause animations' : 'Play animations'"
      @click="togglePlayback"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path v-if="playing" d="M6 4h4v16H6zM14 4h4v16h-4z" />
        <path v-else d="m8 4 12 8-12 8z" />
      </svg>
    </button>
    <SectionNavigation ref="navigation" :selected="selectedSection" @select="select" />
    <SectionCard v-if="activeCard" ref="card" :section="activeCard" @close="close" @navigate="select" />
    <svg v-if="connectorPath" class="anchor-connector" aria-hidden="true">
      <path :d="connectorPath" />
      <circle
        :cx="projectedAnchor?.x ? projectedAnchor.x * 100 + '%' : '0%'"
        :cy="projectedAnchor?.y ? projectedAnchor.y * 100 + '%' : '0%'"
        r="5"
      />
    </svg>
    <SceneStatus language="en" :status="status" :error="publicError" @retry="retry" />
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
.anchor-connector {
  position: absolute;
  z-index: 1;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}
.anchor-connector path {
  fill: none;
  stroke: var(--color-lime);
  stroke-width: 1;
  opacity: 0.8;
}
.anchor-connector circle {
  fill: var(--color-lime);
  stroke: var(--color-anchor-ring);
  stroke-width: 8;
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
.playback-control {
  position: absolute;
  z-index: 2;
  top: 96px;
  left: 40px;
  display: grid;
  place-items: center;
  width: 44px;
  min-height: 44px;
  padding: 10px;
  border: 1px solid var(--color-border-chip);
  border-radius: 999px;
  color: var(--color-nav-text);
  background: var(--color-surface-nav);
  cursor: pointer;
}
.playback-control:focus-visible {
  outline: 2px solid var(--color-lime);
  outline-offset: 3px;
}
.public-scene.layout-compact {
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto auto;
  gap: 8px;
  padding: calc(148px + env(safe-area-inset-top)) calc(12px + env(safe-area-inset-right))
    calc(12px + env(safe-area-inset-bottom)) calc(12px + env(safe-area-inset-left));
}
.public-scene.layout-compact .public-header {
  padding: calc(22px + env(safe-area-inset-top)) calc(12px + env(safe-area-inset-right)) 22px
    calc(12px + env(safe-area-inset-left));
}
.public-scene.layout-compact .playback-control {
  top: calc(94px + env(safe-area-inset-top));
  left: calc(22px + env(safe-area-inset-left));
}
@media (height < 480px) {
  .public-scene {
    min-height: 100svh;
  }
}
</style>
