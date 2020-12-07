<template>
  <!--管理服务流程-->
  <tk-container class="feedback_wrapper" infiniteScroll @loadingMore="loadingMore" :status="status">
    <tkui-header slot="header" class="header_border" left>
      <div class="m-r-8" slot="left" @click="$back"><tk-icon size="18">fanhui</tk-icon></div>
      {{navName}}
    </tkui-header>
     <!-- 管理服务流程 -->
    <div class="p-x-15 box-bb feedback_wrapper" v-if="list">
      <ArticleLists :type="typeStatus" :list="list" @toArticle='toArticle($event)'></ArticleLists>
    </div>
     <tkui-button class="primary block" @click.native="$push('/test')">test</tkui-button>
  </tk-container>
</template>

<script>
import ArticleLists from '@/components/ArticleLists.vue'
export default {
  components: {
    ArticleLists
  },
  data () {
    return {
      status: true,
      navName: '列表',
      type: '',
      list: null,
      typeStatus: 'serve',
      num: 10,
      perPage: 10
    }
  },
  mounted () {
    console.log(this.$getFlash('setFlash'))
    this.navName = this.$route.query.type
    this.init()
  },
  methods: {
    async init () {
      try {
        await this.getArticleList()

        this.status = false
      } catch (e) {
        this.status = 'error'
      }
    },
    // 获取文章列表
    async getArticleList () {
      try {
        let type = ''
        if (this.$route.query.type === '管理服务流程') {
          type = 'servicesProcesses'
          this.typeStatus = 'serve'
        } else {
          type = 'villageFveeling'
          this.typeStatus = 'guide'
        }
        this.type = type
        let articleList = await this.$axios.get('/classes/articleList',
          {
            params: {
              limit: this.perPage,
              where: { // 查询条件
                type: type // 字段名：查询条件
              }
            }
          }
        )
        if (articleList.results.length) {
          articleList.results.forEach((item, index) => {
            var data = []
            item.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, function (match, capture) {
              data.push(capture)
            })
            item['img'] = data[0]
          })
          this.list = articleList.results
        } else { this.list = null }
        console.log('articleList:', articleList)
      } catch (e) {
        console.log(e)
      }
    },
    // 去文章详情
    toArticle (event) {
      this.$push({
        path: '/article',
        query: {
          id: event
        }
      })
    },
    // 加载更多
    async loadingMore (page, next) {
      let articleList = await this.$tkParse.getList('/classes/articleList', {
        params: {
          limit: this.perPage,
          skip: this.num,
          where: {
            type: this.type // 字段名：查询条件
          }
        }
      })
      console.log('无限加载', articleList)
      if (articleList.length) {
        articleList.forEach((item, index) => {
          var data = []
          item.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, function (match, capture) {
            data.push(capture)
          })
          item['img'] = data[0]
        })
      }
      console.log('拼接', this.list)
      this.list.push(...articleList)
      this.num = (page + 2) * this.perPage // 目前请求到的结果数
      if (articleList.length === 0 || articleList.length < this.perPage) {
        next('complete')
      } else {
        next('+1')
      }
    }
  },
  hasFlash (flash) {
    console.log(flash, 'index')
  }
}
</script>

<style lang="scss">
.avatar {
    width: 90px;
    height: 60px;
    border-radius: 3px;
}
.content {
    padding: 15px 0 15px 0;
    .title {
      font-weight: 400;
    }
}

</style>
