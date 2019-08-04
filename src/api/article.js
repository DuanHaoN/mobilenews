// 文章相关的api

import request from '@/utils/request.js'

/**
 * 当前激活的频道对应的文章列表
 * channel_id	是		频道ID
 * timestamp	是	时间戳Date.now() 整数 单位毫秒	时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
 * with_top	是	0或1	是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
 */
export const getArticles = ({ channel_id, timestamp, with_top = 1 }) => {
    return request({
        method: 'get',
        url: `/app/v1_1/articles`,
        params: {
            channel_id,
            timestamp,
            with_top
        }
    })
}

/**
 * 不喜欢文章
 * target	integer	必须		不喜欢的文章id
 */
export const dislikeArticle = article_Id => {
    return request({
        method: 'post',
        url: `/app/v1_0/article/dislikes`,
        data: {
            target: article_Id
        }
    })
}

/**
 * 举报文章
 * target	integer	必须		举报的文章id
 * type	integer	必须		举报类型：
 * 0-其他问题，
 * 1-标题夸张，
 * 2-低俗色情，
 * 3-错别字多，
 * 4-旧闻重复，
 * 5-广告软文，
 * 6-内容不实，
 * 7-涉嫌违法犯罪，
 * 8-侵权'
 * remark	string	非必须		其他问题 的附加说明
 */
export const reportArticleByIdAndType = ({
    article_Id,
    type = 0,
    remark = ''
}) => {
    return request({
        method: 'post',
        url: `/app/v1_0/article/reports`,
        data: {
            target: article_Id,
            type,
            remark: ''
        }
    })
}