<script lang="ts">
//import TheWelcome from '../components/TheWelcome.vue'
import { defineComponent } from 'vue'
import HereMap from '@/components/HereMap.vue'

export default defineComponent({
  components: {
    HereMap
  }
})
</script>

<template>
  <main>
    <HereMap />
  </main>
</template>
