<template>
  <section class="three-d">
    <main-header :nav="sections" @navItemClicked="handleNavClickEvent" />
    <model-3d :cameraPosition="cameraPOV" :activeAnimation="activeAnimation"/>
    <window :class="{ isVisible :  section.visible }" v-for="section in sections" :key="section.title" :itemData="section" />
    <socials />
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import model3d from './model3D/model3d.vue';
import mainHeader from './header/header.vue';
import window from './window/window.vue';
import socials from './socials/socials.vue';
import { portfolioSections } from '@/content/portfolio';
import type { CameraPosition, PortfolioSection } from '@/definitions/portfolio';

export default defineComponent({
  name:'threeD',
  components: { model3d, mainHeader, window, socials },
  setup() {
    const cameraPOV = ref<CameraPosition | null>(null);
    const activeAnimation = ref<string | null>(null);
    const sections = ref<PortfolioSection[]>(
      portfolioSections.map((section) => ({ ...section }))
    );

    const updateCamera = (position: CameraPosition) => {
      cameraPOV.value = position;
    };

    const updateAnimation = (animationName: string) => {
      activeAnimation.value = animationName;
    };

    const getNavItem = (itemName: string) => {
      return sections.value.find((section) => {
        return section.name === itemName;
      });
    };

    const resetVisibility = () => {
      sections.value.forEach((element) => {
        element.visible = false;
      });
    };

    const handleNavClickEvent = (itemClicked: string) => {
      const currentNavItem = getNavItem(itemClicked);

      if (!currentNavItem) {
        return;
      }

      updateCamera(currentNavItem.modelPosition);
      updateAnimation(currentNavItem.sceneAnimation);
      resetVisibility();
      currentNavItem.visible = true;
    };

    return {
      activeAnimation,
      cameraPOV,
      sections,
      handleNavClickEvent
    };
  }
});
</script>

<style lang="scss">
  @use '@/styles/global';
</style>
