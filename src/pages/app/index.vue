<template>
  <tk-container :status="status" class="bg-white">
    <tkui-header slot="header" left >村务清</tkui-header>
    <tk-flex between middle class="p-x-15 p-y-12 box-bb">
      <tk-flex middle class="fg1">
        <tk-image class="fsh" src="http://moke-store.oss-cn-beijing.aliyuncs.com/5c184f67-9df2-48aa-8336-fb25fafbd1e4.png" width="40"  height="40" ></tk-image>
        <div class="m-l-10 fg1">
          <p class="font-16 font-bold">张家村</p>
          <p class="font-12 color-gray ell">
            河北省石家庄市辛集县任萍乡
          </p>
        </div>
      </tk-flex>
      <tk-flex middle class="p-l-15 top-right fsh" @click.native="$push('/map')">
        <tk-icon size="23">ditu</tk-icon>
        <span class="font-14 m-l-8">地图位置</span>
      </tk-flex>
    </tk-flex>

    <!-- 轮播图 -->
    <div class="p-x-15 p-y-10 box-bb">
      <tk-slider loop >
        <div class="slider-item" v-for="(item, index) in banner.results" :key="index">
          <tk-image class="slider-img" @click.native="toArticle(item.link)" :src="item.image"></tk-image>
        </div>
      </tk-slider>
    </div>

    <!-- 分类 -->
    <div class="p-x-15 p-y-10 box-bb">
      <tk-flex between middle class="p-x-10">
        <div v-for="(item,index) in classifyList" :key="index" @click="toClassifyList(item.text)" >
          <tk-flex middle center class="classify" :style="{backgroundImage: 'url(' + item.backImg + ')'}" >
            <tk-icon color="#FFFFFF" size='28' >{{item.icon}}</tk-icon>
          </tk-flex>
          <span class="font-12 font-bold text-center">{{item.text}}</span>
        </div>
      </tk-flex>
    </div>

    <!-- 民情分诊 -->
    <div class="p-x-15 p-y-10 box-bb">
      <tk-flex middle between class="triage-box p-x-15 box-bb" >
        <div @click="$push('/triageList')" >
          <tk-flex middle class="font-20 color-white">
            民情分诊<tk-icon size="16" color="#FFFFFF" class="m-l-5" >gengduo</tk-icon >
          </tk-flex>
          <div class="font-12 color-white m-t-8">24小时客服为您提供咨询</div>
        </div>
        <div class="feedback_button font-14 font-bold text-center" @click="$push('/help')">立即反馈</div>
      </tk-flex>
    </div>

    <!-- 管理服务流程 -->
    <div class="p-x-15 p-y-10 box-bb" v-if="serveList.length">
      <tk-flex middle between class="" @click.native="toArticleList('管理服务流程')">
        <div class="font-16 font-bold">管理服务流程</div>
        <tk-flex middle class="font-12">
          更多
          <tk-icon size="12" color="#999999">gengduo</tk-icon>
        </tk-flex>
      </tk-flex>
      <ArticleLists type="serve" :list="serveList" @toArticle='toArticle($event)'></ArticleLists>
    </div>

    <!-- 村情指南 -->
    <div class="p-x-15 p-y-10 box-bb" v-if="serveList.length">
      <tk-flex middle between class="" @click.native="toArticleList('村情指南')">
        <div class="font-16 font-bold">村情指南</div>
        <tk-flex middle class="font-12">
          更多
          <tk-icon size="12" color="#999999">gengduo</tk-icon>
        </tk-flex>
      </tk-flex>
      <ArticleLists type="guide" :list="guideList" @toArticle='toArticle($event)'></ArticleLists>
    </div>
  </tk-container>
</template>

<script>
import ArticleLists from '@/components/ArticleLists.vue'
export default {
  components: {
    ArticleLists
  },
  name: 'home-layout',
  data () {
    return {
      status: 'loading',
      banner: [],
      articleClassification: [],
      serveList: [],
      guideList: [],
      classifyList: [{ backImg: 'http://moke-store.oss-cn-beijing.aliyuncs.com/4585bf77-773d-484a-9ffd-85d3043c5e32.png', icon: 'cunwu', text: '村务公开' }, { backImg: 'http://moke-store.oss-cn-beijing.aliyuncs.com/d269e39a-ce4b-431d-b4fb-466a6ffa3421.png', icon: 'dangwu', text: '党务公开' }, { backImg: 'http://moke-store.oss-cn-beijing.aliyuncs.com/117cb1ff-8bc4-471a-881d-6c1749b07912.png', icon: 'caiwu', text: '财务公开' }, { backImg: 'http://moke-store.oss-cn-beijing.aliyuncs.com/41de4b2b-e652-4e4b-ae14-c9871e1217bb.png', icon: 'jiandu', text: '村级监督' }]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    // 初始化
    async init () {
      try {
        await this.getBanner()
        await this.getArticleClassification()
        await this.getLocationArr()
        await this.getMyLocation()
        await this.getArticleList()

        this.status = false
      } catch (e) {
        this.status = 'error'
      }
    },
    // 获取轮播图
    async getBanner () {
      try {
        this.banner = await this.$axios.get('/classes/banner')
        console.log('banner:', this.banner.results)
      } catch (e) {
        console.log(e)
      }
    },
    // 轮播跳转文章
    toArticle (id) {
      this.$push({
        path: '/article',
        query: {
          id: id
        }
      })
    },
    // 获取分类
    async getArticleClassification () {
      try {
        this.articleClassification = await this.$axios.get('/classes/articleClassification')
        console.log('分类:', this.articleClassification.results)
      } catch (e) {
        console.log(e)
      }
    },
    // 获取文章列表
    async getArticleList () {
      try {
        let serveList = await this.$axios.get('/classes/articleList', {
          params: {
            limit: 3,
            where: { // 查询条件
              type: 'servicesProcesses' // 字段名：查询条件
            }
          }
        })
        let guideList = await this.$axios.get('/classes/articleList', {
          params: {
            limit: 6,
            where: { // 查询条件
              type: 'villageFveeling' // 字段名：查询条件
            }
          }
        })
        if (serveList.results.length) {
          serveList.results.forEach((item, index) => {
            var data = []
            item.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, function (match, capture) {
              data.push(capture)
            })
            item['img'] = data[0]
          })
          this.serveList = serveList.results
        } else { this.serveList = null }
        if (guideList.results.length) {
          guideList.results.forEach((item, index) => {
            var data = []
            item.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, function (match, capture) {
              data.push(capture)
            })
            item['img'] = data[0]
          })
          this.guideList = guideList.results
        } else { this.guideList = null }
      } catch (e) {
        console.log(e)
      }
    },
    // 获取地理位置
    async getLocationArr () {
      try {
        let position = await this.$axios.get('/classes/village')
        console.log('获取附近的所有村庄', position.results)
        // this.latitude = position.latitude
        // this.longitude = position.longitude
        // this.getCurrentCity(position.id)
      } catch (e) {
        console.log(e)
      }
    },
    async getMyLocation () {
      // console.log('获取')
      // navigator.geolocation.getCurrentPosition((res) => {
      //   console.log('数据', res.coords)
      // }, (err) => {
      //   console.log('数据', err)
      // })

      // let options = { 'parse': false, 'enableHighAccuracy': false, 'timeout': 10000 }
      // let position = await this.$tkGeolocation.getCurrentPosition(options)
      //   .catch(e => {
      //     console.log(e)
      //   })
      // console.log('我的', position)
    },

    // 跳转分类
    toClassifyList (status) {
      let type = ''
      if (status === '村务公开') {
        type = 'villageTransparent'
      } else if (status === '财务公开') {
        type = 'financeTransparent'
      } else if (status === '村级监督') {
        type = 'villageMonitoring'
      } else {
        type = 'partyTransparent'
      }
      this.$push({
        path: '/classifyList',
        query: {
          type: type
        }
      })
    },
    toArticleList (type) {
      this.$push({
        path: '/articleList',
        query: {
          type: type
        }
      })
    }
  }
}
</script>
<style lang="scss">
// 头部
.top-right {
  position: relative;
  &::before {
    content: "";
    width: 0;
    height: 25px;
    border-left: 1px solid #999999;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}

.slider-item{
  border-radius: 5px;
  overflow: hidden;
  .slider-img{
    width: 100%;
    height:140px;
  border-radius: 5px;

  }

}
//轮播指示点
.dots{
  .dot{width: 5px;height: 5px;}
  .active{width: 5px!important;}
}

// 分类
.classify {
  width: 45px;
  height: 45px;
  background-size: 100%;
  margin-bottom: 8px;
}

// 民情
.triage-box {
  height: 81px;
  background-image: url("http://moke-store.oss-cn-beijing.aliyuncs.com/d79ceee7-ba88-4ca2-ad0f-602bcac3587f.png");
  background-size: 100%;
  .feedback_button {
    width: 72px;
    height: 28px;
    line-height: 26px;
    border: 1px solid #ffffff;
    background-color: #ffffff;
    border-radius: 14px;
    color: #269bf2;
  }
}

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
// 阅读
.read{
  padding: 0 4px;
  background-color: #E6EDFB;
  border-radius: 2px;
  color: #0e53d9;
}
</style>
