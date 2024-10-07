// 创建 WxRequest 类
class WxRequest {

    defaults = {
        baseURL: '',
        url: '',
        data: null, // request parameter
        method: 'GET',
        header: {
            'Content-type': 'application/json'
        },
        timeout: 60000,
        isLoading: true // show loading style
    }

    /**
     * Merge constructor parameters with class defaults
     * @param {*} params 
     */
    constructor(params = {}) {
        // console.log(params)
        this.defaults = Object.assign({}, this.defaults, params)
    }

    // 定义请求拦截器对象，包含请求拦截器 and 响应拦截器
    interceptors = {
        // request interceptor 
        request: (config) => config,
        // response interceptor 
        response: (response) => response
    }

    // Initialize queue array to store request array 
    queue = []

    /**
     * 发起请求
     * @param {*} options 请求配置选项，同 wx.request() 参数的选项
     * @returns Promise
     */
    request(options) {
        // if there is new request, clear the last timer
        this.timerId && clearTimeout(this.timerId)

        // Merges the params
        options.url = this.defaults.baseURL + options.url
        options = {
            ...this.defaults,
            ...options
        }

        if (options.isLoading && options.method !== 'UPLOAD') {
            // Before sending request, add loading style
            this.queue.length === 0 && wx.showLoading()

            // add a 'request' to array
            this.queue.push('request')
        }

        // Call request interceptor 
        options = this.interceptors.request(options)

        // console.log(options)

        return new Promise((resolve, reject) => {
            if (options.method === 'UPLOAD') {
                wx.uploadFile({
                    ...options,

                    success: (res) => {
                        // conveert responsed data into an JS object
                        res.data = JSON.parse(res.data)
                        const mergeRes = Object.assign({}, res, {
                            config: options,
                            isSuccess: true
                        })
                        resolve(this.interceptors.response(mergeRes))
                    },
                    fail: (err) => {
                        const mergeErr = Object.assign({}, err, {
                            config: options,
                            isSuccess: false
                        })
                        reject(this.interceptors.response(mergeErr))
                    },
                })
            } else {
                wx.request({
                    ...options,
                    success: (res) => {
                        // 不管接口成功还是失败，都需要调用响应拦截器
                        // 第一个参数：需要合并的目标对象
                        // 第二个参数：服务器响应的数据
                        // 第三个参数：请求的配置以及自定义的属性config，可以通过config获取对应请求的数据(如url、请求方式、timeout等等)
                        const mergeRes = Object.assign({}, res, {
                            config: options,
                            isSuccess: true
                        })
                        resolve(this.interceptors.response(mergeRes))
                    },
                    fail: (err) => {
                        // 不管接口成功还是失败，都需要调用响应拦截器
                        const mergeErr = Object.assign({}, err, {
                            config: options,
                            isSuccess: false
                        })
                        reject(this.interceptors.response(mergeErr))
                    },
                    complete: () => {
                        if (options.isLoading) {
                            // after a request each time, pop out a 'request'
                            this.queue.pop()

                            // if queue empty, add a 'request'
                            this.queue.length === 0 && this.queue.push('request')

                            // if timer exist, pop up the final 'requet' and hide loading after 100ms 
                            this.timerId = setTimeout(() => {
                                this.queue.pop()
                                this.queue.length === 0 && wx.hideLoading()
                            }, 100)
                        }

                    }
                })
            }

        })
    }

    // Encapsulate get shortcut method
    get(url, data = {}, config = {}) {
        return this.request(Object.assign({
            url,
            data,
            method: 'GET'
        }, config))
    }

    // Encapsulate post shortcut method
    post(url, data = {}, config = {}) {
        return this.request(Object.assign({
            url,
            data,
            method: 'POST'
        }, config))
    }

    // Encapsulate delete shortcut method
    delete(url, data = {}, config = {}) {
        return this.request(Object.assign({
            url,
            data,
            method: 'DELETE'
        }, config))
    }

    // Encapsulate put shortcut method
    put(url, data = {}, config = {}) {
        return this.request(Object.assign({
            url,
            data,
            method: 'PUT'
        }, config))
    }

    // Encapsulate Promise.all method
    all(...promises) {
        // console.log(promises)
        return Promise.all(promises)
    }

    // Encapsulate wx.uploadFile method
    upload(url, filePath, name, config = {}) {
        return this.request(Object.assign({
            url,
            filePath,
            name,
            method: 'UPLOAD'
        }, config))
    }

}

export default WxRequest