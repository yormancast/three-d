<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import PublicScene from '@/components/PublicScene.vue'

const showReview = import.meta.env.DEV && new URLSearchParams(window.location.search).get('review') === '1'

const ActiveExperience = showReview
  ? defineAsyncComponent(() => import('@/components/review/SceneReview.vue'))
  : PublicScene
</script>

<template>
  <component :is="ActiveExperience" />
</template>
