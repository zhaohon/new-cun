<template>
  <tk-container>
     <tkui-header slot="header" class="header_border" left>
      <div class="m-r-8" slot="left" @click="$back"><tk-icon size="18">fanhui</tk-icon></div>
      提交反馈
    </tkui-header>
    <tk-flex middle column center warp class="succeed" >
      <tk-icon color="#0fd83f" size='45' >tijiao</tk-icon>
      <div class="color-black font-20 m-t-12">提交成功</div>
      <div class="color-light-gray font-14 m-t-10">感谢您的反馈，我们会尽快回复您！</div>

    </tk-flex>

  </tk-container>
</template>

<script>
export default {
  name: 'succeed'
}
</script>
<style lang="scss" scoped>
  .succeed{
    padding-top: 52px;
    letter-spacing: 1px;
  }
</style>
