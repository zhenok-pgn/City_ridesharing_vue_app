<script lang="ts">
import { defineComponent } from 'vue'
import FindAddressView from '../views/FindAddressView.vue'

enum PageState {
  from = 'Откуда',
  to = 'Куда',
  filter = 'Фильтр'
}

interface SelectedAddress {
  title: string
  position: string
}

export default defineComponent({
  data() {
    return {
      curPageState: PageState.filter,
      PageState,
      addressFrom: {} as SelectedAddress,
      addressTo: {} as SelectedAddress
    }
  },
  components: {
    FindAddressView
  },
  methods: {
    goToFindAddressView(param: PageState) {
      //this.$router.push({ name: 'find-address', params: { typePage: param } })
      this.curPageState = param
    },
    receiveAddress(addr: SelectedAddress) {
      if (this.curPageState == PageState.from) {
        this.addressFrom = addr
      } else {
        this.addressTo = addr
      }
      this.curPageState = PageState.filter
    }
  }
})
</script>

<template>
  <div v-if="curPageState == PageState.filter" class="greetings">
    <h1 class="green">filter</h1>
    <h6>from</h6>
    <input @click="goToFindAddressView(PageState.from)" type="text" :value="addressFrom.title" />
    <h6>to</h6>
    <input @click="goToFindAddressView(PageState.to)" type="text" :value="addressTo.title" />
    <h6>date</h6>
    <input type="text" />
    <h6>passengers amount</h6>
    <input type="text" />
    <button>apply</button>
  </div>
  <div v-else>
    <FindAddressView @addressSelected="(addr) => receiveAddress(addr)">{{
      curPageState
    }}</FindAddressView>
  </div>
</template>

<style></style>
