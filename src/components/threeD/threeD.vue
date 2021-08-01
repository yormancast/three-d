<template>
  <section class="three-d">
    <main-header/>
    <model-3d/>
  </section>
</template>

<script>
import model3d from './model3D/model3d.vue';
import mainHeader from './header/header.vue'

export default {
  name:'threeD',
  components: { model3d, mainHeader },
  
};
</script>

<style lang="scss">
  @import '@/styles/global';
</style>