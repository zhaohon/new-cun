<template>
  <tk-history>
    <router-view/>
  </tk-history>
</template>
<script>
export default {
  name: 'home-layout',
  data () {
    return {
      menu: [
        // {
        //   icon: 'Home',
        //   text: '首页',
        //   path: '/'
        // }, {
        //   icon: 'Shopping',
        //   text: '购物车',
        //   path: '/cart'
        // }, {
        //   icon: 'Mine',
        //   text: '我的',
        //   path: '/user'
        // }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
