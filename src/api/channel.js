import request from '@/utils/request.js'

export const getChannelsUserOrDefaults = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/user/channels'
  })
}
