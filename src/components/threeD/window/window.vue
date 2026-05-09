<template>
  <section v-show="props.itemData.visible" class="window-wrapper row middle-xs">
    <h2 class="window-wrapper-title col-xs-12 col-sm-4"> {{ props.itemData.title }} </h2>
    <p class="window-wrapper-copy col-xs-12 col-sm-8"><span v-html="props.itemData.copy"></span></p>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'portfolioWindow',
  props: {
    itemData: {
      type: Object,
      default: () => ({
        visible: false,
        name: '',
        title: '',
        modelPosition: { x: 0, y: 0, z: 0 },
        copy: ''
      })
    }
  },
  setup(props) {
    return {
      props
    };
  }
});
</script>
