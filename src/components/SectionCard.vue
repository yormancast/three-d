<script setup lang="ts">
import { ref } from 'vue'
import { sectionById } from '@/content/sections'
import type { PortfolioSection, SectionId } from '@/content/sections'

defineProps<{ section: PortfolioSection }>()
defineEmits<{ close: []; navigate: [id: SectionId] }>()
const heading = ref<HTMLHeadingElement | null>(null)
const card = ref<HTMLElement | null>(null)
defineExpose({ focus: () => (heading.value ?? card.value)?.focus() })
</script>

<template>
  <section ref="card" class="section-card" tabindex="-1" aria-live="polite" :aria-label="section.label">
    <div class="card-heading">
      <div>
        <p class="card-kicker">{{ section.label }}</p>
        <h1 v-if="section.title" ref="heading" tabindex="-1">{{ section.title }}</h1>
      </div>
      <button class="close-card" type="button" aria-label="Close section" @click="$emit('close')">×</button>
    </div>
    <p v-if="section.id === 'bio' && section.body" class="card-body">{{ section.body }}</p>
    <ul v-if="section.id === 'bio' && section.chips?.length" class="card-chips" aria-label="Core technologies">
      <li v-for="chip in section.chips" :key="chip">{{ chip }}</li>
    </ul>
    <ol v-if="section.id === 'projects' && section.projects.length" class="content-list" aria-label="Selected projects">
      <li v-for="project in section.projects" :key="project.id" class="content-item">
        <article>
          <h2>{{ project.title }}</h2>
          <p class="card-body">{{ project.description }}</p>
          <p v-if="project.contribution" class="card-body">{{ project.contribution }}</p>
          <ul v-if="project.technologies.length" class="card-chips" aria-label="Technologies">
            <li v-for="technology in project.technologies" :key="technology">{{ technology }}</li>
          </ul>
          <ul v-if="project.links.length" class="card-links">
            <li v-for="link in project.links" :key="link.href">
              <a :href="link.href">{{ link.label }}</a>
            </li>
          </ul>
        </article>
      </li>
    </ol>
    <ol
      v-else-if="section.id === 'experience' && section.experience.length"
      class="content-list"
      aria-label="Experience"
    >
      <li v-for="item in section.experience" :key="item.id" class="content-item">
        <article>
          <h2>{{ item.role }}</h2>
          <p v-if="item.organization" class="item-organization">{{ item.organization }}</p>
          <p v-if="item.period" class="item-period">{{ item.period.label }}</p>
          <p class="card-body">{{ item.description }}</p>
          <ul v-if="item.technologies.length" class="card-chips" aria-label="Technologies">
            <li v-for="technology in item.technologies" :key="technology">{{ technology }}</li>
          </ul>
        </article>
      </li>
    </ol>
    <p v-if="section.id === 'contact' && section.body" class="card-body">{{ section.body }}</p>
    <ul v-if="section.id === 'contact' && section.links.length" class="card-links">
      <li v-for="link in section.links" :key="link.href">
        <a :href="link.href">{{ link.label }}</a>
      </li>
    </ul>
    <button
      v-if="section.nextSection"
      class="next-section"
      type="button"
      @click="$emit('navigate', section.nextSection)"
    >
      Next: {{ sectionById[section.nextSection].label }} →
    </button>
  </section>
</template>

<style scoped>
.section-card {
  position: absolute;
  z-index: 2;
  bottom: 96px;
  right: 40px;
  width: min(360px, calc(100% - 80px));
  max-height: calc(100svh - 180px);
  overflow-y: auto;
  overscroll-behavior: contain;
  scroll-padding: 16px;
  padding: 22px;
  border: 1px solid var(--color-border-card);
  border-radius: var(--radius-card);
  background: var(--color-surface-card);
  box-shadow: 0 12px 36px var(--color-shadow-card);
  backdrop-filter: blur(var(--blur-card));
}
.card-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.card-kicker {
  margin: 0 0 8px;
  color: var(--color-lime);
  font: 0.625rem var(--font-mono);
  text-transform: uppercase;
}
h1 {
  margin: 0;
  color: var(--color-paper-bright);
  overflow-wrap: anywhere;
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  line-height: 1.05;
}
h1:focus {
  outline: 2px solid var(--color-lime);
  outline-offset: 4px;
}
.close-card {
  flex: 0 0 44px;
  width: 44px;
  min-height: 44px;
  border: 1px solid var(--color-border-chip);
  border-radius: 50%;
  color: var(--color-nav-text);
  background: transparent;
  cursor: pointer;
  font-size: 1.375rem;
  line-height: 1;
}
.card-body {
  margin: 14px 0 0;
  color: var(--color-paper-muted);
  line-height: 1.5;
  overflow-wrap: anywhere;
}
.card-links {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}
.content-list {
  display: grid;
  gap: 18px;
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
}
.content-item + .content-item {
  padding-top: 18px;
  border-top: 1px solid var(--color-border-chip);
}
.content-item h2 {
  margin: 0;
  color: var(--color-paper-bright);
  font-size: 1.125rem;
  overflow-wrap: anywhere;
  line-height: 1.2;
}
.item-organization,
.item-period {
  margin: 6px 0 0;
  color: var(--color-paper-muted);
  font: 0.75rem var(--font-mono);
}
.card-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}
.card-chips li {
  padding: 5px 9px;
  border: 1px solid var(--color-border-chip);
  border-radius: 999px;
  color: var(--color-paper);
  font: 0.6875rem var(--font-mono);
  overflow-wrap: anywhere;
}
.card-links li {
  min-width: 0;
  max-width: 100%;
}
.card-links a {
  display: inline-flex;
  min-height: 44px;
  max-width: 100%;
  align-items: center;
  color: var(--color-lime);
  overflow-wrap: anywhere;
}
.next-section {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  margin-top: 20px;
  padding: 8px 0;
  border: 0;
  color: var(--color-lime);
  background: transparent;
  cursor: pointer;
  font: 0.75rem var(--font-mono);
  text-align: left;
}
.close-card:focus-visible,
.card-links a:focus-visible,
.next-section:focus-visible {
  outline: 2px solid var(--color-lime);
  outline-offset: 3px;
}
:where(.card-links a, .next-section, .close-card):focus-visible {
  scroll-margin-block: 12px;
}
:global(.public-scene.layout-compact .section-card) {
  position: relative;
  grid-row: 1;
  align-self: end;
  inset: auto;
  width: auto;
  min-height: 0;
  max-height: 100%;
  padding: 18px;
}
</style>
