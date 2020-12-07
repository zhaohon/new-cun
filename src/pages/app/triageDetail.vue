<template>
  <!--民情分诊-->
  <tk-container class :status="status">
    <tkui-header slot="header" class="header_border" left>
      <div class="m-r-8" slot="left" @click="$back">
        <tk-icon size="18">fanhui</tk-icon>
      </div>民情分诊
    </tkui-header>

    <!-- 民情分诊列表 -->
    <div class="p-x-15 box-bb bg-white">
      <div class="p-y-16 m-b-10">
        <div class="font-14 m-b-10">{{triageDetail.description}}</div>
        <ImagePost v-if="triageDetail.imgArr" type='triageDetail' :imageArr='triageDetail.imgArr' ></ImagePost>
        <!-- <Images type="triage" width="100%" :imgs="triageDetail.imgArr"></Images> -->
        <div class="font-12 color-light-gray m-t-8">
          <span>{{triageDetail.createdAt | date}}</span>
          <span class="m-l-8">{{triageDetail.createdAt | datetime}}</span>
        </div>
      </div>

      <!-- 平台回复 -->
      <div class="reply box-bb p-10">
        <div v-for="(item,index) in triageDetail.replyArr" :key="index" class="color-light-gray font-13 m-b-12">
          <span class="color-black">{{item.role == '平台'?'平台回复：':'我回复：'}}</span>
          {{item.reply}}
        </div>
        <tk-flex middle right>
          <tk-icon color="#999999" size="20" @click="showInputBox">xiaoxi</tk-icon>
          <span class="font-12 color-light-gray" @click="showInputBox">回复</span>
        </tk-flex>
      </div>
    </div>
    <!-- 输入框 -->
    <tkui-form v-if="inputBox" ref="form" class="reply_input_posi">
      <tk-flex middle between class="reply_input_box p-x-15">
        <tkui-input
          class="fg1"
          rulers="required"
          v-model="replyCon"
          placeholder="回复"
          noboder
          :validateOnBlur="false"
        ></tkui-input>
        <tkui-button
          class="reply_btn font-13"
          :class="replyInput?'replyInputActive':''"
          @click.native="submitReply"
        >发送</tkui-button>
      </tk-flex>
    </tkui-form>
  </tk-container>
</template>

<script>
import ImagePost from '@/components/ImagePost.vue'

export default {
  components: {
    ImagePost
  },
  data () {
    return {
      status: true,
      replyArrShow: false,
      replyCon: '',
      inputBox: false,
      triageDetail: []
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    replyInput () {
      let back = false
      if (this.replyCon !== '') {
        back = true
      } else {
        back = false
      }
      return back
    }
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
        let triageDetail = await this.$axios.get('/classes/triageList', {
          params: { // url参数
            where: { // 查询条件
              objectId: this.$route.query.id // 字段名：查询条件id
            }
          }
        })
        if (triageDetail.results.length) {
          this.triageDetail = triageDetail.results[0]
          if (this.$store.state.user.objectId === triageDetail.results[0].user) {
            this.replyArrShow = true
          } else {
            this.replyArrShow = false
          }
        } else { this.triageDetail = null }
        console.log('数据:', this.triageDetail)
      } catch (e) {
        console.log(e)
      }
    },
    // 显示输入框
    showInputBox () {
      this.inputBox = true
    },
    // 提交反馈
    async submitReply () {
      let vali = this.$refs.form.validate()
      if (vali.length > 0) {
        return
      }
      try {
        let submitData = {}
        submitData['replyArr'] = this.triageDetail.replyArr
        submitData['replyArr'].push(
          {
            'reply': this.replyCon,
            'role': "我",
            'user': this.$store.state.user.objectId
          }
        )
        submitData['status'] = 'no'
        console.log(submitData)
        await this.$axios.put(`/classes/triageList/${this.triageDetail.objectId}`, submitData)
        this.inputBox = false
        this.$tkGlobal.toast.add('回复成功!')
      } catch (e) {
        this.status = false
        this.$tkGlobal.toast.add('回复失败，请重试!')
      }
    },
    changeClassify () {
      console.log('跳转')
      this.$push({
        path: '/classify',
        query: {
          status: this.navName
        }
      })
    }
  }
}
</script>

<style lang="scss">
.reply {
  width: 100%;
  background-color: #f5f5f5;
  border-radius: 5px;
}

//输入框定位
.reply_input_posi {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
}
// 去除默认样式
.tkui-input-container {
  padding-bottom: 0;
}
.reply_input_box {
  width: 100%;
  // height: 48px;
  padding: 6px 15px;
  background-color: #f1f1f1;
}
.tkui-input-body-warp {
  margin: 0 !important;
  padding: 0 8px !important;
  border: 1px solid #f9f9f9;
  background-color: #f9f9f9;
  border-radius: 5px;
}
.tkui-input-body {
  margin: 0 !important;
  padding: 0 !important;
}
.tkui-input-border {
  height: 30px;
}
.reply_btn {
  width: 52px;
  min-width: 50px;
  height: 28px;
  line-height: 26px;
  border: 0.5px solid #b5b5b5;
  background-color: #f5f5f5;
  border-radius: 5px;
  margin: 0 0 0 14px;
  padding: 0;
  color: #b5b5b5;
}
.replyInputActive {
  border: 0.5px solid #2ebb53;
  background-color: #2ebb53;
  color: #ffffff;
}
</style>
