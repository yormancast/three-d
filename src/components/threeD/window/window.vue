<template>
  <section class="window-wrapper">
    <h2 class="window-wrapper-title"> {{ itemData.title }} </h2>
    <p class="window-wrapper-copy"> {{ itemData.copy }} </p>
  </section>
</template>

<script>
export default {
  name: 'window',
  props: {
    itemData: {
      type: Object,
      default: () => {return {}} 
    }
  }
};
</script>
