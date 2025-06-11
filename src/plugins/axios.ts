import { useAuthStore } from '@/modules/auth/stores/auth'
import { authApi } from '@/modules/auth/api/authApi'
import axios from 'axios'
import { toast } from './toast'
import { useLoadingStore } from '@/stores/loadingStore'

const instance = axios.create({
  baseURL: '/server', //import.meta.env.VITE_API_URL,
  withCredentials: true
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: any) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error?: any, token?: string) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

instance.interceptors.request.use(
  (config) => {
    useLoadingStore().start()
    const auth = useAuthStore()
    if (auth.accessToken) {
      config.headers.Authorization = `Bearer ${auth.accessToken}`
    }
    return config
  },
  (error) => {
    useLoadingStore().stop() // Останавливаем анимацию загрузки в случае ошибки
    return Promise.reject(error) // Возвращаем ошибку
  }
)

instance.interceptors.response.use(
  (response) => {
    useLoadingStore().stop()
    console.log('Response:', response)
    return response
  },
  async (error) => {
    useLoadingStore().stop()

    const originalRequest = error.config
    const auth = useAuthStore()

    // без отображения ошибки
    if (
      originalRequest.url?.includes('/auth/logout') ||
      originalRequest.url?.includes('/auth/refresh')
    ) {
      return Promise.reject(error)
    }

    if (
      error.response?.status !== 401 ||
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/passenger/register') ||
      originalRequest._retry
    ) {
      showErrorToast(error)
      return Promise.reject(error)
    }

    originalRequest._retry = true

    // Если уже идет обновление токена - добавляем в очередь
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return instance(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    isRefreshing = true

    try {
      const { data } = await authApi.refresh()
      const newToken = data.accessToken
      auth.setAccessToken(newToken)

      // Обновляем оригинальный запрос
      originalRequest.headers.Authorization = `Bearer ${newToken}`

      // Обрабатываем очередь
      processQueue(undefined, newToken)

      // Повторяем оригинальный запрос
      return instance(originalRequest)
    } catch (refreshError) {
      // При ошибке обновления очищаем аутентификацию
      processQueue(refreshError)
      await auth.logout()
      toast.error('Сессия истекла. Пожалуйста, войдите снова.')
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

function showErrorToast(error: any) {
  const message =
    error.response?.data?.message || error.message || 'Произошла ошибка при выполнении запроса'
  toast.error(message)
}

export default instance
