export default {
  initFromStorage (state, opt) {
    for (const i in opt) {
      state[i] = opt[i]
    }
  },
  setSessionToken (state, sessionToken) {
    state.sessionToken = sessionToken
  },
  setUser (state, user) {
    state.user = user
  }
}
