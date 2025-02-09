<!--Компонент поиска адреса с выпадающим списком -->

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import geocoder from '@/utils/geocoder'
import { type ISelectedAddress } from '@/interfaces/ISelectedAddress'

export default defineComponent({
  name: 'SearchAddressDropdown',
  props: {
    modelValue: {
      type: Object as PropType<ISelectedAddress>,
      default: () => ({}) as ISelectedAddress
    },
    placeholder: {
      type: String,
      default: 'Введите адрес'
    },
    value: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      query: '',
      geocoderSearchResult: [] as { id: number; data: any }[],
      timer: -1
    }
  },
  emits: {
    'update:modelValue'(addr: ISelectedAddress) {
      return addr != null
    }
  },
  mounted() {
    if (this.value != null) {
      this.query = this.value
    }
  },
  methods: {
    searchResultClick(selectedId: number) {
      const selectedAddress: ISelectedAddress = {
        properties: this.geocoderSearchResult[selectedId].data.properties,
        position: this.geocoderSearchResult[selectedId].data.center
      }

      this.query = this.geocoderSearchResult[selectedId].data.name
      this.$emit('update:modelValue', selectedAddress)

      this.geocoderSearchResult = []
    },
    onkeyup() {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(this.geocodeCallBack, 1000)
    },
    geocodeCallBack() {
      if (this.query.length === 0) {
        this.geocoderSearchResult = []
        return
      }
      geocoder.geocode(this.query, (resultArray: any) => {
        this.geocoderSearchResult = resultArray.map((result: any, index: number) => ({
          id: index,
          data: result
        }))
      })
    }
  }
})
</script>

<template>
  <div>
    <input type="text" :placeholder="placeholder" v-model="query" @keyup="onkeyup" required />
    <div class="list" v-if="geocoderSearchResult.length > 0">
      <ul>
        <li v-for="adr in geocoderSearchResult" :key="adr.id" @click="searchResultClick(adr.id)">
          {{ adr.data.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style></style>
