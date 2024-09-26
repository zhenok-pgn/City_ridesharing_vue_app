<script lang="ts">
import { defineComponent } from 'vue'
import HereMap from '../components/HereMap.vue'
export default defineComponent({
  props: {
    routeId: String
  },
  components: {
    HereMap
  },
  methods: {}
})
</script>

<template>
  <HereMap :center="{ lat: 56.83061, lng: 53.235242 }" />
  <div>{{ console.log(routeId) }}</div>
</template>
