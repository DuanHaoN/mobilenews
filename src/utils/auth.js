// 将token进行本地存储

const TOKEN_KEY = 'user'
// 设置token
export const setuser = (data) => {
  return window.localStorage.setItem(TOKEN_KEY, JSON.stringify(data))
}

// 取出token
export const getuser = () => {
  return JSON.parse(window.localStorage.getItem(TOKEN_KEY))
}

// 移除token
export const removeuser = () => {
  return window.localStorage.removeItem(TOKEN_KEY)
}
