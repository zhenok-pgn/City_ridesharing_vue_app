import { defineStore } from 'pinia'

export const useRoutesHistoryStore = defineStore('routesHistory', {
  state: () => ({
    historyStack: [] as string[] // Stack to store route history
  }),
  actions: {
    // Push a new route to the stack
    pushRoute(route: string) {
      this.historyStack.push(route)
    },
    // Pop the last route from the stack
    popRoute() {
      return this.historyStack.pop()
    },
    // Peek at the last route without removing it
    peekRoute() {
      return this.historyStack[this.historyStack.length - 1] || null
    },
    // Clear the entire history stack
    clearHistory() {
      this.historyStack = []
    }
  },
  getters: {
    // Check if the history stack is empty
    isEmpty: (state) => state.historyStack.length === 0,
    // Get the size of the history stack
    size: (state) => state.historyStack.length
  },
  persist: true
})
