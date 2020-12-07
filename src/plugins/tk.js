import Vue from 'vue'
import VueTk from '@moke/vue-tk'
import router from '../router'
import config from '../config'
import '@moke/vue-tk/dist/vue-tk.css'
Vue.use(VueTk)
const options = {
  vue: Vue, // vue示例，tkAjax 的必需项
  router: router, // tkHistory 与 tkRouterAuth 的必需项
  autoCloseSplashscreen: true, // 自动关闭引导页，默认true
  fastclick: true, // 开启fastclick，默认true
  statusBar: { // 全局状态栏设置
    color: config.statusBarColor // 状态栏颜色
  },
  icon: { // 图标配置
    ctoken: config.iconCToken,
    EGG_SESS: config.iconEggSess,
    custom: { // 自定义图标，参考tkIcon配置项
      default: {
        code: config.iconCode,
        // 在dev环境下使用在线图标，在生产环境下使用本地json
        // p.tkIconConfig.setMode(t.icon.mode)
        data: config.iconJSON,
        // data: process.env.NODE_ENV === 'development' ? undefined : config.iconJSON,
        type: 'private',
        useClassAsName: true
      }
    }
  },
  container: {
    mobileView: config.mobileView // 在pc上缩小显示范围到手机大小
  },
  history: { // tkHistory 配置
    transtionMode: 'auto'
  },
  ajax: { // tkAjax配置项
    global: { // 全局ajax配置
      headers: {}
    }
  },
  parse: { // tkParse配置项
    appId: config.appID,
    restKey: config.restKey,
    baseURL: config.apiUrl,
    model: config.modelJSON
  },
  payment: {
    appId: config.payId,
    appsecret: config.paysecret
  }
}
VueTk.init(options)
