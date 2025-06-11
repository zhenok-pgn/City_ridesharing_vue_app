<!--Главная страница поиска для пассажира-->

<template>
  <v-row justify="center">
    <v-col cols="12">
      <v-card class="pa-4 mx-auto" max-width="600" outlined>
        <v-card-title class="text-h5 text-center">Найдите поездку</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="searchTrips">
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
            <v-text-field
              v-model="tripSearchRequest.date"
              label="Дата поездки"
              type="date"
              required
              class="mt-4"
              :rules="[rules.required]"
            ></v-text-field>
            <v-btn type="submit" color="primary" class="mt-4" block> Найти </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { createTripSearchRequest } from '@/modules/tripSearch/interfaces/ITripSearchRequest'
import type { ILocality } from '@/interfaces/locality'
import { localitiesApi } from '../api/localitiesApi'
import { useLoadingStore } from '@/stores/loadingStore'

export default defineComponent({
  data() {
    return {
      loadingStore: useLoadingStore(),
      localities: [] as ILocality[],
      tripSearchRequest: createTripSearchRequest(),
      rules: {
        required: (value: string) => !!value || 'Поле обязательно для заполнения'
      }
    }
  },
  methods: {
    searchTrips() {
      // Логика поиска поездокs
      this.$router.push({
        name: 'trips-search-list',
        params: {
          from: this.tripSearchRequest.from.id,
          to: this.tripSearchRequest.to.id,
          date: this.tripSearchRequest.date
        }
      })
    },
    async onOpen() {
      if (this.localities.length === 0) {
        this.localities = (await localitiesApi.getLocalities()).data
      }
    }
  },
  async mounted() {}
})
</script>
