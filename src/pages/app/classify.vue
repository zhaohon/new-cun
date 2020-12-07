<template>
  <!--帮助反馈-->
  <tk-container class="bg-white" :status="status">
    <tkui-header slot="header" class="header_border" left>
      <div class="m-r-8" slot="left" @click="$back"><tk-icon size="18">fanhui</tk-icon></div>
      分类
    </tkui-header>
    <tk-flex middle wrap class="header_nav_wrappers p-l-8 p-r-5">
        <div v-for="(item,index) in navList" :key="index" :class="active == index?'actives':''" @click="back(item.name,index)">
            {{item.name}}
        </div>
    </tk-flex>

  </tk-container>
</template>

<script>
export default {
  data () {
    return {
      status: 'loading',
      active: 0, // 导航默认选中
      navList: []// 导航列表数据
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    // 初始化
    async init () {
      try {
        this.navList = [{ name: 235 }]
        this.active = this.$route.query.active
        this.status = false
      } catch (e) {
        this.status = 'error'
      }
    },
    // 返回
    back (name, index) {
      this.active = index
      this.$setFlash('flashIndex', 7568756)
      this.$back()
    }
  }
}
</script>

<style lang="scss" scoped>

  .header_nav_wrappers{
      div{
        width: 76px;
        height: 41px;
        line-height: 41px;
        background-color: #f5f5f5;
        border-radius: 3px;
        text-align: center;
        font-size: 13px;
        flex-shrink: 0;
        color: #222222;
        margin: 7px;
      }
  }

// 导航选中的样式
ul::-webkit-scrollbar {
  display: none;
}
.actives{
  color:#0e66d9 !important;
}

</style>
