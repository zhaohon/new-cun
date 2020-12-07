// import Vue from 'vue'
import store from '@/store/index'
import VueTk from '@moke/vue-tk'
export default async () => {
  // TODO: 完成用户自动登录
  // 用户自动登录
  if (!store.state.sessionToken) {
    return
  }
  VueTk.tkParse.setSessionToken(store.state.sessionToken)
  // Vue.prototype.$cloudAjax.config.headers = {
  //   'X-Parse-Session-Token': store.state.sessionToken
  // }
  let user = await VueTk.tkParse.getData('/users/me').catch(() => {
    store.commit('setSessionToken', null)
    store.commit('setUser', null)
    VueTk.tkParse.setSessionToken('')
  })
  if (!user) return
  store.commit('setUser', user)
}
