import request from '@/utils/request.js'

export const getChannelsUserOrDefaults = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/user/channels'
  })
}

export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}

export const resetUserChannels = channels => {
  return request({
    method: 'PUT',
    url: `/app/v1_0/user/channels`,
    data: {
      channels
    }
  })
}
