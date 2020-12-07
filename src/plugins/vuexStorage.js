import VueTk from '@moke/vue-tk'
import config from '../config'
import store from '../store'
VueTk.tkVuexStorage.init(store, config.vuexStorageKeys)
let storageStore = VueTk.tkVuexStorage.restoreStorage()
store.commit('initFromStorage', storageStore)
