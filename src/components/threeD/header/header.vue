<template>
  <section class="header">
    <div class="header-logo"></div>
    <div class="header-nav">
      <ul>
        <li v-for="i in nav" @click="navClickHandler(i)" :key="i.title">{{ i.title }}</li>
      </ul>
    </div>

  </section>
</template>

<script>
export default {
  name: "header",
  data() {
    return {
      nav: [
        {
          title: "Bio",
          modelPosition: [0,0,0]
        },
        {
          title: "Link 2",
          modelPosition: [0,0,0]
        },
        {
          title: "Link 3",
          modelPosition: [0,0,0]
        },
        {
          title: "Contact",
          modelPosition: [0,0,0]
        }
      ]
    }
  },
};
</script>

<style lang="scss" scoped>
</style>