<template>
  <div class="app">
    <!-- 导航 -->
    <van-nav-bar title="登录" />
    <form action="/" method="post">
      <van-cell-group>
        <van-field :error-message="errors.first('phone')" v-validate="'required|phone'" name="phone" v-model="user.mobile" required clearable label="手机号" placeholder="请输入手机号" />
        <van-field v-model="user.code" type="password" label="密码" placeholder="请输入密码" required />
      </van-cell-group>
      <van-button :loading='loginLoading' type="info" block @click.prevent="handlelogin">登录</van-button>
    </form>
    <!-- 表单 输入框*2  登录按钮-->
  </div>
</template>

<script>
// import axios from 'axios'
import { login } from '@/api/user.js'
export default {
  name: 'login',
  data () {
    return {
      user: {
        mobile: '18801185985',
        code: '246810'
      },
      loginLoading: false
    }
  },
  methods: {
    // 登录
    async handlelogin () {
      this.loginLoading = true
      try {
        this.$validator.validate().then(async valid => {
          if (!valid) {
            console.log('error--------')
            this.loginLoading = false
            return
          }
          const data = await login(this.user)
          console.log(data)
          this.$store.commit('setuser', data)
          this.loginLoading = false
          this.$router.push({ path: '/' })
        })
      } catch (error) {
        console.log(error)
        this.loginLoading = false
      }
    }
  }
}
</script>

<style lang='less' scoped>
.van-nav-bar {
  background-color: #1989fa;
}
.van-nav-bar__title {
  color: #fff;
}
</style>
