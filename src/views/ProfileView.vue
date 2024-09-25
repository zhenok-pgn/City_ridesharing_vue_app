<script setup lang="ts">
import { ref } from 'vue'
const profileName = ref('Eugeniy')
</script>

<template>
  <h2>{{ profileName }}</h2>
  <button>Edit account info</button>
  <button>Exit</button>
</template>
