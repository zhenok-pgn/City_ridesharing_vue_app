<script setup lang="ts">
import { ref } from 'vue'
import AppNavigation from '../components/AppNavigation.vue'
const profileName = ref('Eugeniy')
</script>

<template>
  <header>
    <h2>{{ profileName }}</h2>
  </header>
  <main>
    <button>Edit account info</button>
    <button>Exit</button>
  </main>
  <AppNavigation />
</template>
