<!--Страница поиска рейсов с фильтрами, на которую попадаешь после главной страницы пассажира PassangerMainView-->

<script lang="ts">
import { defineComponent } from 'vue'
import { type IRouteSearchRequest } from '@/interfaces/IRouteSearchRequest'
import { mapGetters } from 'vuex'
import SearchAddressDropdown from '@/components/SearchAddressDropdown.vue'

export default defineComponent({
  name: 'TripSearch',
  data() {
    return {
      from: '',
      to: '',
      date: '',
      time: '',
      trips: [] as {
        id: number
        from: string
        to: string
        date: string
        time: string
        price: number
      }[]
    }
  },
  components: {
    SearchAddressDropdown
  },
  computed: {
    ...mapGetters('route', ['getRouteSearchRequest']),
    routeSearchRequest(): IRouteSearchRequest | null {
      return this.getRouteSearchRequest as IRouteSearchRequest | null
    }
  },
  methods: {
    async searchTrips() {
      // Здесь вы можете сделать запрос к API для получения данных о поездках
      // Пример данных для демонстрации
      const mockTrips = [
        {
          id: 1,
          from: 'Москва',
          to: 'Санкт-Петербург',
          date: '2023-10-15',
          time: '10:00',
          price: 1500
        },
        { id: 2, from: 'Москва', to: 'Казань', date: '2023-10-15', time: '12:00', price: 2000 },
        { id: 3, from: 'Москва', to: 'Сочи', date: '2023-10-15', time: '14:00', price: 3000 }
      ]

      // Фильтрация по введенным данным
      this.trips = mockTrips.filter(
        (trip) =>
          trip.from.includes(this.from) &&
          trip.to.includes(this.to) &&
          trip.date === this.date &&
          (this.time ? trip.time === this.time : true)
      )
    },
    bookTrip(tripId: number) {
      // Логика для бронирования поездки
      console.log(`Поездка с ID ${tripId} забронирована!`)
    }
  }
})
</script>

<template>
  <div class="trip-search">
    <h2>Поиск поездки</h2>
    <form @submit.prevent="searchTrips">
      <div class="form-group">
        <label for="from">Откуда:</label>
        <SearchAddressDropdown
          placeholder="Откуда"
          value="{{routeSearchRequest.from.properties.display_name}}"
        />
      </div>
      <div class="form-group">
        <label for="to">Куда:</label>
        <SearchAddressDropdown
          placeholder="Куда"
          value="{{routeSearchRequest.to.properties.display_name}}"
        />
      </div>
      <div class="form-group">
        <label for="date">Дата:</label>
        <input type="date" id="date" v-model="date" required />
      </div>
      <div class="form-group">
        <label for="time">Время:</label>
        <input type="time" id="time" v-model="time" />
      </div>
      <button type="submit">Найти поездки</button>
    </form>

    <div class="results" v-if="trips.length > 0">
      <h3>Результаты поиска:</h3>
      <ul>
        <li v-for="trip in trips" :key="trip.id">
          <div>
            <strong>{{ trip.from }} - {{ trip.to }}</strong>
            <p>Дата: {{ trip.date }} Время: {{ trip.time }}</p>
            <p>Цена: {{ trip.price }} руб.</p>
            <button @click="bookTrip(trip.id)">Забронировать</button>
          </div>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>По вашему запросу ничего не найдено.</p>
    </div>
  </div>

  <p>{{ routeSearchRequest.from.properties.display_name }}</p>
</template>

<!-- <style scoped>
.trip-search {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.results {
  margin-top: 20px;
}

.results ul {
  list-style-type: none;
  padding: 0;
}

.results li {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.results li div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.results li button {
  background-color: #28a745;
}

.results li button:hover {
  background-color: #218838;
}
</style> -->
