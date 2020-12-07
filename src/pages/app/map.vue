<template>
  <tk-container>
    <tkui-header slot="header" class="header_border" left>
      <div class="m-r-8" slot="left" @click="$back">
        <tk-icon size="18">fanhui</tk-icon>
      </div>地图位置
    </tkui-header>
    <div>
      <div id="cm_map" style="width:100%; height:80vh;"></div>
      <div class="bg-white p-15">
        <tk-flex middle between class="font-20 color-black">
          <div>
            <tk-flex middle class="font-20 color-black">
              廉台村
              <span class="tag font-12 m-l-8">村庄</span>
            </tk-flex>
            <div
              class="font-14 color-black m-t-10 p-b-15"
              style="border-bottom:1px solid #f5f5f5"
            >河北省-石家庄市-辛集县-任萍乡</div>
          </div>
          <div class="change_btn font-12 color-white">确认更换</div>
        </tk-flex>

        <div class="font-15 color-black m-t-10">相关简介</div>
        <div class="font-14 color-black m-t-10 p-b-15">简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介</div>
      </div>
    </div>
  </tk-container>
</template>

<script>
export default {
  data () {
    return {
      ruleForm: [],
      position: [
        { l: 114.5505086, r: 38.0439897, act: false, img: 'http://moke-store.oss-cn-beijing.aliyuncs.com/1bfdd7c7-4a82-44e5-86e1-fd7b25472913.png' },
        { l: 114.5517286, r: 38.0449867, act: false, img: 'http://moke-store.oss-cn-beijing.aliyuncs.com/a8e38270-65fe-40ee-b5b8-fbdeabfb62b0.png' },
        { l: 114.5529086, r: 38.0450097, act: false, img: 'http://moke-store.oss-cn-beijing.aliyuncs.com/1bfdd7c7-4a82-44e5-86e1-fd7b25472913.png' },
        { l: 114.5530086, r: 38.0439897, act: false, img: 'http://moke-store.oss-cn-beijing.aliyuncs.com/a8e38270-65fe-40ee-b5b8-fbdeabfb62b0.png' }
      ]
    }
  },
  activated () {
    this.init()
  },
  methods: {
    init () {
      var cmMap = new window.AMap.Map('cm_map', {
        resizeEnable: true,
        zoom: 16,
        center: [114.5507086, 38.0429897]
      })
      // 村分布
      var preIcon, clickIcon, markers = [], lnglats = this.position
      preIcon = new AMap.Icon({
        image: "http://moke-store.oss-cn-beijing.aliyuncs.com/864b2a8d-4ed2-4eef-9070-469d69b3709b.png",
        size: new window.AMap.Size(42, 42),
        imageSize: new window.AMap.Size(42, 42),
        imageOffset: new window.AMap.Pixel(3, 3)
      })
      clickIcon = new window.AMap.Icon({
        image: "http://moke-store.oss-cn-beijing.aliyuncs.com/1bfdd7c7-4a82-44e5-86e1-fd7b25472913.png",
        size: new window.AMap.Size(42, 42),
        imageSize: new window.AMap.Size(40, 40),
        imageOffset: new window.AMap.Pixel(3, 3)
      })
      // 创建一个 阴影
      var startShadow = new window.AMap.Icon({
        size: new window.AMap.Size(46, 54),
        image: 'http://moke-store.oss-cn-beijing.aliyuncs.com/36bb72d8-f217-41e8-a090-1d2227567785.png',
        imageSize: new window.AMap.Size(46, 54),
        imageOffset: new window.AMap.Pixel(0, 0)
      })
      for (var i = 0; i < lnglats.length; i++) {
        var marker = new window.AMap.Marker({
          map: cmMap,
          shadow: startShadow,
          position: [lnglats[i].l, lnglats[i].r],
          icon: preIcon,
          offset: new window.AMap.Pixel(-0, -37)
        })
        cmMap.setFitView()
        markers.push(marker)
        marker.on('click', resetMap)
      }
      //鼠标点击事件,设置地图中心点及放大显示级别
      function resetMap (e) {
        console.log(e)
        cmMap.setZoomAndCenter(16, e.target.getPosition())
        for (var i = 0; i < markers.length; i++) {
          markers[i].setIcon(preIcon)
        }
        e.target.setIcon(clickIcon)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.succeed {
  padding-top: 52px;
  letter-spacing: 1px;
}

.tag {
  padding: 0 4px;
  background-color: #e6edfb;
  border-radius: 2px;
  color: #0e53d9;
}

.change_btn {
  width: 70px;
  height: 32px;
  line-height: 32px;
  background-color: #0e66d9;
  border-radius: 5px;
  text-align: center;
}
</style>
