<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRoutesHistoryStore } from '../stores/routesHistory'
import {
  genders,
  identificationDocuments,
  type IOrder,
  type IOrderNumber,
  type IPassenger,
  type IPayOrderRequest
} from '@/interfaces/order'
import { ordersApi } from '../api/ordersApi'
import { toast } from '@/plugins/toast'
import router from '@/router'

const props = defineProps<{
  orderDate: string
  orderUserId: string
}>()

const passengersCount = ref(1) // Количество пассажиров
const breadcrumbs = computed(() => [
  { title: 'Поиск', href: useRoutesHistoryStore().$state.historyStack[0] },
  { title: 'Выбор мест', href: useRoutesHistoryStore().peekRoute() },
  { title: 'Пассажиры', href: `` }
])
const passengers = ref<IPassenger[]>([]) // Массив пассажиров
const order = ref<IOrder>()

onMounted(async () => {
  const orderNum = {
    createdAt: props.orderDate,
    userId: props.orderUserId
  } as IOrderNumber
  order.value = (await ordersApi.getOrderById(props.orderDate)).data
  passengersCount.value = order.value!.bookings.length
  passengers.value = Array.from({ length: passengersCount.value }, () => ({}) as IPassenger)
})
const continueToPay = async () => {
  const validationErrors = validatePassengers(passengers.value)
  if (validationErrors.length > 0) {
    toast.error(validationErrors.join('\n'))
    return
  }
  const orderNum = {
    createdAt: props.orderDate,
    userId: props.orderUserId
  } as IOrderNumber
  const payRequest = { orderNumber: orderNum, passengers: passengers.value } as IPayOrderRequest
  await ordersApi.pay(payRequest)
  toast.success('Заказ успешно оплачен')
  router.push({ name: 'trips-search-main' })
}

function validatePassengers(passengers: IPassenger[]): string[] {
  const errors: string[] = []

  passengers.forEach((p, index) => {
    if (!p.surname?.trim()) errors.push(`Пассажир ${index + 1}: Фамилия обязательна`)
    if (!p.name?.trim()) errors.push(`Пассажир ${index + 1}: Имя обязательно`)
    if (!p.patronymic?.trim()) errors.push(`Пассажир ${index + 1}: Отчество обязательно`)
    if (p.gender == null) errors.push(`Пассажир ${index + 1}: Пол обязателен`)
    if (!p.dayOfBirth) errors.push(`Пассажир ${index + 1}: Дата рождения обязательна`)
    if (p.documentType == null) errors.push(`Пассажир ${index + 1}: Тип документа обязателен`)
    if (!p.documentNumber?.trim()) errors.push(`Пассажир ${index + 1}: Номер документа обязателен`)
  })

  return errors
}
</script>

<template>
  <!-- Хлебные крошки -->
  <v-breadcrumbs :items="breadcrumbs" class="px-0">
    <template v-slot:divider>
      <v-icon icon="mdi-chevron-right"></v-icon>
    </template>
  </v-breadcrumbs>

  <!-- Формы для каждого пассажира -->
  <v-form @submit.prevent="continueToPay">
    <v-card
      v-for="(passenger, index) in passengers"
      :key="index"
      flat
      class="mb-4"
      style="background-color: #f8f8ff"
    >
      <v-card-title class="text-h6"
        >Пассажир {{ index + 1 }} (Место {{ order?.bookings[index].seatNumber }})</v-card-title
      >

      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="passenger.surname"
              label="Фамилия"
              variant="outlined"
              density="compact"
              hide-details
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="passenger.name"
              label="Имя"
              variant="outlined"
              density="compact"
              hide-details
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="passenger.patronymic"
              label="Отчество"
              variant="outlined"
              density="compact"
              hide-details
              required
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="4">
            <v-select
              v-model="passenger.gender"
              label="Пол"
              :items="genders"
              item-title="name"
              item-value="id"
              variant="outlined"
              density="compact"
              hide-details
              required
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="passenger.dayOfBirth"
              label="Дата рождения"
              variant="outlined"
              density="compact"
              type="date"
              hide-details
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="passenger.documentType"
              :items="identificationDocuments"
              item-title="name"
              item-value="id"
              label="Документ"
              variant="outlined"
              density="compact"
              hide-details
              required
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="passenger.documentNumber"
              label="Серия и номер"
              variant="outlined"
              density="compact"
              hide-details
              required
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card flat>
      <v-card-text class="text-right">
        <div class="text-h5 mb-2">{{ order?.routeSegmentSchedule.price! * passengersCount }} ₽</div>
        <div class="text-caption mb-4">за {{ passengersCount }} пассажиров</div>
        <v-btn type="submit" color="primary" size="large"> Оплатить </v-btn>
      </v-card-text>
    </v-card>
  </v-form>
</template>
