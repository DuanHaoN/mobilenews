import request from '@/utils/request.js'

export const getArticles = ({ channel_id, timestamp, with_top }) => {
  return request({
    method: 'get',
    url: '/app/v1_1/articles',
    params: {
      channel_id,
      timestamp,
      with_top
    }
  })
}

// 不喜欢文章
export const dislikeArticle = (articleId) => {
  return request({
    method: 'POST',
    url: `/app/v1_0/article/dislikes`,
    data: {
      target: articleId
    }
  })
}

// 举报文章
export const reportArticle = ({
  articleId,
  type,
  remark = ''
}) => {
  return request({
    method: 'POST',
    url: `/app/v1_0/article/reports`,
    data: {
      target: articleId,
      type,
      remark
    }
  })
}
