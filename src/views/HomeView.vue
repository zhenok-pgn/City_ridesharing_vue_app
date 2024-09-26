<script lang="ts">
//import TheWelcome from '../components/TheWelcome.vue'
import { defineComponent } from 'vue'
import HereMap from '../components/HereMap.vue'
import AppNavigation from '../components/AppNavigation.vue'
//import RouteFilter from '@/components/RouteFilter.vue'

export default defineComponent({
  components: {
    HereMap,
    AppNavigation
  },
  methods: {
    goToRouteFilter() {
      this.$router.push({ name: 'route-filter' })
    }
  }
})
</script>

<template>
  <div>
    <button @click="goToRouteFilter">Filter</button>
  </div>
  <main>
    <HereMap :center="{ lat: 56.83061, lng: 53.235242 }" />
  </main>
  <AppNavigation />
</template>
