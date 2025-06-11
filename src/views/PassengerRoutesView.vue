<script lang="ts">
//import TheWelcome from '../components/TheWelcome.vue'
import { defineComponent } from 'vue'
import HereMap from '../components/HereMap.vue'
import AppNavigation from '../components/AppNavigation.vue'

interface RouteInfo {
  id: number
  name: string
}

export default defineComponent({
  data() {
    return {
      routes: [{} as RouteInfo]
    }
  },
  async mounted() {
    this.routes = this.getAvalibleRoutes()
  },
  components: {
    AppNavigation
  },
  methods: {
    goToRouteFilter() {
      this.$router.push({ name: 'route-filter' })
    },
    goToPassengerRouteItemInfo(route: RouteInfo) {
      this.$router.push({ path: `passenger-routes-item-info/${route.id}` })
    },
    getAvalibleRoutes(): RouteInfo[] {
      let routes: RouteInfo[] = [
        { id: 1, name: 'First' },
        { id: 2, name: 'Second' }
      ]
      return routes
    }
  }
})
</script>

<template>
  <div>
    <div>Date</div>
    <div>From</div>
    <div>To</div>
    <button @click="goToRouteFilter">Filter</button>
  </div>
  <main v-for="route in routes" :key="route.id">
    <div @click="goToPassengerRouteItemInfo(route)">
      <h3>{{ route.name }}</h3>
    </div>
    <!-- <PassengerRouteItem v-for="route in routes" :key="route.id" :routeName="route.name" /> -->
    <!-- <HereMap :center="{ lat: 56.83061, lng: 53.235242 }" /> -->
  </main>
  <AppNavigation />
</template>
