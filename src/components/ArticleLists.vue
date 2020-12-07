<template>
    <div>
      <tk-flex v-for="(item,index) in list" :key="index" middle between  class="p-x-0" border @click.native="toArticle(item.objectId)">
        <img v-if="type == 'guide' && item.img" :src="item.img" class="avatar fsh m-r-5" />
        <div class="content fg1">
          <div class="title font-14 ell_2" style="height:38px">{{item.articleTitle}}</div>
          <tk-flex middle class="m-t-8">
            <div v-if="type == 'guide'" class="font-10 read m-r-8">{{item.readingNum}}阅读</div>
            <div class="font-10 color-light-gray">{{item.createdAt | dateND}} {{item.createdAt | datetime}}</div>
          </tk-flex>
        </div>
        <img v-if="type == 'serve' && item.img" class="fsh avatar m-l-5" :src="item.img" />
        <img v-if="type == 'classify' && item.img" class="fsh avatar m-l-5" :src="item.img" />
      </tk-flex>
    </div>
</template>

<script>
export default {
  // 传入子组件的参数写到props
  props: {
    list: {
      type: Array // 参数类型
    },
    type: {
      type: String
    }

  },
  data: function () {
    return {
    }
  },
  methods: {
    toArticle (id) {
      console.log('组件')
      this.$emit('toArticle', id)
    }
  }
}
</script>

<style scoped>

</style>
