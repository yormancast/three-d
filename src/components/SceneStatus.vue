<script setup lang="ts">
withDefaults(
  defineProps<{
    language?: 'en' | 'es'
    status: 'loading' | 'ready' | 'error'
    error: string
  }>(),
  { language: 'es' },
)

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <section v-if="status !== 'ready'" class="load-panel" aria-live="polite">
    <template v-if="status === 'loading'">
      <p>{{ language === 'en' ? 'Entering the court' : 'Entrando al barrio' }}</p>
      <progress max="100" :aria-label="language === 'en' ? 'Scene loading' : 'Carga de la escena'" />
    </template>
    <template v-else>
      <p>{{ error }}</p>
      <button type="button" @click="emit('retry')">{{ language === 'en' ? 'Try again' : 'Volver a intentar' }}</button>
    </template>
  </section>
</template>

<style scoped>
.load-panel {
  position: absolute;
  z-index: 1;
  top: 160px;
  left: 40px;
  width: min(80%, 340px);
  padding: 24px;
  background: var(--color-surface-card);
  border: 1px solid var(--color-border-card);
  border-radius: var(--radius-card);
  backdrop-filter: blur(var(--blur-card));
  text-align: center;
}
.load-panel p {
  margin: 0 0 16px;
  font-size: 0.875rem;
}
progress {
  width: 100%;
  accent-color: var(--color-lime);
  height: 5px;
}
button {
  min-height: 44px;
  cursor: pointer;
  border: 0;
  border-radius: 3px;
  padding: 12px 14px;
  color: var(--color-on-accent);
  background: var(--color-lime);
  font: 0.75rem var(--font-sans);
}
button:focus-visible {
  outline: 2px solid var(--color-lime);
  outline-offset: 4px;
}
:global(.public-scene.layout-compact .load-panel) {
  position: relative;
  grid-row: 2;
  inset: auto;
  width: 100%;
  max-height: 30svh;
  overflow-y: auto;
  padding: 12px;
}
</style>
