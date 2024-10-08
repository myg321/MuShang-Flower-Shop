// import encapsulated netwokr request tool - http.js
import http from '../utils/http'

/**
 * @description get goods category data
 * @returns Promise type
 */
export const reqCategoryData = () => {
    return http.get('/index/findCategoryTree')
}