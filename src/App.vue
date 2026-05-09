<template>
  <three-d/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import threeD from '@/components/threeD/threeD.vue'

export default defineComponent({
  name: 'App',
  components: {
    threeD
  },
  setup() {
    return {};
  }
});
</script>
