import Vue from 'vue'
import axios from 'axios'
import store from '../../store/index'
import config from '../../config'

// axios.defaults.headers.post['Content-Type'] = 'application/json'
// 创建一个axios实例
const service = axios.create({
  baseURL: config.cloudUrl, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // 设置超时时间为10s
})
const _axiosGlobal = service.defaults
// request拦截器 ==> 对请求参数进行处理
service.interceptors.request.use(
  config => {
    // 可以在发送请求之前做些事情
    // 比如请求参数的处理·在headers中携带token等
    const accessToken = store.state.sessionToken
    if (accessToken) config.headers.Authorization = accessToken
    return config
  },
  error => {
    // 处理请求错误
    console.log(error, 'err') // for debug
    return Promise.reject(error)
  }
)

// response拦截器 ==> 对相应做处理
service.interceptors.response.use(
  response => {
    const res = response.data
    // 如果自定义的返回码不等于200，就返回一个错误
    if (res.success === false) {
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    return Promise.reject(error)
  }
)
Plugin.install = function (Vue, options) {
  Vue.axios = service
  window.axios = service
  Object.defineProperties(Vue.prototype, {
    axios: {
      get () {
        return service
      }
    },
    $axios: {
      get () {
        return service
      }
    },
    $baseURL: {
      get () {
        return config.cloudUrl
      }
    },
    axiosGlobal: {
      get () {
        return _axiosGlobal
      }
    },
    $axiosGlobal: {
      get () {
        return service.defaults
      }
    }
  })
}

Vue.use(Plugin)

export default service
