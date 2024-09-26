<script lang="ts">
import { defineComponent } from 'vue'
import HereMap from '../components/HereMap.vue'

export default defineComponent({
  props: {
    typePage: String
  },
  data() {
    return {
      addressTitle: '',
      position: ''
    }
  },
  components: {
    HereMap
  },
  methods: {
    goToRouteFilter() {
      this.$router.push({ name: 'route-filter' })
    }
  }
})
</script>

<template>
  <h1 v-if="typePage == 'from'">Откуда</h1>
  <h1 v-else>Куда</h1>
  <HereMap
    @address-selected="
      (addr) => {
        addressTitle = addr.title
        position = addr.position
      }
    "
  />
  <div>
    <input type="text" :value="addressTitle" />
    <button @click="goToRouteFilter">apply</button>
  </div>
</template>

<style></style>
