import { tkParse } from '@moke/vue-tk'
export default {
  // 更新用户信息
  async updateUserMsg ({ state, commit }, options) {
    await tkParse.put(`/classes/_User/${state.user.objectId}`, options).catch(e => {
      throw e
    })
    let data = await tkParse.getData(`/classes/_User/${state.user.objectId}`)
    data.sessionToken = state.sessionToken
    commit('setUser', data)
  }
}
