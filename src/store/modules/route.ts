import { type IRouteSearchRequest } from '@/interfaces/IRouteSearchRequest'

// Определите интерфейс для состояния маршрута
interface RouteState {
  routeSearchRequest: IRouteSearchRequest | null
}

const state: RouteState = {
  routeSearchRequest: null
}

// Определение мутаций
const mutations = {
  setRouteSearchRequest(state: RouteState, request: IRouteSearchRequest) {
    state.routeSearchRequest = request
  }
}

// Определение действий
const actions = {
  updateRouteSearchRequest({ commit }: { commit: Function }, request: IRouteSearchRequest) {
    commit('setRouteSearchRequest', request)
  }
}

// Определение геттеров
const getters = {
  getRouteSearchRequest: (state: RouteState): IRouteSearchRequest | null => state.routeSearchRequest
}

// Экспорт модуля
const routeModule = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

export default routeModule
