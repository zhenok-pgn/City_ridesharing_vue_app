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
    <HereMap :center="{ lat: 56.83061, lng: 53.235242 }" />
  </main>
</template>
