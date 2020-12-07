<template>
    <tk-flex middle between class="">
        <tk-image v-if="type == 'triage' && imgs.length == 1" class="triageImgOne" :src="imgs[0]" :style="{width: width == '100%'?'100%':'240px'}" width="240" height="180"></tk-image>
        <div v-for="(item,index) in imgs" :key='index' >
            <tk-image v-if="type == 'triage' && index < 3 && imgs.length != 1" class="triageImg" :src="item" width="110" height="110"></tk-image>
            <tk-image v-if="type != 'triage' && index < 3 && imgs.length != 1" class="img" :src="item" width="112" height="75"></tk-image>
        </div>

        <!-- 上传图片 -->
        <div v-if="type == 'help' && index <= 8" >
            <tk-image v-for="(item,index) in imgs" :key='index' class="img" :src="item" width="112" height="75"></tk-image>
        </div>
        <tk-icon @click.native="pickAndUploadMultiplefiles()" v-if="type == 'help' && imgs.length != 9" class="fsh" size="83">tianjia</tk-icon>

        <div v-for="(item,index) in multipleDownloadUrl" :key="index">
            <div>下载地址</div>
            <div>｛｛item｝｝</div>
        </div>

    </tk-flex>
</template>

<script>
export default {
  // 传入子组件的参数写到props
  props: {
    imgs: {
      type: Array // 参数类型
    },
    type: {
      type: String
    },
    width: {
      type: String
    }
  },
  data: function () {
    return {
      multipleDownloadUrl: []
    }
  },
  methods: {
    pickAndUploadMultiplefiles () {
      this.$emit('pickAndUploadMultiplefiles')
    }
  }
}
</script>

<style scoped>
  .img {
    border-radius: 3px;
  }
  .triageImg{
    border-radius: 3px;
  }
  .triageImgOne{
    border-radius: 3px;
  }

</style>
