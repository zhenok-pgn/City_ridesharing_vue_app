<template>
  <!-- Заголовок -->
  <div class="d-flex align-center mb-4">
    <v-icon color="primary" class="mr-2">mdi-history</v-icon>
    <span class="text-h5 font-weight-medium">История заказов</span>
  </div>

  <!-- Индикатор загрузки -->
  <div v-if="loadingOrders" class="fixed-top text-center py-1 bg-white">
    <div class="text-caption text-grey-darken-1">Поиск заказов</div>
    <v-progress-linear indeterminate color="primary" height="4" />
  </div>

  <!-- Нет заказов -->
  <v-alert v-else-if="orders.length === 0" type="info" variant="tonal">
    У вас нет заказов.
  </v-alert>

  <!-- Список заказов -->
  <v-row v-else>
    <v-col v-for="order in orders" :key="order.orderNumber.createdAt" cols="12">
      <v-card
        class="pa-6"
        :to="{ name: 'user-order-details', params: { id: order.orderNumber.createdAt } }"
      >
        <!-- Направление и статус -->
        <div class="d-flex justify-space-between align-center mb-3">
          <div class="text-h6 font-weight-medium">
            {{
              `${order.routeSegmentSchedule.routeSegment.from.locality.name} — ${order.routeSegmentSchedule.routeSegment.to.locality.name}`
            }}
          </div>
          <v-chip size="small" :color="statusColor(order)" variant="flat" class="mb-2">
            {{ currentStatus(order) }}
          </v-chip>
        </div>

        <v-divider class="my-3" />

        <!-- Дата и цена -->
        <div class="d-flex justify-space-between text-subtitle-2">
          <span class="text-grey-darken-1">
            {{ localFormatedDate(order.orderNumber.createdAt) }}
          </span>
          <span class="font-weight-bold">
            {{ order.routeSegmentSchedule.price * order.bookings.length }} ₽
          </span>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import TicketCard from '@/modules/userProfile/components/TicketCard.vue'
import { BookingStatus, BookingStatusColor, type IOrder } from '@/interfaces/order'
import { ordersApi } from '@/modules/tripSearch/api/ordersApi'
import { DateTime } from 'luxon'
import { TripStatus } from '@/modules/tripSearch/interfaces/trip'

const orders = ref<IOrder[]>([])
const loadingOrders = ref(true)

const localFormatedDate = (isoString: string) => {
  const localFormatted = DateTime.fromISO(isoString).toLocal().toFormat('dd.MM.yyyy HH:mm')
  return localFormatted
}

const currentStatus = (order: IOrder): string => {
  if (!order.trip) return 'Загрузка...'
  const tripStatus = order.trip.tripStatus
  const bookingStatus = order.bookings[0].bookingStatus
  const bookingStatusLocal = BookingStatus[bookingStatus]
  if (bookingStatusLocal) {
    return bookingStatusLocal
  } else return TripStatus[tripStatus] || 'Неизвестный статус'
}

const statusColor = (order: IOrder) => {
  const status = currentStatus(order)
  return BookingStatusColor[status]
}

onMounted(async () => {
  try {
    orders.value = (await ordersApi.getOrders()).data
  } finally {
    loadingOrders.value = false
  }
  console.log('Tickets loaded:', orders.value)
})
</script>
