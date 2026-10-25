<script setup lang="ts">
import type { SectionId } from '@/content/sections'
import { sections } from '@/content/sections'

defineProps<{ selected: SectionId }>()
const emit = defineEmits<{ select: [id: SectionId] }>()
const buttons = new Map<SectionId, HTMLButtonElement>()
function setButton(id: SectionId, element: Element | null) {
  if (element instanceof HTMLButtonElement) buttons.set(id, element)
  else buttons.delete(id)
}
defineExpose({
  focus(id: SectionId) {
    buttons.get(id)?.focus()
  },
})
</script>

<template>
  <nav class="section-nav" aria-label="Portfolio sections">
    <button
      v-for="section in sections"
      :key="section.id"
      :ref="(element) => setButton(section.id, element as Element | null)"
      type="button"
      :aria-current="selected === section.id ? 'page' : undefined"
      @click="emit('select', section.id)"
    >
      {{ section.label }}
    </button>
  </nav>
</template>

<style scoped>
.section-nav {
  position: absolute;
  z-index: 2;
  right: 40px;
  top: 28px;
  display: flex;
  gap: 4px;
  max-width: calc(100% - 40px);
  padding: 5px;
  overflow-x: auto;
  scroll-padding-inline: 8px;
  border: 1px solid var(--color-border-chip);
  border-radius: 999px;
  background: var(--color-surface-nav);
  transform: none;
  scrollbar-width: none;
}
.section-nav::-webkit-scrollbar {
  display: none;
}
.section-nav button {
  flex: 0 0 auto;
  min-height: 44px;
  padding: 10px 12px;
  border: 0;
  border-radius: 3px;
  color: var(--color-nav-text);
  background: transparent;
  cursor: pointer;
  font: 0.6875rem var(--font-mono);
}
.section-nav button[aria-current='page'] {
  color: var(--color-on-accent);
  background: var(--color-lime);
  border-radius: 999px;
}
.section-nav button:focus-visible {
  outline: 2px solid var(--color-lime);
  outline-offset: 3px;
  scroll-margin-inline: 8px;
}
:global(.public-scene.layout-compact .section-nav) {
  position: relative;
  grid-row: 3;
  inset: auto;
  min-width: 0;
  max-width: 100%;
  justify-content: flex-start;
  transform: none;
}
:global(.public-scene.layout-compact .section-nav button) {
  padding: 10px;
  font-size: 0.625rem;
}
</style>
