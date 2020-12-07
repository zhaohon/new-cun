import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    sessionToken: null,
    user: null
  },
  getters: {
  },
  mutations: {
    setSessionToken (state, sessionToken) {
      state.sessionToken = sessionToken
    },
    setUser (state, user) {
      state.user = user
    },
    initFromStorage (state, opt) {
      for (let i in opt) {
        state[i] = opt[i]
      }
    }
  },
  actions: {}
})
export default store
