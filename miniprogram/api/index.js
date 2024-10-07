// import encapsulated netwokr request tool - http.js
import http from '../utils/http'

/**
 * @description Get data of index page through concurrent requests
 */
export const reqIndexData = () => {
    return http.all(
        http.get('/index/findBanner'),
        http.get('/index/findCategory1'),
        http.get('/index/advertisement'),
        http.get('/index/findListGoods'),
        http.get('/index/findRecommendGoods')
    )
}