// 搜索api
import request from '@/utils/request.js'

/**
 * 获取联想建议
 * q	是		请求的前缀词句
 */
export const getSuggestions = q => {
    return request({
        method: 'get',
        url: `/app/v1_0/suggestion`,
        params: {
            q
        }
    })
}

/**
 * 获取搜索所有结果
 * page	否		页数，不传默认为1
 * per_page	否		每页数量，不传每页数量由后端决定
 * q	是		搜索关键词
 */
export const getSearchResult = ({ page, per_page, q }) => {
    return request({
        method: 'get',
        url: `/app/v1_0/search`,
        params: {
            page,
            per_page,
            q
        }
    })
}