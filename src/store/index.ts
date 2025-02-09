import { createStore } from 'vuex'
import route from './modules/route'
import { state as rootState } from './rootState'

export default createStore({
  state: rootState,
  modules: {
    route
  }
})
