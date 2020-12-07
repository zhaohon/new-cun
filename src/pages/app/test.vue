<template>
  <tk-container disableScroll>
    <!--用户底部切换-->
    <tkui-button class="primary" @click="test">test</tkui-button>
  </tk-container>
</template>
<script>
export default {
  name: 'home-layout',
  data () {
    return {
    }
  },
  methods: {
    test () {
      this.$setFlash('setFlash', '34u67340698348790')
      this.$back()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>