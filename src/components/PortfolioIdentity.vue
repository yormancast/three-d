<script setup lang="ts">
import { portfolio } from '@/content/portfolio'
</script>

<template>
  <div class="brand">
    <span class="wordmark" aria-hidden="true">{{ portfolio.wordmark }}</span>
    <span class="brand-name">{{ portfolio.name }}</span>
  </div>
</template>

<style scoped>
.brand {
  display: grid;
  gap: 3px;
}
.wordmark {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 900;
  font-stretch: 120%;
  letter-spacing: -0.035em;
}
.brand-name {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
:global(.public-scene.layout-compact .wordmark) {
  font-size: 1.875rem;
}
:global(.environment-review.layout-compact .wordmark) {
  font-size: 1.5rem;
}
</style>
