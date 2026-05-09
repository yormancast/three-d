<template>
   <section class="socials">
     <ul>
       <li
         v-for="link in links"
         :key="link.href"
         class="socials-icon"
       >
         <a :href="link.href" target="_blank" rel="noreferrer">
           <img :style="link.imageStyle" :src="link.imageSrc" :alt="link.alt">
         </a>
       </li>
     </ul>
   </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { socialLinks } from '@/content/portfolio';

export default defineComponent({
  name: 'socials',
  setup() {
    return {
      links: socialLinks
    };
  }
});
</script>
