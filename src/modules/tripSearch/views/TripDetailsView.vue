<script setup lang="ts">
import OSM from '@/components/OSM.vue'
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useRoutesHistoryStore } from '@/modules/tripSearch/stores/routesHistory'
import type { ITrip } from '../interfaces/trip'
import { tripsApi } from '../api/tripsApi'
import { useLoadingStore } from '@/stores/loadingStore'
import { DateOnly } from '@/utils/dateTime'
import type { ICreateOrderRequest, IOrderNumber } from '@/interfaces/order'
import { ordersApi } from '../api/ordersApi'

const props = defineProps({
  tripId: {
    type: String,
    required: true
  },
  segmentId: {
    type: String,
    required: true
  }
})

const trip = ref<ITrip | null>(null)
const orderRequest = ref(null as null | ICreateOrderRequest)
const selectedSeats = ref<string[]>([])
const passengersCount = ref(1)
const mapDialog = ref(false)
const isExpanded = ref(false)
const availableSeatsCount = ref(0)

// Vuetify display for responsive fullscreen
const { smAndDown } = useDisplay()
const isSmallScreen = computed(() => smAndDown.value)
const router = useRouter()
const loadingStore = useLoadingStore()

// Computed properties
const breadcrumbs = computed(() => [
  { title: 'Поиск', href: useRoutesHistoryStore().peekRoute() },
  { title: 'Выбор мест', href: `` }
])

const totalPrice = computed(
  () => passengersCount.value * trip.value?.schedule.price // Example price per passenger
)

const incrementPassengers = () => {
  if (passengersCount.value < availableSeatsCount.value) passengersCount.value++
}

// Уменьшение количества пассажиров (и удаление лишних мест)
const decrementPassengers = () => {
  if (passengersCount.value > 1) {
    passengersCount.value--
    updateSeats()
  }
}

// Обновление списка мест (если пассажиров стало меньше)
const updateSeats = () => {
  while (selectedSeats.value.length > passengersCount.value) {
    selectedSeats.value.pop()
  }
}

// Выбор и отмена выбора мест
const toggleSeat = (seatId: string) => {
  // Если место уже выбрано — убираем его
  if (selectedSeats.value.includes(seatId)) {
    selectedSeats.value = selectedSeats.value.filter((id) => id !== seatId)
  }
  // Иначе проверяем, можно ли добавить
  else if (selectedSeats.value.length < passengersCount.value) {
    selectedSeats.value.push(seatId)
  }
}

const showMap = () => {
  mapDialog.value = true
}

const continueToOrder = async () => {
  if (selectedSeats.value.length < passengersCount.value) {
    selectedSeats.value =
      trip.value?.seats
        .filter((seat) => seat.isAvailable)
        .slice(0, passengersCount.value)
        .map((seat) => seat.id) || []
  }
  orderRequest.value!.seatIds = selectedSeats.value
  const order = (await (await ordersApi.create(orderRequest.value)).data) as IOrderNumber
  useRoutesHistoryStore().pushRoute(router.currentRoute.value.fullPath)
  router.push({ name: 'order', params: { orderDate: order.createdAt, orderUserId: order.userId } })
}

onMounted(async () => {
  trip.value = (await tripsApi.getTripById(props.tripId, props.segmentId)).data
  availableSeatsCount.value = trip.value?.seats.filter((seat) => seat.isAvailable).length || 0
  orderRequest.value = {
    tripId: props.tripId,
    segmentId: trip.value!.schedule.id,
    seatIds: []
  }
})

const tripDateString = (date: string, daysOffset: number = 0) => {
  const dateInfo = new DateOnly(date).addDays(daysOffset).getDateInfo()
  return `${dateInfo[0]} ${dateInfo[1]}, ${dateInfo[2]}`
}
</script>

<template>
  <!-- Хлебные крошки -->
  <v-breadcrumbs :items="breadcrumbs" class="px-3 mb-3">
    <template v-slot:divider>
      <v-icon icon="mdi-chevron-right"></v-icon>
    </template>
  </v-breadcrumbs>

  <div v-if="loadingStore.loading" class="fixed-top text-center py-1 bg-white">
    <div class="text-caption text-grey-darken-1">Проверяем наличие свободных мест</div>
    <v-progress-linear indeterminate color="primary" height="4" />
  </div>
  <div v-else>
    <!-- Основная информация о рейсе -->
    <v-card v-if="trip" flat style="background-color: #f8f8ff">
      <v-card-title class="d-flex">
        <span class="text-h5">{{ `${trip.route.name}` }}</span>
        <v-spacer></v-spacer>
        <v-btn @click="isExpanded = !isExpanded" flat>
          <v-icon>
            {{ isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-subtitle>{{
        `${tripDateString(trip.departureDate, trip.schedule.departureDayNumber)} в ${trip.schedule.departureTime}`
      }}</v-card-subtitle>
      <v-card-text>
        <v-expand-transition>
          <div v-show="isExpanded" class="expandable-content">
            <!-- Контент, который будет раскрываться вниз -->
            <div class="d-flex align-center mb-2">
              <v-icon icon="mdi-clock" class="mr-2"></v-icon>
              <span class="font-weight-bold">{{
                `${trip.schedule.departureTime} · ${tripDateString(trip.departureDate, trip.schedule.departureDayNumber)}`
              }}</span>
            </div>
            <div class="d-flex align-center mb-4">
              <v-icon icon="mdi-map-marker" class="mr-2"></v-icon>
              <span>{{ trip.schedule.routeSegment.from.address }}</span>
            </div>

            <div class="d-flex align-center mb-2">
              <v-icon icon="mdi-clock" class="mr-2"></v-icon>
              <span class="font-weight-bold">{{
                `${trip.schedule.arrivalTime} · ${tripDateString(trip.departureDate, trip.schedule.arrivalDayNumber)}`
              }}</span>
            </div>
            <div class="d-flex align-center">
              <v-icon icon="mdi-map-marker" class="mr-2"></v-icon>
              <span>{{ trip.schedule.routeSegment.to.address }}</span>
            </div>
            <div class="d-flex align-center mb-6">
              <v-btn variant="text" color="primary" size="small" class="ml-2" @click="showMap">
                Посмотреть на карте
                <v-icon icon="mdi-open-in-new" end></v-icon>
              </v-btn>
            </div>

            <!--<div class="d-flex align-center mb-2">
              <v-icon icon="mdi-map-marker-path" class="mr-2"></v-icon>
              <span>{{Маршрут: }}</span>
            </div>
            <div class="d-flex align-center mb-2">
              <v-icon icon="mdi-account-tie" class="mr-2"></v-icon>
              <span>Перевозчик: </span>
            </div>-->
            <div class="d-flex align-center">
              <v-icon icon="mdi-bus"></v-icon>
              <span>{{ `Автовобус: ${trip.bus.model}` }}</span>
            </div>
          </div>
        </v-expand-transition>
      </v-card-text>
    </v-card>

    <!-- Информация о местах -->
    <v-card v-if="availableSeatsCount > 0" flat class="my-6" style="background-color: #f8f8ff">
      <!-- Заголовок -->
      <v-card-title class="text-h9 mb-0">Выберите количество пассажиров</v-card-title>
      <v-card-text>
        <!-- Счетчик -->
        <div class="d-flex align-center mb-2">
          <v-btn
            variant="text"
            icon
            @click="decrementPassengers"
            :disabled="passengersCount === 1"
            class="text-grey-darken-3"
          >
            <v-icon>mdi-minus</v-icon>
          </v-btn>

          <span class="text-h7 mx-3">{{ passengersCount }}</span>

          <v-btn variant="text" icon @click="incrementPassengers" class="text-grey-darken-3">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>

        <!-- Места -->
        <div class="d-flex flex-wrap mb-4" style="gap: 8px">
          <v-btn
            v-for="seat in trip?.seats"
            :key="seat.id"
            :variant="
              !seat.isAvailable ? 'outlined' : selectedSeats.includes(seat.id) ? 'flat' : 'outlined'
            "
            :color="!seat.isAvailable ? 'grey-lighten-1' : 'primary'"
            :disabled="!seat.isAvailable"
            min-width="36"
            height="36"
            class="text-body-1"
            @click="toggleSeat(seat.id)"
          >
            {{ seat.seatNumber }}
          </v-btn>
        </div>

        <v-alert
          v-if="selectedSeats.length != passengersCount"
          type="info"
          variant="tonal"
          class="mb-4"
        >
          Места будут назначены автоматически
        </v-alert>
      </v-card-text>
    </v-card>
    <v-alert v-else type="error" variant="tonal" class="mb-4"> Нет доступных мест </v-alert>

    <!-- Итоговая цена и кнопка -->
    <v-card flat>
      <v-card-text class="text-right">
        <div class="text-h5 mb-2">{{ totalPrice }} ₽</div>
        <div class="text-caption mb-4">за {{ passengersCount }} пассажиров</div>
        <v-btn
          color="primary"
          size="large"
          :disabled="availableSeatsCount < 1"
          @click="continueToOrder"
        >
          Продолжить
        </v-btn>
      </v-card-text>
    </v-card>
  </div>

  <!-- Диалог карты -->
  <v-dialog v-model="mapDialog" max-width="800" :fullscreen="isSmallScreen" :scrollable="false">
    <v-card class="fill-height d-flex flex-column pa-0">
      <v-card-title class="d-flex align-center">
        <v-btn icon @click="mapDialog = false" flat>
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <span class="text-h6 ml-2">Просмотр на карте</span>
      </v-card-title>
      <v-card-text v-if="trip" class="flex-grow-1 pa-0" style="height: calc(100vh - 64px)">
        <OSM
          :waypoints="[
            {
              lat: trip.schedule.routeSegment.from.latitude,
              lng: trip.schedule.routeSegment.from.longitude
            },
            {
              lat: trip.schedule.routeSegment.to.latitude,
              lng: trip.schedule.routeSegment.to.longitude
            }
          ]"
          map-id="mapFullScreen"
        ></OSM>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
