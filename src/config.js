let plugins = ['tk', 'index', 'vuexStorage']
if (process.env.VUE_APP_ENV === 'app') {
  plugins = [
    ...plugins,
    'user',
    'routerAuth'
  ]
}
const config = {
  vuexStorageKeys: [
    'sessionToken',
    'user'
  ],
  plugins: plugins,
  apiUrl: 'http://api.cun.mokekeji.com',
  cloudUrl: 'http://192.168.50.38:3333',
  appID: 'f6tKQTEpQLU4RhvmAKH3nGD9SXcGld5V',
  masterKey: 'BcnByn8LwmOL81DijK2jxcpABPo6S2wi',
  restKey: '',
  statusBarColor: 'black',
  mobileView: true,
  modelJSON: require('./assets/json/model'),
  iconJSON: require('./assets/json/icon'),
  payId: '',
  paysecret: ''
}
export default config
