<template>
  <section class="window-wrapper row middle-xs">
    <h2 class="window-wrapper-title col-sm-4"> {{ itemData.title }} </h2>
    <p class="window-wrapper-copy col-sm-8"> <span>{{ itemData.copy }} </span></p>
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
