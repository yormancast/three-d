<template>
  <section v-show="itemData.visible" class="window-wrapper row middle-xs">
    <h2 class="window-wrapper-title col-xs-12 col-sm-4"> {{ itemData.title }} </h2>
    <p class="window-wrapper-copy col-xs-12 col-sm-8"><span v-html="itemData.copy"></span></p>
  </section>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'window',
  props: {
    itemData: {
      type: Object,
      default: () => {return {}} 
    }
  },
  setup() {
    return {}
  }
});
</script>
