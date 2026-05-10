<template>
  <section class="three-d">
    <header class="portfolio-chrome" aria-label="Site identity">
      <a class="portfolio-mark" href="/" aria-label="Yorman Castellanos home">YC</a>
      <span class="portfolio-status" aria-hidden="true"></span>
    </header>

    <Model3d />

    <div class="portfolio-hero" aria-label="Portfolio introduction">
      <p class="portfolio-hero__eyebrow">Building interactive 3D commerce systems</p>
      <h1>Yorman Castellanos</h1>
      <p class="portfolio-hero__role">Frontend Technical Lead</p>

      <nav class="portfolio-nav" aria-label="Portfolio navigation">
        <button
          v-for="section in sections"
          :key="section.name"
          :class="{ 'is-active': activeSection === section.name }"
          type="button"
          @click="openSection(section.name)"
        >
          {{ section.title }}
        </button>
      </nav>
    </div>
    <PortfolioWindow :active-window-name="activeSection" />
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Model3d from './model3D/model3d.vue';
import PortfolioWindow from './window/window.vue';
import { portfolioSections } from '@/content/portfolio';
import type { PortfolioSection } from '@/definitions/portfolio';

export default defineComponent({
  name:'threeD',
  components: { Model3d, PortfolioWindow },
  setup() {
    const activeSection = ref('');
    const sections = ref<PortfolioSection[]>(
      portfolioSections.map((section) => ({ ...section }))
    );
    const openSection = (sectionName: string) => {
      activeSection.value = activeSection.value === sectionName ? '' : sectionName;
    };

    return {
      activeSection,
      openSection,
      sections
    };
  }
});
</script>

<style lang="scss">
  @use '@/styles/global';
</style>
