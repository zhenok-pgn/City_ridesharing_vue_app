<!--Страница поиска рейсов с фильтрами, на которую попадаешь после главной страницы пассажира TripsSearchMainView-->

<script lang="ts">
import { defineComponent } from 'vue'
import {
  createTripSearchRequest,
  type ITripSearchRequest
} from '@/modules/tripSearch/interfaces/ITripSearchRequest'
import { useRoutesHistoryStore } from '@/modules/tripSearch/stores/routesHistory'
import { useLoadingStore } from '@/stores/loadingStore'
import { localitiesApi } from '../api/localitiesApi'
import type { ILocality } from '@/interfaces/locality'
import type { ITrip } from '../interfaces/trip'
import { tripsApi } from '../api/tripsApi'
import { DateOnly, TimeOnly } from '@/utils/dateTime'

export default defineComponent({
  name: 'SearchTripView',
  props: {
    from: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isEditSearchParamsMode: false,
      loadingStore: useLoadingStore(),
      localities: [] as ILocality[],
      tripSearchRequest: createTripSearchRequest(),
      tripsLoading: true,
      trips: [] as ITrip[],
      rules: {
        required: (value: string) => !!value || 'Поле обязательно для заполнения'
      }
    }
  },
  computed: {},
  async mounted() {
    await this.setSearchParams()
    await this.searchTrips()
  },
  methods: {
    async setSearchParams() {
      this.tripSearchRequest.from = (await localitiesApi.getLocalityById(this.from)).data
      this.tripSearchRequest.to = (await localitiesApi.getLocalityById(this.to)).data
      this.tripSearchRequest.date = this.date
    },
    async searchTrips() {
      this.tripsLoading = true
      try {
        this.trips = (await tripsApi.getTrips(this.tripSearchRequest)).data
      } finally {
        this.tripsLoading = false
      }
    },
    buyHandler(index: number) {
      useRoutesHistoryStore().clearHistory()
      useRoutesHistoryStore().pushRoute(this.$route.fullPath)
      this.$router.push({
        name: 'trip-details',
        params: {
          tripId: this.trips[index].id,
          segmentId: this.trips[index].schedule.routeSegment.id
        }
      })
    },
    async onOpen() {
      if (this.localities.length === 0) {
        this.localities = (await localitiesApi.getLocalities()).data
      }
    },
    tripDateString(date: string, daysOffset: number = 0) {
      const dateInfo = new DateOnly(date).addDays(daysOffset).getDateInfo()
      return `${dateInfo[0]} ${dateInfo[1]}, ${dateInfo[2]}`
    },
    getTripDuration(trip: ITrip) {
      const days = trip.schedule.arrivalDayNumber - trip.schedule.departureDayNumber
      const zoneOffset =
        trip.schedule.routeSegment.from.locality.offsetMinutes -
        trip.schedule.routeSegment.to.locality.offsetMinutes
      const duration = new TimeOnly(trip.schedule.departureTime).getTimeDifference(
        new TimeOnly(trip.schedule.arrivalTime),
        days,
        zoneOffset
      )
      return this.formatTimeDifference(duration)
    },
    formatTimeDifference(diff: { days: number; hours: number; minutes: number }): string {
      const parts: string[] = []

      if (diff.days > 0) parts.push(`${diff.days} дн`)
      if (diff.hours > 0) parts.push(`${diff.hours} ч`)
      if (diff.minutes > 0) parts.push(`${diff.minutes} мин`)

      const str = parts.join(' ')
      return str
    }
  }
})
</script>

<template>
  <v-card
    v-if="!isEditSearchParamsMode"
    class="px-4 py-2"
    rounded="lg"
    elevation="0"
    style="background-color: #f8f8ff"
  >
    <v-row class="align-center justify-space-between" no-gutters>
      <!-- Название и дата -->
      <v-col cols="12" sm="auto">
        <div v-if="tripSearchRequest.to.name" class="d-flex flex-wrap align-center">
          <span class="font-weight-bold me-2 text-body-1">{{
            `${tripSearchRequest.from.name} — ${tripSearchRequest.to.name}`
          }}</span>
          <span class="text-caption text-grey">{{ tripDateString(date) }}</span>
        </div>
      </v-col>

      <!-- Кнопка -->
      <v-col cols="12" sm="auto" class="mt-2 mt-sm-0 text-sm-right">
        <v-btn
          elevation="1"
          color="white"
          variant="flat"
          size="small"
          class="text-primary font-weight-medium"
          @click="isEditSearchParamsMode = true"
        >
          Изменить поиск
        </v-btn>
      </v-col>
    </v-row>
  </v-card>

  <v-card v-else class="px-4 py-2" rounded="lg" elevation="0" style="background-color: #f8f8ff">
    <v-card-title class="position-relative justify-center pa-0">
      <div class="text-h6 font-weight-bold text-center w-100">Поиск поездки</div>
      <v-btn
        icon
        variant="text"
        class="position-absolute"
        style="top: 0; right: 0"
        size="small"
        @click="isEditSearchParamsMode = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text class="pa-0 pt-3">
      <v-form @submit.prevent="searchTrips">
        <v-row no-gutters>
          <v-col cols="12" md="6" lg="3" class="pe-md-2 pb-2">
            <v-autocomplete
              v-model="tripSearchRequest.from.id"
              :items="localities"
              item-title="name"
              item-value="id"
              label="Откуда"
              :loading="loadingStore.loading"
              clearable
              outlined
              dense
              required
              :rules="[rules.required]"
              @update:menu="onOpen"
            >
              <!-- Слот для отображения выбранного значения -->
              <template #selection="{ item }">
                <span v-if="tripSearchRequest.to.name && localities.length === 0">
                  {{ tripSearchRequest.to.name }}
                </span>
                <span v-else-if="item">
                  {{ item.title }}
                </span>
              </template>
              <!-- слот для кастомного отображения элементов -->
              <template #item="{ item, props }">
                <v-list-item v-bind="props">
                  <v-list-item-subtitle v-if="item.raw.region !== item.raw.name">
                    {{ `${item.raw.region}${item.raw.district ? ', ' + item.raw.district : ''}` }}
                  </v-list-item-subtitle>
                </v-list-item>
              </template>
              <!-- Слот no-data -->
              <template #no-data>
                <v-list-item>
                  <v-list-item-title>{{
                    `${loadingStore.loading ? 'Загрузка...' : 'Ничего не найдено'}`
                  }}</v-list-item-title>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-col>

          <v-col cols="12" md="6" lg="3" class="pe-lg-2 pb-2">
            <v-autocomplete
              v-model="tripSearchRequest.to.id"
              :items="localities"
              item-title="name"
              item-value="id"
              label="Куда"
              :loading="loadingStore.loading"
              clearable
              outlined
              dense
              required
              :rules="[rules.required]"
              @update:menu="onOpen"
            >
              <!-- Слот для отображения выбранного значения -->
              <template #selection="{ item }">
                <span v-if="tripSearchRequest.to.name && localities.length === 0">
                  {{ tripSearchRequest.to.name }}
                </span>
                <span v-else-if="item">
                  {{ item.title }}
                </span>
              </template>

              <!-- слот для кастомного отображения элементов -->
              <template #item="{ item, props }">
                <v-list-item v-bind="props">
                  <v-list-item-subtitle v-if="item.raw.region !== item.raw.name">
                    {{ `${item.raw.region}${item.raw.district ? ', ' + item.raw.district : ''}` }}
                  </v-list-item-subtitle>
                </v-list-item>
              </template>
              <!-- Слот no-data -->
              <template #no-data>
                <v-list-item>
                  <v-list-item-title>{{
                    `${loadingStore.loading ? 'Загрузка...' : 'Ничего не найдено'}`
                  }}</v-list-item-title>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-col>

          <v-col cols="12" md="6" lg="3" class="pe-md-2 pb-2">
            <v-text-field
              v-model="tripSearchRequest.date"
              label="Дата"
              type="date"
              outlined
              dense
              hide-details
              required
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6" lg="3" class="pb-2">
            <v-btn
              type="submit"
              color="white"
              variant="flat"
              block
              height="40"
              elevation="1"
              class="text-primary font-weight-medium"
            >
              Найти поездки
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>

  <div class="mt-6">
    <v-progress-linear
      v-if="tripsLoading"
      indeterminate
      color="primary"
      height="4"
      class="fixed-top"
    ></v-progress-linear>

    <!-- Результаты или сообщение об отсутствии -->
    <div v-else>
      <div v-if="trips.length > 0">
        <div class="d-flex align-center mb-4">
          <v-icon color="primary" class="mr-2">mdi-magnify</v-icon>
          <span class="text-h6 font-weight-medium">Результаты поиска</span>
        </div>
        <v-card
          v-for="(trip, index) in trips"
          :key="index"
          class="pa-6 mb-6 hover-darken transition"
          rounded="lg"
          outlined
        >
          <v-row align="center" no-gutters>
            <!-- Блок маршрута -->
            <v-col cols="12" md="9">
              <v-row align="center">
                <!-- Отправление -->
                <v-col cols="4" sm="3">
                  <div class="text-h5 font-weight-bold">{{ trip.schedule.departureTime }}</div>
                  <div class="text-caption text-grey-darken-1">
                    {{ tripDateString(trip.departureDate, trip.schedule.departureDayNumber) }}
                  </div>
                  <div class="text-body-2 font-weight-medium mt-1">
                    {{ trip.schedule.routeSegment.from.name }}
                  </div>
                  <div class="text-caption text-grey-darken-1">
                    {{ trip.schedule.routeSegment.from.locality.name }}
                  </div>
                </v-col>

                <!-- Время в пути -->
                <v-col cols="4" sm="6" class="text-center">
                  <div class="d-flex align-center justify-center">
                    <v-icon size="small" class="my-1 text-grey-darken-1 pe-2"
                      >mdi-clock-outline</v-icon
                    >
                    <div class="text-caption text-grey-darken-1">{{ getTripDuration(trip) }}</div>
                  </div>
                  <v-divider></v-divider>
                </v-col>

                <!-- Прибытие -->
                <v-col cols="4" sm="3" class="text-right">
                  <div class="text-h5 font-weight-bold">{{ trip.schedule.arrivalTime }}</div>
                  <div class="text-caption text-grey-darken-1">
                    {{ tripDateString(trip.departureDate, trip.schedule.arrivalDayNumber) }}
                  </div>
                  <div class="text-body-2 font-weight-medium mt-1">
                    {{ trip.schedule.routeSegment.to.name }}
                  </div>
                  <div class="text-caption text-grey-darken-1">
                    {{ trip.schedule.routeSegment.to.locality.name }}
                  </div>
                </v-col>
              </v-row>
            </v-col>

            <!-- Блок цены и кнопки -->
            <v-col cols="12" md="3" class="pl-md-4 border-left-md">
              <div class="d-flex flex-column">
                <div class="text-h4 font-weight-bold text-right">{{ trip.schedule.price }} ₽</div>
                <v-btn color="primary" class="mt-3" block depressed @click="buyHandler(index)">
                  Купить
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </div>

      <v-alert v-else type="info" class="mt-4"> По вашему запросу ничего не найдено. </v-alert>
    </div>
  </div>
</template>

<style scoped>
.hover-darken {
  transition: background-color 0.3s ease;
}
.hover-darken:hover {
  background-color: rgba(0, 0, 0, 0.04); /* лёгкое затемнение */
}
</style>
