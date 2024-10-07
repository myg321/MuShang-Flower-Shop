import WxRequest from 'mina-request'
import {
    getStorage,
    clearStorage
} from './storage'
import {
    model
} from './extendApi'
import {
    env
} from './env'

// -------- 实例化 WxRequest ---------
// 之后会放到其他文件
const instance = new WxRequest({
    baseURL: env.baseURL,
    timeout: 15000,
    isLoading: true
})

instance.interceptors.request = (config) => {
    // console.log('执行请求拦截器')
    // get token from local 
    const maybe_token = getStorage('token')
    if (maybe_token) {
        config.header['token'] = maybe_token
    }

    return config
}

instance.interceptors.response = async (response) => {
    // console.log(response)
    const {
        data,
        isSuccess
    } = response

    // if 'fail'
    if (!isSuccess) {
        wx.showToast({
            title: '网络异常，请稍候重试',
        })
        return response
    }

    // if 'success'
    switch (data.code) {
        case 200:
            return data
        case 208:
            const modelStatus = await model({
                title: '用户未登录',
                content: '登录授权过期，请重新登录'
            })

            // if user hit the confirm button 
            if (modelStatus) {
                clearStorage()
                wx.navigateTo({
                    url: '/pages/login/login',
                })
            }
            return
        default:
            wx.showToast({
                title: '接口调用失败',
                icon: 'error'
            })
            // 将错误继续向下传递
            return Promise.reject(response)
    }
}

// 将 WxRequest 的实例通过模块化的方式暴露出去
export default instance