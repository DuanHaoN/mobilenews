// 频道api
import request from '@/utils/request.js'

/**
 * 获取频道列表数据
 * 1. 如果headers设置了Authorization为token->获取用户关注的频道
 * 2. 反之,获取默认推荐的频道
 */

export const getChannelsUserOrDefault = () => {
    return request({
        method: 'get',
        url: `/app/v1_0/user/channels`
    })
}

/**
 * 获取所有频道列表数据
 */

export const getAllChannels = () => {
    return request({
        method: 'get',
        url: `/app/v1_0/channels`
    })
}

/**
 * 批量修改用户频道列表（重置式）
 * channels:[
 *  {
 *    id:1 频道id
 *    seq:1 -> 顺序序号
 * }
 * ]
 *
 * id-> 要求排除第一个
 * seq 要求从2开始
 */

export const resetUserChannels = channels => {
    return request({
        method: 'PUT',
        url: `/app/v1_0/user/channels`,
        data: {
            channels
        }
    })
}

/**
 * 删除用户频道
 * target		用户频道id
 * 应该返回被删除的数据
 */
export const deleUserChannel = channel_Id => {
    return request({
        method: 'delete',
        url: `/app/v1_0/user/channels/${channel_Id}`
    })
}