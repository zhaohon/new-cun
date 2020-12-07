import Vue from 'vue'
import VueTkUI from '@moke/vue-tkui'
import filters from '../assets/js/filters'
import mixin from '../assets/js/mixin'
import '../assets/js/request'
import '@moke/vue-tkui/src/sass/all.scss'
// 初始化tkUI
Vue.use(VueTkUI)

// 全局filter
for (let name in filters) {
  Vue.filter(name, filters[name])
}
// mixin
Vue.mixin(mixin)
