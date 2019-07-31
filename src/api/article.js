import request from '@/utils/request.js'

export const getArticles = ({ channel_id, timestamp, with_top }) => {
  return request({
    method: 'get',
    url: ' /app/v1_1/articles',
    params: {
      channel_id,
      timestamp,
      with_top
    }
  })
}
