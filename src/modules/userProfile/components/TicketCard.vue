<template>
  <v-card class="pa-4" hover>
    <div class="d-flex justify-space-between align-center mb-2">
      <div class="text-subtitle-1 font-weight-medium">{{ ticket.company }}</div>
      <v-chip color="grey" size="small">Завершено</v-chip>
    </div>

    <v-row>
      <v-col cols="6">
        <div class="text-h6">{{ formatTime(ticket.departure) }}</div>
        <div class="text-caption grey">{{ formatDate(ticket.departure) }}</div>
        <div class="mt-1 font-weight-medium">{{ ticket.from }}</div>
      </v-col>

      <v-col cols="6" class="text-right">
        <div class="text-h6">{{ formatTime(ticket.arrival) }}</div>
        <div class="text-caption grey">{{ formatDate(ticket.arrival) }}</div>
        <div class="mt-1 font-weight-medium">{{ ticket.to }}</div>
      </v-col>
    </v-row>

    <v-divider class="my-3" />

    <v-row align="center" justify="space-between">
      <div class="text-body-2">
        {{ ticket.price * ticket.passengers }}₽
        <span class="grey">за {{ ticket.passengers }} мест</span>
      </div>
      <v-btn
        color="primary"
        size="small"
        variant="flat"
        :to="{ name: 'user-order-details', params: { id: ticket.id } }"
      >
        Подробнее
      </v-btn>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
defineProps({
  ticket: Object
})

const formatTime = (date) =>
  new Date(date).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
const formatDate = (date) =>
  new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    weekday: 'short'
  })
</script>
