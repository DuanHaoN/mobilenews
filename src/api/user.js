// 处理用户相关的api请求

import request from '@/utils/request.js'
/**
 *
 * @param {用户登录}
 * user->mobile code
 */

export const login = ({ mobile, code }) => {
    // const {mobile,code} = user
    return request({
        method: 'post',
        url: `/app/v1_0/authorizations`,
        data: {
            mobile,
            code
        }
    })
}

// 导出一个对象,该对象中有方法login