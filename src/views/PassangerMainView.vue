<!--Главная страница поиска для пассажира-->

<script lang="ts">
import { defineComponent } from 'vue'
import SearchAddressDropdown from '@/components/SearchAddressDropdown.vue'
import { type IRouteSearchRequest } from '@/interfaces/IRouteSearchRequest'
import { type ISelectedAddress } from '@/interfaces/ISelectedAddress'
import { mapActions } from 'vuex'

export default defineComponent({
  data() {
    return {
      from: {} as ISelectedAddress,
      to: {} as ISelectedAddress,
      passangersCount: 1,
      date: '',

      routeSearchRequest: {} as IRouteSearchRequest,
      trips: [
        { id: 1, title: 'Поездка в Москву', description: 'Удобная поездка в Москву', price: 1500 },
        {
          id: 2,
          title: 'Поездка в Санкт-Петербург',
          description: 'Комфортная поездка в Питер',
          price: 2000
        }
        // Добавьте больше поездок по мере необходимости
      ]
    }
  },
  components: {
    SearchAddressDropdown
  },
  methods: {
    ...mapActions('route', ['updateRouteSearchRequest']),
    searchTrips() {
      // Логика поиска поездок
      console.log(this.routeSearchRequest)
      this.updateRouteSearchRequest(this.routeSearchRequest)
      this.$router.push({
        name: 'search-route'
      })

      //console.log(this.from)
      //console.log(this.to)
      //console.log(`Ищем поездки из ${this.from} в ${this.to} на ${this.date}`)
    },
    bookTrip(tripId) {
      // Логика бронирования поездки
      console.log(`Бронирование поездки с ID: ${tripId}`)
    }
  }
})
</script>

<template>
  <div id="app">
    <section class="search">
      <h2>Найдите поездку</h2>
      <form @submit.prevent="searchTrips">
        <SearchAddressDropdown placeholder="Откуда" v-model="routeSearchRequest.from" />
        <SearchAddressDropdown placeholder="Куда" v-model="routeSearchRequest.to" />
        <input type="number" v-model="routeSearchRequest.passangersCount" required />
        <input type="date" v-model="routeSearchRequest.date" required />
        <!--Перенаправление на SearchRouteView-->
        <button type="submit">Найти</button>
      </form>
    </section>

    <section class="trips">
      <h2>Доступные поездки</h2>
      <ul>
        <li v-for="trip in trips" :key="trip.id">
          <h3>{{ trip.title }}</h3>
          <p>{{ trip.description }}</p>
          <p><strong>Цена:</strong> {{ trip.price }} руб.</p>
          <button @click="bookTrip(trip.id)">Забронировать</button>
        </li>
      </ul>
    </section>
  </div>
</template>

<!-- <style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

header {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
}

nav ul {
  list-style-type: none;
  padding: 0;
}

nav ul li {
  display: inline;
  margin-right: 15px;
}

.search {
  padding: 20px;
}

.trips {
  padding: 20px;
}

footer {
  background-color: #f1f1f1;
  text-align: center;
  padding: 10px 0;
}
</style> -->
