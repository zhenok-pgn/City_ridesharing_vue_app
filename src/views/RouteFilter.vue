<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    goToFindAddressView(param: string) {
      this.$router.push({ name: 'find-address', params: { typePage: param } })
    }
  }
})
</script>

<template>
  <div class="greetings">
    <h1 class="green">filter</h1>
    <h6>from</h6>
    <input @click="goToFindAddressView('from')" type="text" />
    <h6>to</h6>
    <input @click="goToFindAddressView('to')" type="text" />
    <h6>date</h6>
    <input type="text" />
    <h6>passengers amount</h6>
    <input type="text" />
    <button>apply</button>
  </div>
</template>

<style></style>
