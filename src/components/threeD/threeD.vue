<template>
  <section class="three-d">
    <model-3d/>
  </section>
</template>

<script>
import model3d from './model3D/model3d.vue';

export default {
  name:'threeD',
  components: { model3d },
  
};
</script>

<style lang="scss" scoped>
  @import '@/styles/global';
</style>