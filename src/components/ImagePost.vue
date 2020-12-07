<template>
  <tk-flex class="posts-basic-bg-box full-width">
    <tk-flex wrap gutter="5" class="fill">
      <tk-flex middle class="posts-basic-bg-box-image tk-grid-3" :style="{ width: clientSide + 'px', height: clientSide + 'px' }" v-for="(img, index) in pictureCombination" :key="index" >
        <div class="posts-basic-bg-box-middle" @click="viewImage(index)" :style="{ width: clientSide + 'px', height: clientSide + 'px' }">
          <tk-image v-if="img" :src="img" :style="{ width: clientSide + 'px', height: clientSide + 'px' }" quality="100" width="83" height="83"></tk-image>
          <div v-if="!imageArr" class="posts-basic-bg-box-image-icon" :style="{ width: clientSide + 'px', height: clientSide + 'px'  }" ></div>
          <div v-if="!imageArr" class="delete-icon" @click.stop="deleteImage(index)">
            <tk-icon size="12" color="#fff" class="m-b-2">guanbi</tk-icon>
          </div>
        </div>
      </tk-flex>
      <tk-flex middle v-if="pictureCombination && pictureCombination.length < imageMaxLength && !imageArr" @click.native="actionShow = true" class="tk-grid-3 posts-basic-bg-box-image" :style="{ width: clientSide + 'px', height: clientSide + 'px' }" >
        <div class="posts-basic-bg-box-middle" :style="{ width: clientSide + 'px', height: clientSide + 'px' }" :class="{ 'posts-size-line': environmentWaiting }" >
          <div class="item text-center" :style="{ lineHeight: clientSide + 12 + 'px' }" v-if="environmentWaiting">
            <tk-spinner type="oval" color="rgba(153, 153, 153, 1)" size="25"></tk-spinner>
          </div>
          <tk-image v-else :src="cameraImg" :style="{ width: clientSide + 'px', height: clientSide + 'px' }" quality="100" width="83" height="83"></tk-image>
        </div>
      </tk-flex>
    </tk-flex>
    <van-action-sheet
      v-model="actionShow"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      close-on-popstate
      @select="onSelect"
    />
    <!--查看大图cover-->
    <tk-cover
      :show.sync="isWatch"
      :hideOnClick="false"
      transition
      right
      color="rgba(255, 255, 255, 0)"
      :through="false"
    >
      <!--由于下载原因 去掉开始索引:start-position="watchNum"-->
      <van-image-preview
        v-model="isWatch"
        :images="pictureCombination"
        closeable
        ref="threeImagePost"
        closeIcon="cross"
        closeOnPopstate
        @touchstart.native="gtouchstart($event)"
        @touchmove.native="gtouchmove()"
        @touchend.native="gtouchend()"
        @change="changeView"
        className="extend-class"
      >
      </van-image-preview>
      <!-- <tk-flex
        middle
        center
        v-if="touchDownStatus && isWatch"
        class="view-down-load animate__animated
        animate__fadeInUp font-15"
        @click.native="downLoad"
      >
        <tk-icon :size="12" color="white" style="height: 15px;padding-top: 2px;" class="m-r-2">xiazai</tk-icon>
        保存到手机
      </tk-flex> -->
      <!--下载弹框-->
      <!-- <tkui-dialog closeIcon hideAction :show.sync="isDownLoadStatus" center>
        <div class="subhead">
          <tk-flex column class="p-r-24">
            <div class="font-14">{{!downError ? '下载：' + fileName : downError}}</div>
            <div class="m-t-15 font-12"> {{'下载进度：' + percent + '%'}}</div>
          </tk-flex>
          <load-progress
            class="m-t-15"
            v-if="percent"
            :percent="percent"
            :progress-show="true"
            type="rect"
            :rect-width="230"
            :rect-height="5"
            :pathColors="['#f5f5f5', '#7f7eff']"
            :text-color="'rgba(255, 255, 255, 0)'"
          ></load-progress>
        </div>
      </tkui-dialog> -->
    </tk-cover>
  </tk-flex>
</template>

<script>
// import cameraImg from '@/assets/img/camera.png'
import { ImagePreview, ActionSheet } from 'vant'
// import loadProgress from '@/components/loadProgress'
// import { readyToDownloadFromNet } from '@/assets/help/download'
export default {
  data () {
    return {
      clientSide: 0, // 图片展示尺寸
      imageMaxLength: 9, // 最大上传length
      touchDownStatus: false, // 长按下载状态
      timeOutEvent: 0, // 长按延时器定义
      actionShow: false, // 是否弹出控制面板
      actions: [
        {
          name: '拍摄',
          from: 'camera'
        }, {
          name: '从相册选择',
          from: 'file'
        }
      ],
      environmentWaiting: false, // 上传图片等待状态
      pictureCombination: this.imageArr || [],
      cameraImg: 'http://moke-store.oss-cn-beijing.aliyuncs.com/a5a41ae4-5592-4347-a8dc-17e93c654b60.png',
      viewIndex: 0,
      fileName: null, // 当前下载的文件
      isDownLoadStatus: false, // 下载状态
      percent: 0, // 下载进度
      downError: null, // 下载提示
      watchNum: 0, // 查看大图的起始位置
      isWatch: false // 是否查看大图
    }
  },
  components: {
    [ActionSheet.name]: ActionSheet,
    [ImagePreview.Component.name]: ImagePreview.Component
    // loadProgress
  },
  props: {
    imageArr: { // 图片
      type: Array
    },
    signWidth: {
      type: Number,
      default: 40
    }
  },
  watch: {
    isWatch (val) {
      if (!val) {
        this.$tkStatusBar.show() // 状态栏沉浸式
        this.setStatusBar('dark')
        this.touchDownStatus = false
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    next(true)
  },
  mounted () {
    // 获取显示器的宽
    let clientWidth = document.documentElement.clientWidth - this.signWidth
    this.clientSide = Number((clientWidth / 4).toFixed(2) - 5)
  },
  methods: {
    /**
    * 选定操作项
    * @date: 2020/7/6
    */
    async onSelect (s) {
      let isMultiple = false
      isMultiple = s.from === 'file'
      let num = 0
      if (!this.pictureCombination.length) { num = this.imageMaxLength } else {
        num = this.imageMaxLength - this.pictureCombination.length
      }
      await this.uploadPics(s.from, isMultiple, num)
    },
    /**
     * 查看大图
     * @date: 2020/5/21
     */
    async viewImage (num) {
      console.log('我要看大图')
      this.$tkStatusBar.hide() // 结束沉浸
      this.isWatch = true
      this.viewIndex = num
      await this.$tkHelper.sleep(0)
      if (this.$refs.threeImagePost) {
        this.$refs.threeImagePost.swipeTo(num)
      }
    },
    /**
     * 上传图片
     * @date: 2020/5/3
     */
    async uploadPics (type, multiple, num) {
      if (this.imageArr) { return }
      if (this.environmentWaiting) { return this.$tkGlobal.toast.add('您点的太快了') }
      if (this.pictureCombination.length === this.imageMaxLength) { return this.$tkGlobal.toast.add('您不能上传更多图片了') }
      this.environmentWaiting = true
      // 校验格式
      let file = await this.$tkFile.pick({
        from: type,
        multiple: multiple,
        maximum: num
      }).catch(() => {
        this.environmentWaiting = false
      })
      // 提交图片，更新view
      try {
        if (type === 'file') {
          let res = await this.$tkFile.postFiles(file, 'https://api.mokekeji.com/file')
          await this.$tkHelper.sleep(1000)
          this.pictureCombination = [...this.pictureCombination, ...res]
        } else {
          let res = await this.$tkParse.post('/files', file.buffer)
          await this.$tkHelper.sleep(1000)
          this.pictureCombination.push(res.data.url)
        }
        this.$emit('postImage', this.pictureCombination)
        this.environmentWaiting = false
      } catch (e) {
        this.environmentWaiting = false
        this.$emit('postImage', [])
        this.$tkGlobal.toast.add('请重新上传')
      }
    },
    /**
     * 删除帖子图片
     * @date: 2020/5/3
     */
    deleteImage (index) {
      if (this.imageArr) { return }
      this.pictureCombination.splice(index, 1)
      this.$emit('postImage', this.pictureCombination)
    },
    /**
     * 保留名字
     * @date: 2020/4/7
     */
    getImageName (s) {
      // http://moke-dianpei.oss-cn-beijing.aliyuncs.com/ http://moke-store.oss-cn-beijing.aliyuncs.com/
      if (s.indexOf('http://moke-dianpei.oss-cn-beijing.aliyuncs.com/') !== -1) {
        return s.replace('http://moke-dianpei.oss-cn-beijing.aliyuncs.com/', '')
      }
      return s.replace('http://moke-store.oss-cn-beijing.aliyuncs.com/', '')
    },
    /**
     * 长按操作
     * @date: 2020/8/21
     */
    gtouchstart (e) {
      this.timeOutEvent = setTimeout(() => {
        this.touchDownStatus = true
      }, 500)
      return false
    },
    /**
     * 手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
     * @date: 2020/8/21
     */
    gtouchend () {
      clearTimeout(this.timeOutEvent)// 清除定时器
      if (this.timeOutEvent !== 0) {
        // 这里写要执行的内容（尤如onclick事件）
        // alert('你这是点击，不是长按')
        // recipient 接收人 replytoe 回复人
      }
      return false
    },
    /**
     * 如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
     * @date: 2020/8/21
     */
    gtouchmove () {
      clearTimeout(this.timeOutEvent) // 清除定时器
      this.timeOutEvent = 0
    },
    changeView (num) {
      this.touchDownStatus = false
    }
    /**
     * 下载图片保存手机
     * @date: 2020/9/4
     */
    // async downLoad () {
    //   let url = this.pictureCombination[this.viewIndex]
    //   this.fileName = this.getImageName(url)
    //   this.isDownLoadStatus = true
    //   let percent = new Promise(resolve => {
    //     readyToDownloadFromNet(url, 'image', this.fileName, {
    //       downloading: async (progress, text) => {
    //         this.percent = progress
    //         if (this.percent === 100) {
    //           await this.$tkHelper.sleep(300)
    //           this.isDownLoadStatus = false
    //           resolve(progress)
    //         }
    //       },
    //       errorDownload: (error) => {
    //         this.percent = null
    //         this.downError = error
    //         this.isDownLoadStatus = false
    //         resolve(-1)
    //       }
    //     })
    //   })
    //   let judgePercent = await percent
    //   // 修改数据库
    //   if (judgePercent === -1) {
    //     this.isDownLoadStatus = false
    //     return this.$tkGlobal.toast.add('下载失败')
    //   }
    //   if (judgePercent === 100) {
    //     this.$tkGlobal.toast.add('下载成功')
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
  .posts-basic-bg-box{
    // padding: 0 15px;
    .posts-size-line {
      border: 1px solid #f5f5f5;
      border-radius: 5px;
    }
    .posts-basic-bg-box-middle {
      position: relative;
    }
    .posts-basic-bg-box-image {
      .posts-basic-bg-box-image-icon {
        width: 100%;
        background: rgba(255, 255, 255, 0);
        position: absolute;
        left: 0;
        top: 0;
      }
      .delete-icon {
        position: absolute;
        right: 0;
        top: 0;
        width: 20px;
        height: 20px;
        text-align: center;
        background: rgba(0, 0, 0, 0.2);
      }
    }
  }
</style>
