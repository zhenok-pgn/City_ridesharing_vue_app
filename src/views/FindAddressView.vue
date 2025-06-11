<script lang="ts">
import { defineComponent } from 'vue'
import HereMap from '../components/HereMap.vue'
import OSM from '../components/OSM.vue'
import SearchAddressDropdown from '@/components/SearchAddressDropdown.vue'

interface SelectedAddress {
  title: string
  position: string
}

export default defineComponent({
  props: {
    typePage: String
  },
  emits: {
    addressSelected(addr: SelectedAddress) {
      return addr != null
    }
  },
  data() {
    return {
      addressTitle: '',
      position: '',
      address: {} as SelectedAddress
    }
  },
  components: {
    HereMap,
    OSM,
    SearchAddressDropdown
  },
  methods: {
    returnSelectedAddress() {
      //this.$router.push({ name: 'route-filter' })
      this.$emit('addressSelected', this.address)
    }
  }
})
</script>

<template>
  <!-- <h1 v-if="typePage == 'from'">Откуда</h1>
  <h1 v-else>Куда</h1> -->
  <slot>sample text</slot>
  <!-- <HereMap
    @address-selected="
      (addr) => {
        address = addr
      }
    "
  /> -->
  <div>
    <input type="text" :value="address.title" />
    <button @click="returnSelectedAddress">apply</button>
  </div>

  <SearchAddressDropdown />
  <OSM />
</template>

<style></style>
