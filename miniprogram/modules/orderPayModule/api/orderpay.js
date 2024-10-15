import http from '@/utils/http'

/**
 * @description Get orders info
 * @returns Promise
 */
export const reqOrderInfo = () => {
    return http.get('/order/trade')
}

/**
 * @description Get orders address
 * @returns Promise
 */
export const reqOrderAddress = () => {
    return http.get('/userAddress/getOrderAddress')
}

/**
 * @description Get detail info of buy now goods
 * @param {Object} params {goodsId, blessing}
 * @returns Promise 
 */
export const reqBuyNowGoods = ({
    goodsId,
    ...rest
}) => {
    return http.get(`/order/buy/${goodsId}`, rest)
}

/**
 * @description Submit order
 * @param {*} data 
 * @returns Promise
 */
export const reqSubmitOrder = (data) => {
    return http.post('/order/submitOrder', data)
}

/**
 * @description Get weixin prepay info
 * @param {*} orderNo order nunmber
 * @returns Promise
 */
export const reqPreBuyInfo = (orderNo) => {
    return http.get(`/webChat/createJsapi/${orderNo}`)
}

/**
 * @description Weixin pay status check
 * @param {*} orderNo order nunmber
 * @returns Promise
 */
export const reqPayStatus = (orderNo) => {
    return http.get(`/webChat/queryPayStatus/${orderNo}`)
}

/**
 * @description Get order list
 * @param {*} params page limit
 * @returns Promise
 */
export const reqOrderList = (page, limit) => {
    return http.get(`/order/order/${page}/${limit}`)
}