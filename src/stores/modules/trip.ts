import { type ITripSearchRequest } from '@/modules/tripSearch/interfaces/ITripSearchRequest'

// Определите интерфейс для состояния маршрута
interface TripState {
  tripSearchRequest: ITripSearchRequest | null
}

// Восстановление состояния из localStorage
const savedTripSearchRequest = localStorage.getItem('tripSearchRequest')
const state: TripState = {
  tripSearchRequest: savedTripSearchRequest ? JSON.parse(savedTripSearchRequest) : null
}

// Определение мутаций
const mutations = {
  setTripSearchRequest(state: TripState, request: ITripSearchRequest) {
    state.tripSearchRequest = request
    // Сохраняем состояние в localStorage
    localStorage.setItem('tripSearchRequest', JSON.stringify(request))
  },
  clearTripSearchRequest(state: TripState) {
    state.tripSearchRequest = null
    // Удаляем состояние из localStorage
    localStorage.removeItem('tripSearchRequest')
  }
}

// Определение действий
const actions = {
  updateTripSearchRequest({ commit }: { commit: Function }, request: ITripSearchRequest) {
    commit('setTripSearchRequest', request)
  },
  clearTripSearchRequest({ commit }: { commit: Function }) {
    commit('clearTripSearchRequest')
  }
}

// Определение геттеров
const getters = {
  getTripSearchRequest: (state: TripState): ITripSearchRequest | null => state.tripSearchRequest
}

// Экспорт модуля
const tripModule = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

export default tripModule
