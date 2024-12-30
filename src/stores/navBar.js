import { createStore } from 'vuex'

export const store = createStore({
  state: {
    isVisible: false
  },
  mutations: {
    setVisible(state, value) {
      state.isVisible = null
      state.isVisible = value
    }
  },
  actions: {
    toggleVisibility({ commit }, value) {
      commit('setVisible', value)
    }
  }
})

