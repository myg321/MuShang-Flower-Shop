// extendsApi.js

/**
 * @description 封装消息提示组件
 * @param {*} title 提示的内容
 * @param {*} icon 图标
 * @param {*} duration 提示的延迟时间
 * @param {*} mask 是否显示透明蒙层，防止触摸穿透
 */
const toast = ({ title = "loading...", icon = 'none', mask = true, duration = 2000 } = {}) => {
    wx.showToast({
        title,
        icon,
        mask,
        duration
    })
}

/**
 * @description 封装 wx.showModel 方法
 * @param {*} options 同 wx.showModel 配置参数
 */
const model = (options = {}) => {
    return new Promise((resolve) => {

        // 默认参数
        const defaultOpt = {
            title: '提示',
            content: '您确定执行该操作吗?',
            confirmColor: '#f3514f',
        }

        // 合并参数
        const opts = Object.assign({}, defaultOpt, options)

        wx.showModal({
          ...opts,
          complete: ({confirm, cancel}) => {
            confirm && resolve(true),
            cancel && resolve(false)
          }
        })
    }) 
}





// 模块化方式导出
export { toast, model}

// 在 wx 全局对象上封装 toast 方法
wx.toast = toast
wx.model = model

