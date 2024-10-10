// import encapsulated netwokr request tool - http.js
import http from '../utils/http'

/**
 * @description Authorize Wechat uest login
 * @param {*} code Temporary login credentials
 * @returns Promise
 */
export const reqLogin = (code) => {
    // 注意，这里 get 方法内部是反斜线的引号（数字键1左边的按键），不是英文单引号
    return http.get(`/weixin/wxLogin/${code}`)
}

/**
 * @description Get userInfo
 * @returns Promise
 */
export const reqUserInfo = () => {
    return http.get('/weixin/getuserInfo')
}

/**
 * @description Update user info
 * @param {*} updateInfo request parameters: username & user avatar, object format
 * @returns Promise
 */
export const reqUpdateUserInfo = (updateInfo) => {
    return http.post('/weixin/updateUser', updateInfo)
}