<template>
  <section
    v-show="isVisible"
    :class="['window-wrapper row middle-xs', { isVisible }]"
  >
    <h2 class="window-wrapper-title col-xs-12 col-sm-4"> {{ activeWindow.title }} </h2>
    <p class="window-wrapper-copy col-xs-12 col-sm-8"><span v-html="activeWindow.copy"></span></p>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { portfolioSections } from '@/content/portfolio';

export default defineComponent({
  name: 'portfolioWindow',
  props: {
    activeWindowName: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const activeWindow = computed(() => (
      portfolioSections.find((section) => section.name === props.activeWindowName) || {
        name: '',
        title: '',
        copy: ''
      }
    ));
    const isVisible = computed(() => Boolean(props.activeWindowName && activeWindow.value.name));

    return {
      activeWindow,
      isVisible
    };
  }
});
</script>
