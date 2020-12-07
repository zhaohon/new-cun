<template>
  <!--帮助反馈-->
  <tk-container class="feedback_wrapper" :status="status">
    <tkui-header slot="header" class="header_border" left>
      <div class="m-r-8" slot="left" @click="$back">
        <tk-icon size="18">fanhui</tk-icon>
      </div>问题反馈
    </tkui-header>

    <tkui-form ref="form" class>
      <div class="font-12 color-gray m-x-15 p-y-8">您的真实信息</div>
      <div class="bg-white p-x-15 p-t-10 min-height">
        <div class="font-14">
          姓名
          <span class="color-red">*</span>
        </div>
        <tkui-input
          class="color-light-gray"
          rulers="required"
          v-model="name"
          placeHolder="请填写您的姓名"
          border
        ></tkui-input>
        <div class="font-14">
          联系电话
          <span class="color-red">*</span>
        </div>
        <tkui-input
          class="color-light-gray"
          rulers="mobile"
          v-model="phone"
          placeHolder="请填写您的联系电话"
          border
        ></tkui-input>
      </div>

      <div class="font-12 color-gray m-x-15 p-y-8">问题反馈</div>
      <div class="bg-white p-x-15 max-height p-b-10">
        <tkui-input
          class="m-b-10 color-light-gray"
          v-model="feedback"
          type="textarea"
          style="height:200px!important;"
          rulers="required"
          placeHolder="请简要描述您的问题"
          noborder
        ></tkui-input>
        <ImagePost @postImage='postImage($event)' ></ImagePost>
      </div>
    </tkui-form>
    <tkui-button primary raised block class="sub_btn m-t-20" @click.native="submitFeedBack">提交反馈</tkui-button>
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
      name: '',
      phone: '',
      feedback: '',
      status: true,
      imgArr: [],
      multipleDownloadUrl: []
    }
  },
  activated () {
    this.status = false
  },
  methods: {
    // 提交反馈
    async submitFeedBack () {
      let vali = this.$refs.form.validate()
      if (vali.length > 0) {
        return
      }
      try {
        let submitData = {
          imgArr: this.imgArr,
          name: this.name,
          phone: this.phone,
          description: this.feedback
        }
        console.log('提交的数据', submitData, this.$store.state.user)
        if (this.$store.state.user) {
          submitData.user = {
            __type: 'Pointer',
            className: '_User',
            objectId: this.$store.state.user.objectId
          }
        }
        await this.$axios.post('/classes/triageList', submitData)
        this.status = 'waiting'
        this.$tkGlobal.toast.add('感谢您的反馈!')
        this.$push('/succeed')
      } catch (e) {
        this.status = false
        this.$tkGlobal.toast.add('反馈失败，请重试!')
      }
    },
    // 组件传递过来的图片数组数据
    postImage (arr) {
      this.imgArr = arr
      console.log('父页面', arr)
    }
  }
}
</script>

<style lang="scss">
.feedback_wrapper {
  background-color: #f5f5f5 !important;
}

// .min-height{
//   .input-wrap{
//       width: 100%;
//       height: 44px;
//       border: 1px solid #f5f5f5;
//       background-color: #ffffff;
//       border-radius: 2px;
//       padding: 0 8px;
//   }
//   .tkui-input-container .tkui-input-body-warp .tkui-input-body{
//     margin: 0;
//   }
// }

.max-height {
  .tkui-input-container .tkui-input-body-warp {
    height: 180px;
  }
}

// // 提交按钮
// .sub_btn{
//   margin-top: 100px;
//   // width: 343px;
//   // position: fixed;
//   // bottom: 30px;
//   // left: 5px;
//   // z-index: 999;
// }
</style>
