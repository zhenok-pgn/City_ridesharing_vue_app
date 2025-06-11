<template>
  <v-card class="pa-6 mx-auto" max-width="800">
    <!-- Заголовок и кнопка -->
    <v-row align="center" justify="space-between">
      <div class="text-h6 font-weight-bold">Профиль</div>
      <v-btn flat @click="editDialog = true">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </v-row>

    <v-divider class="my-4"></v-divider>

    <!-- Личные данные -->
    <v-row>
      <v-col cols="12" sm="6">
        <div class="text-caption text-grey">ФИО</div>
        <div class="text-subtitle-1">{{ profile.name }}</div>
      </v-col>

      <v-col cols="12" sm="6">
        <div class="text-caption text-grey">Email</div>
        <div class="text-subtitle-1">{{ profile.email }}</div>
      </v-col>

      <v-col cols="12" sm="6">
        <div class="text-caption text-grey">Телефон</div>
        <div class="text-subtitle-1">{{ profile.phone }}</div>
      </v-col>

      <v-col cols="12" sm="6">
        <div class="text-caption text-grey">Дата рождения</div>
        <div class="text-subtitle-1">{{ profile.birthdate }}</div>
      </v-col>
    </v-row>
  </v-card>
  <v-row align="center" justify="center" class="mt-4">
    <v-btn color="red" @click="logout">Выйти</v-btn>
  </v-row>

  <!-- Диалог редактирования -->
  <v-dialog v-model="editDialog" max-width="500">
    <v-card>
      <v-card-title class="text-h6">Редактирование профиля</v-card-title>
      <v-card-text>
        <v-text-field v-model="editForm.name" label="ФИО" />
        <v-text-field v-model="editForm.email" label="Email" />
        <v-text-field v-model="editForm.phone" label="Телефон" />
        <v-text-field v-model="editForm.birthdate" label="Дата рождения" type="date" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="editDialog = false">Отмена</v-btn>
        <v-btn color="primary" @click="saveChanges">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useAuthStore } from '@/modules/auth/stores/auth'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { toast } from '@/plugins/toast'

const profile = ref({
  name: 'Иван Иванов',
  email: 'ivan@example.com',
  phone: '+7 999 123-45-67',
  birthdate: '1990-01-01' // Пример даты рождения
})

const router = useRouter()
const editDialog = ref(false)
const editForm = ref({ ...profile.value })

const saveChanges = () => {
  profile.value = { ...editForm.value }
  editDialog.value = false
}

const logout = () => {
  useAuthStore()
    .logout()
    .then(() => {
      router.go(-1)
    })
    .catch((error) => {
      toast.error('Ошибка при выходе:' + error.message)
    })
}
</script>
