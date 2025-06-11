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
      timer: -1,
      isMenuOpen: false,
      rules: {
        required: (value: string) => !!value || 'Поле обязательно для заполнения'
      }
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

      console.log(this.geocoderSearchResult[selectedId].data)
      this.query = this.geocoderSearchResult[selectedId].data.name
      this.$emit('update:modelValue', selectedAddress)

      this.geocoderSearchResult = []
      this.isMenuOpen = false
    },
    onkeyup() {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(this.geocodeCallBack, 1000)
    },
    geocodeCallBack() {
      console.log(this.query)
      if (this.query.length === 0) {
        this.geocoderSearchResult = []
        this.isMenuOpen = false
        return
      }
      geocoder.geocode(this.query, (resultArray: any) => {
        this.geocoderSearchResult = resultArray.map((result: any, index: number) => ({
          id: index,
          data: result
        }))
        console.log(this.geocoderSearchResult)
        this.isMenuOpen = true
      })
    }
  }
})
</script>

<template>
  <v-container class="no-padding" fluid>
    <v-text-field
      v-model="query"
      :placeholder="placeholder"
      @keyup="onkeyup"
      :rules="[rules.required]"
      outlined
      dense
      required
      @focus="isMenuOpen = true"
    ></v-text-field>
    <v-menu v-model="isMenuOpen" activator="parent" offset-y transition="scale-transition" eager>
      <v-list>
        <v-list-item
          v-for="adr in geocoderSearchResult"
          :key="adr.id"
          @click="searchResultClick(adr.id)"
        >
          <v-list-item-title>{{ adr.data.name || 'Неизвестный адрес' }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-container>
</template>

<style scoped>
.no-padding {
  padding: 0 !important;
  margin: 0 !important;
}
</style>
