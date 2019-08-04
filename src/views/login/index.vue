<template>
  <div>

    <!--
  1. 国际化->本地化loca->把英语变成汉语
  2. 验证规则 验证手机号
 -->
    <!-- <input v-validate="'required|phone'" name="phone" type="text">
    <span>{{ errors.first('phone') }}</span> -->

    <!-- 导航 -->
    <van-nav-bar title="登录" />
    <!-- 表单
     输入框*2
     button
     -->
    <form action="/" method="POST">

      <van-cell-group>
        <van-field :error-message="errors.first('phone')" v-validate="'required|phone'" name="phone" v-model="user.mobile" required clearable label="手机号" placeholder="请输入手机号" />
        <van-field v-model="user.code" type="password" label="密码" placeholder="请输入密码" required />
      </van-cell-group>

      <van-button :loading="loginLoading" @click.prevent="handleLogin" type="info" block>登录</van-button>
    </form>

  </div>
</template>

<script>
// import axios from 'axios'
// import request from '@/utils/request.js'
import { login } from '@/api/user.js'
import { mapMutations } from 'vuex'

export default {
  name: 'LoginIndex',
  data() {
    return {
      user: {
        mobile: '18801185985',
        code: '246810'
      },
      loginLoading: false
    }
  },
  methods: {
    // 在methods中有setUser方法
    ...mapMutations(['setUser']),
    async handleLogin() {
      this.loginLoading = true
      try {
        // 验证规则是否通过
        this.$validator.validate().then(async valid => {
          // 如果没通过
          if (!valid) {
            console.log('error----')
            this.loginLoading = false

            return
          }
          // 验证通过
          const data = await login(this.user)
          // console.log(data)
          this.$store.commit('setUser', data)
          this.loginLoading = false

          // 进入tabbar组件
          this.$router.push({
            path: '/'
          })
        })
      } catch (error) {
        this.loginLoading = false

        console.log(error)
      }
    }
  }
}
</script>

<style lang='less' scoped>
.van-nav-bar {
  background-color: #1989fa;
  .van-nav-bar__title {
    color: #ffffff;
  }
}
</style>


// token
// 1. 保存token->localStorage
// 2. 多个组件都要共享使用->vuex
