<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <v-card class="pa-0 pa-sm-4 mx-auto" max-width="500" elevation="2">
          <v-card-title class="text-h6 px-0 d-flex align-center justify-space-between">
            <v-btn icon @click="goBack" color="primary" variant="text">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <span class="text-h6 font-weight-medium">
              {{ isLoginMode ? 'Вход' : 'Регистрация' }}
            </span>
            <div style="width: 40px"></div>
          </v-card-title>

          <!-- Форма -->
          <v-card-text>
            <v-form @submit.prevent="isLoginMode ? login() : register()">
              <v-text-field v-if="!isLoginMode" v-model="surname" label="Фамилия" required />
              <v-text-field v-if="!isLoginMode" v-model="name" label="Имя" required />
              <v-text-field v-if="!isLoginMode" v-model="patronymic" label="Отчество" />
              <v-text-field v-if="!isLoginMode" v-model="phone" label="Телефон" />
              <v-text-field v-model="username" label="Email" type="email" required />
              <v-text-field v-model="password" label="Пароль" type="password" required />
              <v-text-field
                v-if="!isLoginMode"
                v-model="confirmPassword"
                label="Подтвердите пароль"
                type="password"
                required
              />
              <v-btn type="submit" color="primary" class="mt-4" block>
                {{ isLoginMode ? 'Войти' : 'Зарегистрироваться' }}
              </v-btn>
            </v-form>
          </v-card-text>

          <!-- Переключение между режимами -->
          <v-card-actions class="justify-center">
            <v-btn text @click="toggleMode">
              {{ isLoginMode ? 'Зарегистрироваться' : 'Уже есть аккаунт? Войдите' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/auth'
import { toast } from '@/plugins/toast'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const surname = ref('')
const name = ref('')
const patronymic = ref()
const phone = ref('')
const isLoginMode = ref(true) // Toggle between login and registration
const router = useRouter()
const authStore = useAuthStore()

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
}

const goBack = () => {
  router.go(-1) // Возврат на предыдущую страницу
}

const login = async () => {
  authStore.login(username.value, password.value).then(() => {
    goBack()
  }) // Возврат на предыдущую страницу
}

const register = async () => {
  if (password.value !== confirmPassword.value) {
    toast.error('Пароли не совпадают')
    return
  }

  authStore
    .register(
      username.value,
      password.value,
      surname.value,
      name.value,
      patronymic.value,
      phone.value
    )
    .then(() => {
      /*toast.success('Регистрация прошла успешно')
    router.push('/login') // Перенаправление на страницу входа*/
      goBack()
    })
}
</script>

<style scoped>
/* Добавьте стили по необходимости */
</style>
