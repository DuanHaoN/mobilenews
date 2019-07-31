import Vue from 'vue'
import App from './App.vue'
import 'amfe-flexible/index.min.js'
import router from './router'
import Vant from 'vant'
import 'vant/lib/index.css'
import VeeValidate, { Validator } from 'vee-validate'
import CN from 'vee-validate/dist/locale/zh_CN'
import store from './store'

// 解决异步
Vue.prototype.$sleep = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

Vue.use(VeeValidate)

Validator.localize('zh_CN', CN)

Validator.extend('phone', {
  // 自定义规则的提示消息
  getMessage: field => '请输入正确的手机号码',
  // 自定义规则的具体代码
  validate: value =>
    value.length === 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
})

Vue.use(Vant)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
