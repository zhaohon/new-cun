import router from '../router'
import VueTk from '@moke/vue-tk'
import store from '../store/index'
const rulers = [
  {
    match: '*',
    except: [
      '/app/login'
    ],
    handler: async function (route, next) { // 路由鉴权方法
      // 判断路由是否有权访问
      if (!!store.state.user && !!store.state.sessionToken && process.env.VUE_APP_ENV === 'app') {
        // 用户鉴权
        next(true)
      } else { // 未登录状态下的用户鉴权
        next('/app/login')
      }
    },
    // 禁止访问的跳转地址，优先级低于handler中返回的地址
    fallbackUrl: '/app/login'
  }
]

VueTk.tkRouterAuth.init(rulers, router)
