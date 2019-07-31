import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 初始化的时候从本地存储获取数据，防止刷新丢失 token
    user: auth.getuser()
  },
  mutations: {
    /**
     * 登录成功，调用 mutation 更新容器中的 user 的状态
     */
    setuser (state, data) {
      // 修改state
      state.user = data

      // 将数据放到本地存储
      auth.setuser(state.user)
    }
  },
  actions: {

  }
})
