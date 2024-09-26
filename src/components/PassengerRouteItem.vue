<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    routeId: Number
  },
  components: {},
  methods: {
    goToPassengerRouteItemInfo() {
      this.$router.push({ name: 'passenger-routes-item-info' })
    }
  }
})
</script>

<template>
  <div @click="goToPassengerRouteItemInfo">{{ routeId }}</div>
</template>
