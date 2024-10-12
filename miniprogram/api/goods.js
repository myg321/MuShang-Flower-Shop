import http from '../utils/http'

/**
 * @description Get goods list
 * @param {Object} param { page, limit, category1Id, category2Id } 
 * @returns Promise
 */
export const reqGoodsList = ({ page, limit, ...rest }) => {
    return http.get(`/goods/list/${page}/${limit}`, rest)
}

/**
 * @description Get goods detail info
 * @param {*} goodsId  goods id
 * @returns Promise
 */
export const reqGoodsInfo = (goodsId) => {
    return http.get(`/goods/${goodsId}`)
}