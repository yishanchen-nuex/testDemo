import { defineStore } from 'pinia'

interface MainState {
  count: number
  message: string
}

export const useMainStore = defineStore('main', {
  state: (): MainState => ({
    count: 0,
    message: '歡迎使用 Pinia!',
  }),

  getters: {
    doubleCount: state => state.count * 2,
  },

  actions: {
    increment() {
      this.count++
    },
    updateMessage(newMessage: string) {
      this.message = newMessage
    },
  },
})
