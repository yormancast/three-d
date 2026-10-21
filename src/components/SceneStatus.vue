<script setup lang="ts">
defineProps<{
  status: 'loading' | 'ready' | 'error'
  error: string
  progress: number
}>()

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <section v-if="status !== 'ready'" class="load-panel" aria-live="polite">
    <template v-if="status === 'loading'">
      <p>Entrando al barrio</p>
      <progress :value="progress" max="100" aria-label="Carga de la escena" />
    </template>
    <template v-else>
      <p>{{ error }}</p>
      <button type="button" @click="emit('retry')">Volver a intentar</button>
    </template>
  </section>
</template>

<style scoped>
.load-panel {
  position: absolute;
  z-index: 1;
  top: 46%;
  left: 50%;
  transform: translate(-50%, -50%);
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
  font-size: 14px;
}
progress {
  width: 100%;
  accent-color: var(--color-lime);
  height: 5px;
}
button {
  cursor: pointer;
  border: 0;
  border-radius: 3px;
  padding: 12px 14px;
  color: var(--color-on-accent);
  background: var(--color-lime);
  font: 12px var(--font-sans);
}
button:focus-visible {
  outline: 2px solid var(--color-lime);
  outline-offset: 4px;
}
</style>
