import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    count: 0,
    message: '歡迎使用 Pinia!'
  }),
  
  getters: {
    doubleCount: (state) => state.count * 2
  },
  
  actions: {
    increment() {
      this.count++
    },
    updateMessage(newMessage) {
      this.message = newMessage
    }
  }
}) 