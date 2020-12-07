<template>
  <!--民情分诊-->
  <tk-container :status="status" class="container" infiniteScroll @loadingMore="loadingMore">
    <tkui-header slot="header" class="header_border" left>
      <div class="m-r-8" slot="left" @click="$back">
        <tk-icon size="18">fanhui</tk-icon>
      </div>民情分诊
      <div slot="right" @click="$push('/help')">
        <tk-icon size="24">xinjian</tk-icon>
      </div>
    </tkui-header>

    <!-- 民情分诊列表 -->
    <div v-for="(item,index) in triageList" :key="index" >
      <div class="p-x-15 box-bb bg-white" @click="toDetail(item.objectId)">
        <div class="p-y-16 m-b-10">
          <div class="ell_2 font-14 m-b-10">{{item.description}}</div>
          <Images type="triage" :imgs="item.imgArr"></Images>
          <div class="font-12 color-light-gray m-t-8">
            <span>{{item.createdAt | date}}</span>
            <span class="m-l-8">{{item.createdAt | datetime}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="p-x-15 box-bb bg-white">
      <div class="p-y-16 m-b-10">
        <div class="ell_2 font-14 m-b-10">国务院颁布国家最新商铺增收最新商铺增商铺增收税收税收政策</div>
        <Images v-if="imgs.length != 0" type="triage" :imgs="imgs"></Images>
        <div class="font-12 color-light-gray m-t-8">
          <span>2020年11月24日</span>
          <span class="m-l-8">16:00</span>
        </div>
      </div>
    </div> -->
  </tk-container>
</template>

<script>
import Images from '@/components/Images.vue'
export default {
  components: {
    Images
  },
  data () {
    return {
      status: 'loading',
      triageList: null,
      num: 5,
      perPage: 5
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    // 初始化
    async init () {
      try {
        await this.getTriageList()

        this.status = false
      } catch (e) {
        this.status = 'error'
      }
    },
    // 获取文章列表
    async getTriageList () {
      try {
        let triageList = await this.$axios.get('/classes/triageList', {
          params: {
            limit: 5
          }
        })
        if (triageList.results.length) {
          this.triageList = triageList.results
        } else { this.triageList = null }
        console.log(this.triageList, '数据')
      } catch (e) {
        console.log(e)
      }
    },
    // 加载更多
    async loadingMore (page, next) {
      console.log('拼接--', this.triageList)
      let triageList = await this.$tkParse.getList('/classes/triageList', {
        params: {
          limit: this.perPage,
          skip: this.num
        }
      })
      console.log('无限加载', triageList)
      console.log('拼接', this.triageList)
      this.triageList.push(...triageList)
      console.log('页数', page)
      this.num = (page + 2) * this.perPage // 目前请求到的结果数
      if (triageList.length === 0 || triageList.length < this.perPage) {
        next('complete')
      } else {
        next('+1')
      }
    },
    toDetail (id) {
      console.log('跳转')
      this.$push({
        path: '/triageDetail',
        query: {
          id: id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  background-color: #f5f5f5 !important;
}
</style>
