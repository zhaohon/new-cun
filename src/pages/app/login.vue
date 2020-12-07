<template>
  <!--登录页-->
  <tk-container class="login_wrapper white_background">
    <tkui-header left slot="header">登陆</tkui-header>
    <div class="login_box">
      <div class="font-24 color-black word_space">手机号码快捷登录</div>
      <div class="font-12 color-light-gray m-t-5 word_space">未注册过的手机号码将自动注册</div>
      <!--手机验证码登陆-->
      <tkui-form ref="commonLogin">
        <div class="font-16 color-black input_title" style="margin-top: 48px;">手机号码</div>
        <tkui-input v-model="phone" class="font-14" placeHolder="请输入手机号" :rulers="customRuler">
        </tkui-input>
        <div class="font-16 color-black input_title">验证码</div>
         <tkui-input rulers="required" type="number" style="font-size: 14px !important;"  class="input-placeholder" mask="natural" v-model="telCode" placeHolder="请输入验证码" >
            <div class="btn-code" slot="right" :class="{'disabled-code': codeFailure}" @click="handleGetCode" >{{code}}</div>
          </tkui-input>
      </tkui-form>
      <tkui-button class=" block rounded block primary" @click="doLogin">登录</tkui-button>
    </div>
  </tk-container>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      codeFailure: false, // 验证码disabled样式
      codeStatus: 1, // 验证码状态
      code: '获取验证码', // 验证码描述
      phone: '',
      telCode: '',
      customRuler: [
        'required',
        function (value) {
          if (!(/^1[23456789]\d{9}$/.test(value))) {
            return '请输入正确的手机号'
          }
        }
      ]
    }
  },
  watch: {

  },
  methods: {
    // 登陆
    async doLogin () {
      let res = this.$refs.commonLogin.validate()
      if (res.length) { return this.$tkGlobal.toast.add('手机号或验证码不正确，请重新输入') }
      try {
        this.status = 'waiting'
        let rs = await this.$axios.post('/loginByPhone', {
          'phone': this.phone,
          'code': this.telCode,
          'role': 'ordinaryUser'
        })
        this.setData(rs)
        this.status = false
      } catch (e) {
        this.status = false
        this.$tkGlobal.toast.add(e || '登录失败')
      }
    },
    setData (val) {
      console.log('登录数据', val)
      this.$store.commit('setUser', val)
      this.$store.commit('setSessionToken', val.sessionToken)
      this.$tkParse.setSessionToken(val.sessionToken)
      this.$replace('/')
    },
    /**
     * 验证手机号
     * @date: 2020/12/4
     */
    testTelNumber (phone) {
      if (!phone || phone === '') {
        this.$tkGlobal.toast.add('请输入手机号')
        return false
      }
      if (!(/^1[23456789]\d{9}$/.test(phone))) {
        this.$tkGlobal.toast.add('手机号码有误，请重新输入')
        return false
      }
      return true
    },
    /**
    * 获取验证码点击事件
    * @date: 2020/3/9
    */
    async handleGetCode () {
      // 验证手机号通过后执行下面获取验证码操作
      if (!this.testTelNumber(this.phone)) { return }
      // 判断数据库有无此账号信息
      // if (!await this.judgePhone(this.phone)) { return }
      // 发送验证码间隔 disabled
      if (this.codeFailure) { return }
      // 发送获取验证码
      if (this.codeStatus === 1) {
        this.codeFailure = true
        this.getCode(60)
        await this.setCodeRequest()
      }
    },
    /**
    * 判断数据库有无此账号信息
    * @date: 2020/3/9
    */
    async judgePhone (phone) {
      let res = await this.$tkParse.getList(`/classes/_User`, {
        params: {
          limit: 1,
          where: {
            'phone': phone
          }
        }
      })
      console.log(res.length)
      if (res.length) {
        return true
      } else {
        return this.$tkGlobal.toast.add('未找到您的注册信息')
      }
    },
    /**
    * 请求验证码接口
    * @date: 2020/12/4
    */
    async setCodeRequest () {
      let loginphone = this.phone
      await this.$axios.post('/sms/sendCode', {
        phone: loginphone,
        templateId: '78ryd2'
      }).catch(e => {
        this.$tkGlobal.toast.add('短信发送失败')
        console.log(e, 'eee')
        throw e
      })
      this.$tkGlobal.toast.add('短信发送成功')
    },
    /**
    * 获取验证码倒计时开启
    * @date: 2020/3/9
    */
    getCode (code = 60) {
      this.codeStatus = 0
      this.code = `${code--}S后重新发送`
      let timer = setInterval(() => {
        this.code = `${code--}S后重新发送`
        if (code < 0) {
          this.codeFailure = false
          clearInterval(timer)
          this.codeStatus = 1
          this.code = `重新发送`
        }
      }, 1000)
    }

  }
}
</script>
<style scoped lang="scss">
.btn-code{
      min-width: 84px;
      height: 30px;
      border-radius: 5px;
      text-align: center;
      line-height: 30px;
      color: #0e66d9;
      font-size: 12px;
      padding: 0 5px;
    }
    .btn-mt {
      margin-top: 65px;
    }
  .login_wrapper{
    .word_space{
      letter-spacing: 2px;
    }
    .input_title{
      margin-top: 33px;
    }
    .login_box{
      padding:0 40px;
      padding-top: 60px;
      margin-bottom: 35px
    }
    .tel_box{
      width:100%;
      text-align: center;
      font-size: 14px;
      color: #999;
      position: fixed;
      bottom:45px;
    }
    .code_box{
      font-size: 12px;
      color: #0e66d9;
    }
    .tkui-button{
      height: 44px;
      margin: 50px 0;
      padding: 0;
      background-color: #0e66d9;
      border-radius: 5px;
      color: #FFFFFF;
    }
  }
  .disabled-code {
    color: #999 !important;
  }
</style>
