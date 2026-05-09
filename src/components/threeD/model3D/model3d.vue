<template>
  <section class="model-3d">
    <div class="model" ref="model"></div>
  </section>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { createPortfolioScene } from '@/libs/three/createPortfolioScene';
import { portfolioSceneConfig } from '@/content/portfolio';

export default defineComponent({
  name: 'model3d',
  props: {
    cameraPosition: {
      type: Object,
      default: null
    },
    activeAnimation: {
      type: String,
      default: null
    }
  },
  setup(props) {
    const model = ref<HTMLElement | null>(null);
    let sceneController: any = null;

    const handleResize = () => {
      sceneController?.resize();
    };

    onMounted(() => {
      if (!model.value) {
        return;
      }

      sceneController = createPortfolioScene(model.value, portfolioSceneConfig);
      window.addEventListener('resize', handleResize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize);
      sceneController?.destroy();
      sceneController = null;
    });

    watch(
      () => props.cameraPosition,
      (newValue) => {
        if (newValue) {
          sceneController?.animateCamera(newValue);
        }
      }
    );

    watch(
      () => props.activeAnimation,
      (newValue) => {
        if (newValue) {
          sceneController?.playAnimation(newValue);
        }
      }
    );

    return {
      model
    };
  }
});
</script>
