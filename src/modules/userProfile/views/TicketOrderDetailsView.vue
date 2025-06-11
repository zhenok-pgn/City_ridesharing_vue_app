<template>
  <div class="d-flex align-center mb-4">
    <v-btn icon @click="$router.go(-1)" flat>
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <span class="text-h6 font-weight-medium">Детали заказа</span>
  </div>

  <v-card v-if="order" flat style="background-color: #f8f8ff">
    <v-card-title class="d-flex">
      <span class="text-h5">{{ `${order.trip.route.name}` }}</span>
      <v-spacer></v-spacer>
      <v-btn @click="isExpanded = !isExpanded" flat>
        <v-icon>
          {{ isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
        </v-icon>
      </v-btn>
    </v-card-title>
    <v-card-subtitle>{{ `Создан ${localFormatedDate()}` }}</v-card-subtitle>
    <v-card-text>
      <v-expand-transition>
        <div v-show="isExpanded" class="expandable-content">
          <!-- Контент, который будет раскрываться вниз -->
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-clock" class="mr-2"></v-icon>
            <span class="font-weight-bold">{{
              `${order.routeSegmentSchedule.departureTime} · ${tripDateString(order.trip.departureDate, order.routeSegmentSchedule.departureDayNumber)}`
            }}</span>
          </div>
          <div class="d-flex align-center mb-4">
            <v-icon icon="mdi-map-marker" class="mr-2"></v-icon>
            <span>{{ order.routeSegmentSchedule.routeSegment.from.address }}</span>
          </div>

          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-clock" class="mr-2"></v-icon>
            <span class="font-weight-bold">{{
              `${order.routeSegmentSchedule.arrivalTime} · ${tripDateString(order.trip.departureDate, order.routeSegmentSchedule.arrivalDayNumber)}`
            }}</span>
          </div>
          <div class="d-flex align-center">
            <v-icon icon="mdi-map-marker" class="mr-2"></v-icon>
            <span>{{ order.routeSegmentSchedule.routeSegment.to.address }}</span>
          </div>

          <v-divider class="my-4"></v-divider>

          <!-- Список билетов -->
          <div v-if="order.bookings.length">
            <div
              v-for="booking in order.bookings"
              :key="booking.id"
              class="d-flex align-start mb-4"
            >
              <v-icon icon="mdi-ticket-confirmation-outline" class="mr-2 mt-1"></v-icon>
              <div>
                <div>
                  <strong>{{ passengerFullName(booking.ticket.passenger) }}</strong>
                </div>
                <div class="text-body-2 text-grey-darken-1">
                  Дата рождения: {{ booking.ticket.passenger.dayOfBirth }}
                </div>
                <div class="text-body-2 text-grey-darken-1">
                  {{ passengerIdentificationDocument(booking.ticket.passenger) }}
                </div>
                <div class="text-body-2 text-grey-darken-1">Место: {{ booking.seatNumber }}</div>
              </div>
            </div>
          </div>
          <div v-else class="text-caption text-grey">Нет билетов</div>

          <v-divider class="my-4"></v-divider>

          <div class="text-h5">
            <strong>{{ totalPrice }} ₽</strong>
          </div>

          <!--<div class="d-flex align-center mb-2">
              <v-icon icon="mdi-map-marker-path" class="mr-2"></v-icon>
              <span>{{Маршрут: }}</span>
            </div>
            <div class="d-flex align-center mb-2">
              <v-icon icon="mdi-account-tie" class="mr-2"></v-icon>
              <span>Перевозчик: </span>
            </div>
          <div class="d-flex align-center">
            <v-icon icon="mdi-bus"></v-icon>
            <span>{{ `Автовобус: ${order.trip.bus.model}` }}</span>
          </div>-->
        </div>
      </v-expand-transition>
    </v-card-text>
  </v-card>

  <v-card flat>
    <v-card-title class="d-flex">
      <v-chip size="small" :color="statusColor" variant="flat" class="mt-3 mb-1">
        {{ currentStatus }}
      </v-chip>
    </v-card-title>
    <v-card-text>
      <v-row>
        <!-- Карта + ETA -->
        <v-col cols="12">
          <div
            class="position-relative mb-2"
            style="height: 240px; border: 1px solid #ccc; border-radius: 8px; overflow: hidden"
          >
            <!-- Карта -->
            <OSM
              v-if="getRouteWaypoints"
              :waypoints="getRouteWaypoints"
              :highlighted-segment="getHighlightedSegment"
              :bus-location="
                currentBusLocation
                  ? [currentBusLocation.latitude, currentBusLocation.longitude]
                  : null
              "
              map-id="mapPreview"
            ></OSM>

            <!-- Кнопка "развернуть" -->
            <v-btn
              icon
              color="primary"
              @click="fullscreenMap = true"
              class="position-absolute"
              style="top: 8px; right: 8px; z-index: 1000"
            >
              <v-icon>mdi-arrow-expand</v-icon>
            </v-btn>
          </div>

          <v-alert v-if="curEta" type="info" variant="tonal" title="Прогноз прибытия">
            <div v-if="getHighlightedSegment" class="text-body-1">
              <div>
                <strong>Посадка:</strong>
                <span>{{
                  formatDateTime(
                    curEta.stopEtas[getHighlightedSegment.fromIndex].estimatedArrival,
                    curEta.stopEtas[getHighlightedSegment.fromIndex].timezoneOffset
                  )
                }}</span>
              </div>
              <div>
                <strong>Конечная остановка:</strong>
                <span>{{
                  formatDateTime(
                    curEta.stopEtas[getHighlightedSegment.toIndex].estimatedArrival,
                    curEta.stopEtas[getHighlightedSegment.toIndex].timezoneOffset
                  )
                }}</span>
              </div>
              <div v-if="currentBusLocation?.timestamp">
                <small class="text-disabled">
                  Обновлено: {{ new Date(currentBusLocation.timestamp).toLocaleTimeString() }}
                </small>
              </div>
            </div>
          </v-alert>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <!-- Модальное окно полноэкранной карты -->
  <v-dialog v-model="fullscreenMap" fullscreen persistent>
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title>Маршрут автобуса</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="fullscreenMap = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-0" style="height: calc(100vh - 64px)">
        <OSM
          v-if="getRouteWaypoints"
          :waypoints="getRouteWaypoints"
          :highlighted-segment="getHighlightedSegment"
          :bus-location="
            currentBusLocation ? [currentBusLocation.latitude, currentBusLocation.longitude] : null
          "
          map-id="mapFullScreen"
        ></OSM>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {
  BookingStatus,
  BookingStatusColor,
  identificationDocuments,
  type IOrder,
  type IPassenger
} from '@/interfaces/order'
import { ordersApi } from '@/modules/tripSearch/api/ordersApi'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import OSM from '@/components/OSM.vue'
import { DateOnly } from '@/utils/dateTime'
import { DateTime } from 'luxon'
import { useTripHub } from '@/plugins/signalr'
import type { IBusLocation, ITripEta } from '@/interfaces/busLocation'
import { TripStatus } from '@/modules/tripSearch/interfaces/trip'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const order = ref<IOrder>()
const isExpanded = ref(false)
const fullscreenMap = ref(false)
const hub = useTripHub()
const currentBusLocation = ref<IBusLocation | null>(null)
const curEta = ref<ITripEta | null>(null)

const formatDateTime = (isoStr: string, offset: number) => {
  return DateTime.fromISO(isoStr).toUTC(offset).toFormat('dd.MM.yyyy HH:mm')
}
const localFormatedDate = () => {
  const localFormatted = DateTime.fromISO(order.value?.orderNumber.createdAt)
    .toLocal()
    .toFormat('dd.MM.yyyy HH:mm')
  return localFormatted
}

const passengerFullName = (passenger: IPassenger) => {
  return `${passenger.surname} ${passenger.name} ${passenger.patronymic}`
}

const passengerIdentificationDocument = (passenger: IPassenger) => {
  return `${identificationDocuments.find((d) => d.id === passenger.documentType)?.name}: ${passenger.documentNumber}`
}

const currentStatus = computed(() => {
  if (!order.value?.trip) return 'Загрузка...'
  console.log('order.value', order.value)
  const tripStatus = order.value?.trip.tripStatus
  const bookingStatus = order.value.bookings[0].bookingStatus
  const bookingStatusLocal = BookingStatus[bookingStatus]
  if (bookingStatusLocal) {
    return bookingStatusLocal
  } else return TripStatus[tripStatus] || 'Неизвестный статус'
})

const statusColor = computed(() => {
  const status = currentStatus.value
  return BookingStatusColor[status]
})

const totalPrice = computed(() => {
  if (!order.value) return 0
  return order.value.routeSegmentSchedule.price * order.value.bookings.length
})

const getRouteWaypoints = computed(() => {
  if (curEta.value) {
    return curEta.value.stopEtas.map((eta) => ({
      lat: eta.latitude,
      lng: eta.longitude
    }))
  } else if (order.value) {
    const segment = order.value.routeSegmentSchedule.routeSegment
    return [
      {
        lat: segment.from.latitude,
        lng: segment.from.longitude
      },
      {
        lat: segment.to.latitude,
        lng: segment.to.longitude
      }
    ]
  } else {
    return null
  }
})

const getHighlightedSegment = computed(() => {
  if (curEta.value) {
    const fromIndex = curEta.value.stopEtas.findIndex(
      (eta) => eta.stopId === order.value?.routeSegmentSchedule.routeSegment.from.id
    )
    const toIndex = curEta.value.stopEtas.findIndex(
      (eta) => eta.stopId === order.value?.routeSegmentSchedule.routeSegment.to.id
    )
    return { fromIndex, toIndex }
  }
  return null
})

onMounted(async () => {
  order.value = (await ordersApi.getOrderById(props.id)).data
  console.log('Ticket loaded:', order.value)

  await hub.start()
  hub.onTripLocationUpdated((updatedLocation) => {
    currentBusLocation.value = updatedLocation
  })
  hub.onEtaUpdated((eta: ITripEta) => {
    console.log('ETA updated:', eta)
    // Обновляем ETA для посадки и прибытия
    curEta.value = eta
  })
  hub.onTripStatusChanged((status) => {
    order.value!.bookings.forEach((b) => {
      b.bookingStatus = status
    })
    console.log('status', order.value!.bookings)
  })

  await hub.joinTrip(`${order.value!.trip.id}_${order.value!.routeSegmentSchedule.id}`)
})

onUnmounted(async () => {
  await hub.leaveTrip(order.value!.routeSegmentSchedule.id)
  await hub.stop()
})

const tripDateString = (date: string, daysOffset: number = 0) => {
  const dateInfo = new DateOnly(date).addDays(daysOffset).getDateInfo()
  return `${dateInfo[0]} ${dateInfo[1]}, ${dateInfo[2]}`
}
</script>
