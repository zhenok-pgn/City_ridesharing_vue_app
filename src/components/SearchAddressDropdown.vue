<script lang="ts">
import { defineComponent } from 'vue'
import geocoder from '@/utils/geocoder'

export default defineComponent({
  name: 'SearchAddressDropdown',
  data() {
    return {
      query: '',
      searchResult: [] as { id: number; data: any }[],
      timer: -1
    }
  },
  async mounted() {},
  methods: {
    searchResultClick(selectedId: number) {
      this.query = this.searchResult[selectedId].data.name

      this.searchResult = []
    },
    onkeyup() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = setTimeout(this.geocodeCallBack, 1000)
      } else {
        this.timer = setTimeout(this.geocodeCallBack, 1000)
      }
    },
    geocodeCallBack() {
      if (this.query.length == 0) {
        this.searchResult = []
        return
      }
      geocoder.geocode(this.query, (resultArray: any) => {
        console.log('searched')
        this.searchResult = []
        for (let i = 0; i < resultArray.length; i++) {
          this.searchResult.push({ id: i, data: resultArray[i] })
        }
      })
    }
  }
})
</script>

<template>
  <div>
    <input type="text" placeholder="Search User" v-model="query" @keyup="onkeyup" />
    <div class="list" v-if="searchResult.length > 0">
      <ul v-for="adr in searchResult" :key="adr.id">
        <li @click="searchResultClick(adr.id)">
          {{ adr.data.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style></style>
