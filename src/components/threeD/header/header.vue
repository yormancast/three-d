<template>
  <section class="main-header row middle-xs">
    <div class="main-header-logo col-xs-12 col-sm">
      <img src="@/assets/img/logo.png" alt="logo">
    </div>
    <div class="main-header-nav col-xs-12 col-sm">
      <div class="row">
        <button
          :class="[{active : i.visible}, 'col-xs-3 main-header-nav-list primary']" 
          v-for="i in nav" 
          @click="navClickHandler(i)" 
          :key="i.title">
            {{ i.title }}.
          </button>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: "main-header",
  props: {
    nav: {
      type: Array,
      default: ()=> {return []}
    }
  },
  emits: ['navItemClicked'],
  setup(props, { emit }) {
    const navClickHandler = (navItem) => {
      emit('navItemClicked', navItem.name);
    }

    return {
      navClickHandler
    }
  },
});
</script>
