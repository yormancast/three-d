<template>
  <section class="model-3d">
    <div class="model" ref="model"></div>
  </section>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { createPortfolioScene } from '@/libs/three/createPortfolioScene';
import { portfolioSceneConfig, portfolioSections } from '@/content/portfolio';

export default defineComponent({
  name: 'model3d',
  props: {
    activeSection: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const model = ref<HTMLElement | null>(null);
    let sceneController: any = null;

    const handleResize = () => sceneController?.resize();

    onMounted(() => {
      if (!model.value) return;
      sceneController = createPortfolioScene(model.value, portfolioSceneConfig);
      window.addEventListener('resize', handleResize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize);
      sceneController = null;
    });

    watch(
      () => props.activeSection,
      (sectionName) => {
        const animationName = portfolioSections.find(s => s.name === sectionName)?.animationName ?? 'idle';
        sceneController?.playAnimation(animationName);
      }
    );

    return { model };
  }
});
</script>
