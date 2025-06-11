<script lang="ts">
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/auth'
import { toast } from '@/plugins/toast'

export default defineComponent({
  components: {
    RouterView
  },
  data() {
    return {
      drawer: false, // Для управления боковой панелью навигации
      authStore: useAuthStore()
    }
  },
  computed: {
    isAuthenticated() {
      return this.authStore.isAuthenticated
    }
  }
})
</script>

<!--Общая структура приложения-->
<template>
  <!-- App bar -->
  <v-app-bar app color="primary" dark flat>
    <v-container class="d-flex align-center" style="max-width: 1140px; margin: auto">
      <v-toolbar-title class="cursor-pointer font-weight-bold text-h6" @click="$router.push('/')">
        <v-icon start>mdi-bus</v-icon>
        <span class="d-none d-sm-inline">АвтоBus</span>
      </v-toolbar-title>

      <v-spacer />

      <!-- Когда пользователь авторизован -->
      <div v-if="isAuthenticated">
        <v-btn text to="/profile" tag="router-link">
          <v-icon start>mdi-account</v-icon>
          <span class="d-none d-md-inline">{{ authStore.user?.username }}</span>
        </v-btn>
        <v-btn icon @click.stop="drawer = !drawer" class="mr-2">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </div>

      <!-- Когда не авторизован -->
      <v-btn text to="/login" tag="router-link" v-else>
        <v-icon start>mdi-login</v-icon>
        <span class="d-none d-md-inline">Войти</span>
      </v-btn>
    </v-container>
  </v-app-bar>

  <!-- Right navigation drawer (only for authenticated users) -->
  <v-navigation-drawer
    v-if="isAuthenticated"
    v-model="drawer"
    app
    location="right"
    temporary
    width="280"
  >
    <v-list nav dense>
      <v-list-item
        prepend-icon="mdi-account"
        title="Профиль"
        value="profile"
        to="/profile"
      ></v-list-item>
      <v-divider class="my-2"></v-divider>
      <v-list-item
        prepend-icon="mdi-history"
        title="История заказов"
        value="history"
        :to="{ name: 'user-orders' }"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <!-- Page content -->
  <v-main>
    <v-container fluid class="px-0 px-sm-4" style="max-width: 1140px; margin: auto">
      <RouterView />
    </v-container>
  </v-main>
</template>

<style scoped></style>
