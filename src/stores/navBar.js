import { createStore } from 'vuex'

export const store = createStore({
  state: {
    isVisible: false,
    isAuthenticated: false,
  },
  mutations: {
    setVisible(state, value) {
      state.isVisible = null
      state.isVisible = value
    },
    setAuthenticated(state, value) {
      state.isAuthenticated = value
    }

  },
  actions: {
    toggleVisibility({ commit }, value) {
      commit('setVisible', value)
    },
  }
})

