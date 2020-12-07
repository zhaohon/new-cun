<template>
  <tk-container :status="status" class="bg-white" >
     <tkui-header slot="header" class="header_border" left>
      <div class="m-r-8" slot="left" @click="$back"><tk-icon size="18">fanhui</tk-icon></div>
      文章详情
    </tkui-header>
    <div v-if="data" class="p-12">
      <div class="font-20 ">{{data.articleTitle}}</div>
      <div class="m-t-12 color-light-gray font-14 m-b-32">
        <span class="m-r-17" v-if="data.type && data.type == 'villageFveeling'">{{data.readingNum + 1}}阅读&nbsp;&nbsp;&nbsp;&nbsp;</span>{{data.createdAt | date}}</div>
      <div v-html="data.content" @click="imgonclick($event)"></div>
      <!-- //富文本图片点击 -->
      <div  class="opacityBottom" v-show="imgIsShow" @click="imgIsShow=false"><img width= "100%" class="bigImg" :src="imgsrc"></div>
    </div>

  </tk-container>
</template>

<script>
export default {
  name: 'article',
  components: {
  },
  data () {
    return {
      status: 'loading',
      data: null,
      imgsrc: '',
      imgIsShow: false
    }
  },
  beforeMount () {
  },
  mounted () {
    this.init()
  },
  methods: {
    // 初始化
    async init () {
      try {
        await this.getArticle()

        this.status = false
      } catch (e) {
        this.status = 'error'
      }
    },
    // 获取文章
    async getArticle () {
      try {
        let articleList = await this.$axios.get('/classes/articleList', {
          params: { // url参数
            where: { // 查询条件
              objectId: this.$route.query.id // 字段名：查询条件id
            }
          }
        })
        if (articleList.results.length) {
          articleList.results[0].content = this.richText(articleList.results[0].content)
          this.data = articleList.results[0]

          // 增加阅读量
          if (this.data.type && this.data.type === 'villageFveeling') { this.addRead(this.data.objectId) }
        } else { this.data = null }
        console.log('数据:', this.data)
      } catch (e) {
        console.log(e)
      }
    },
    // 增加阅读量
    async addRead (objectId) {
      let data = {}
      data['readingNum'] = this.data.readingNum + 1
      console.log(data)
      await this.$axios.put(`/classes/articleList/${objectId}`, data)
    },

    // 富文本过滤图片样式
    richText (content) {
      content = content.replace(/style="[^"]*?"/g, '')
      content = content.replace(/height="[^"]*?"/g, '')
      content = content.replace(/width="[^"]*?"/g, '')
      content = content.replace(/img/g, 'img width="100%" ')
      return content
    },
    // 富文本图片点击事件
    imgonclick (e) {
      console.log('图片：', e)
      var obj = e.target
      /* 富文本中好像只有img有src属性，javaScript中：undefined,null转成Boolean都是false */
      if (obj.src) {
        console.log(obj.src)
        var imgsrc = obj.src
        console.log(imgsrc)
        this.imgIsShow = true
        this.imgsrc = imgsrc
      }
    }
  }
}
</script>
<style lang="scss">
.bigImg {
    position: absolute;
    top: 50%;
    left: 50%;
    /*图片向左移动自身宽度的50%, 向上移动自身高度的50%。*/
    transform: translate(-50%,0%);
}
/*遮罩层*/
.opacityBottom {
    width: 100%;
    height: 100%;
    position: fixed;
    background: rgba(0,0,0,0.7);
    z-index: 1000;
    top: 0;
    left: 0;
}

</style>
