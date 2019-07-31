// 配置axios
import axios from 'axios'
import store from '@/store.js'
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  // 如果是非登录请求---------设置请求头
  const { user } = store.state
  if (config !== '/app/v1_0/authorizations') {
    // 设置请求头
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
  }
  // const { user } = store.state
  // config.user !== '/app/v1_0/authorizations' && user && (config.headers.Authorization = `Bearer $(user.token)`)
  // console.log(config)
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use(function (response) {
// 如果响应结果对象中有data，则直接返回这个data数据
// 如果响应结果对象中没有打他，则不做任何处理，直接原样返回这个数据
  return response.data.data || response.data
}, function (error) {
  return Promise.reject(error)
})

export default request
