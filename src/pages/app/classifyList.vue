<template>
  <!--帮助反馈-->
  <tk-container class="bg-white" :status="status">
    <tkui-header slot="header" class="header_border" left>
      <div class="m-r-8" slot="left" @click="$back">
        <tk-icon size="18">fanhui</tk-icon>
      </div>
      {{navName}}
    </tkui-header>
    <tkui-header slot="header" class="header_nav p-x-0" v-if="navList.length">
      <div class="header_nav_wrapper">
        <div class="header_nav_wrapper_left">
          <van-tabs v-model="active" swipeable color="#0e66d9" title-active-color="#0e66d9" line-height="2px" line-width="28px" @change="onClick" >
            <van-tab v-for="(item,index) in navList" :key="index" :title="item.name">
              <div style="width:100%;background:red;" :style="{height: fillHeught + 'px'}" >
              <!-- <div style="width:100%;background:red;height: calc(100% - 88px)"> -->
                <tk-container class="container-wrap" hideStatusBar infiniteScroll @loadingMore="loadingMore" >
                  <!-- 循环列表 -->
                  <div class="box-bb p-x-15" style="width:100%;">
                    <ArticleLists type="classify" :list="list" @toArticle="toArticle($event)"></ArticleLists>
                  </div>
                </tk-container>
              </div>
            </van-tab>
          </van-tabs>
        </div>
        <div @click="changeClassify()" class="p-t-10 more">
          <tk-icon size="24" color="#99999" class="m-l-10 fsh">fenlei</tk-icon>
        </div>
      </div>
    </tkui-header>
  </tk-container>
</template>

<script>
// import Images from '@/components/Images.vue'
import ArticleLists from '@/components/ArticleLists.vue'
export default {
  components: {
    // Images,
    ArticleLists
  },
  data () {
    return {
      status: 'loading',
      navName: '村务公开',
      list: null,
      active: 0,
      navList: [], // 导航列表数据
      num: 10,
      perPage: 10,
      fillHeught: 0
    }
  },
  beforeMount (height) {
    var h = document.documentElement.clientHeight || document.body.clientHeight
    this.fillHeught = h - 88 // 减去页面上固定高度height
    console.log(this.fillHeught)
  },
  mounted () {
    this.init()
  },
  activated () {
    console.log(this.$getFlash('flashIndex'), 'getFlash2')
  },
  hasFlash (hasFlash) {
    console.log(hasFlash, 'index')
  },
  methods: {
    onClick (name, title) {
      console.log(name, title)
      this.active = name
      this.getArticleList()
    },
    // 初始化
    async init () {
      try {
        await this.getNavList()
        this.status = false
      } catch (e) {
        this.status = 'error'
      }
    },
    // 获取分类
    async getNavList () {
      try {
        let name = ''
        if (this.$route.query.type === 'villageTransparent') {
          name = '村务公开'
        } else if (this.$route.query.type === 'financeTransparent') {
          name = '财务公开'
        } else if (this.$route.query.type === 'villageMonitoring') {
          name = '村级监督'
        } else {
          name = '党务公开'
        }
        this.navName = name
        await this.$axios.get(
          '/classes/articleClassification',
          {
            params: {
              where: {
                // 查询条件
                type: this.$route.query.type // 字段名：查询二级分类
              }
            }
          }
        ).then((data) => {
          console.log('分类获取到了', data)
          this.navList = data.results
          this.getArticleList()
        })
      } catch (e) {
        console.log(e)
      }
    },
    // 获取分类列表
    async getArticleList () {
      try {
        console.log(this.navList)
        if (!this.navList.length) {
          return
        }
        let articleList = await this.$axios.get('/classes/articleList',
          {
            params: {
              limit: this.perPage,
              where: { // 查询条件
                articleClassification: this.navList[this.active].objectId // 字段名：查询条件
              }
            }
          }
        )
        articleList.results.forEach((item, index) => {
          var data = []
          var str = []
          item.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, function (match, capture) {
            data.push(capture)
            str.push(match)
          })
          item['img'] = data[0]
        })
        this.list = articleList.results
      } catch (e) {
        console.log(e)
      }
    },
    changeClassify () {
      console.log('跳转', this.indexTap)
      this.$push({
        path: '/classify'
        // query: {
        //   status: this.navList,
        //   active: this.active
        // }
      })
    },
    // 加载更多
    async loadingMore (page, next) {
      console.log(this.navList)
      if (!this.navList.length) {
        next('complete')
        return
      }
      let articleList = await this.$axios.get('/classes/articleList', {
        params: {
          limit: this.perPage,
          skip: this.num,
          where: {
            articleClassification: this.navList[this.active].objectId // 字段名：查询条件
          }
        }
      })
      if (articleList.results.length) {
        articleList.forEach((item, index) => {
          var data = []
          item.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, function (match, capture) {
            data.push(capture)
          })
          item['img'] = data[0]
        })
      }
      this.list.push(...articleList.results)
      this.num = (page + 2) * this.perPage // 目前请求到的结果数
      if (articleList.results.length === 0 || articleList.results.length < this.perPage) {
        next('complete')
      } else {
        next('+1')
      }
    }
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

.header_nav {
  border: 1px solid #f5f5f5;
  .header_nav_wrapper {
    width: 100%;
    overflow: hidden;
    div {
      // display: inline-block;
    }
  }
}

.van-tabs__nav--line {
  padding-left: 15px;
  width: 95%;
}

.header_nav .header_nav_wrapper {
  position: relative;
}

.header_nav_wrapper_left {
  width: 100%;
}
.more {
  position: absolute;
  top: 0;
  right: 8px;
  display: inline-block;
}

.img {
  width: 112px;
  height: 75px;
  border-radius: 3px;
}
.van-tabs--line .van-tabs__wrap {
  padding-right: 30px !important;
}
.van-tab{
  flex: none;
  margin-right: 12px;

}
</style>
