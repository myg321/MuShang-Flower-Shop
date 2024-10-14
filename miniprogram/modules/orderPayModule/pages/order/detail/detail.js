import {
    reqOrderAddress,
    reqOrderInfo,
    reqBuyNowGoods,
    reqSubmitOrder,
    reqPreBuyInfo,
    reqPayStatus
} from '@/api/orderpay'

import {
    formatTime
} from '@/utils/formatTime'

// 引入 async-validator，async-validator 提供了一个构造函数
import Schema from 'async-validator'

// Get glbal data
const app = getApp()

Page({
    data: {
        buyName: '', // 订购人姓名
        buyPhone: '', // 订购人手机号
        deliveryDate: '', // 期望送达日期
        blessing: '', // 祝福语
        show: false, // 期望送达日期弹框
        minDate: new Date().getTime(),
        currentDate: new Date().getTime(),
        orderAddress: {}, // Addresses
        orderInfo: {} // Buying order info
    },

    // 选择期望送达日期
    onShowDateTimerPopUp() {
        this.setData({
            show: true
        })
    },

    // 期望送达日期确定按钮
    onConfirmTimerPicker(event) {
        // 使用 new Date 将时间戳转换成 JS 中的日期对象
        const time = formatTime(new Date(event.detail))

        this.setData({
            show: false,
            deliveryDate: time
        })
    },

    // 期望送达日期取消按钮 以及 关闭弹框时触发
    onCancelTimePicker() {
        this.setData({
            show: false,
            minDate: new Date().getTime(),
            currentDate: new Date().getTime()
        })
    },

    // 跳转到收货地址
    toAddress() {
        wx.navigateTo({
            url: '/modules/settingModule/pages/address/list/index'
        })
    },

    // Get Address
    async getAddress() {
        // If global data has address info, take it out
        if (app.globalData.address.id) {
            this.setData({
                orderAddress: app.globalData.address
            })

            // Clear address after assigned
            app.globalData.address = {}
            return
        }

        // If global data empty, make the request to get address
        const {
            data
        } = await reqOrderAddress()

        this.setData({
            orderAddress: data
        })
    },

    // Get oreder info
    async getOrderInfo() {
        const {
            goodsId,
            blessing
        } = this.data

        // If goodsId in data, call reqBuyNowGoods api
        // If not, call reqOrderInfo api
        const {
            data: orderInfo
        } = goodsId ? await reqBuyNowGoods({
            goodsId,
            blessing
        }) : await reqOrderInfo()

        // If buying more than 1 items, 
        // select the first item filled in blessing for assignment
        const orderGoods = orderInfo.cartVoList.find((item) => item.blessing !== '')

        this.setData({
            orderInfo,
            blessing: !orderGoods ? '' : orderGoods.blessing
        })
    },

    // Submit order
    async submitOrder() {
        // Deconstructing data from 'data'
        const {
            buyName,
            buyPhone,
            deliveryDate,
            blessing,
            orderInfo,
            orderAddress
        } = this.data

        // Organize request params
        const params = {
            buyName,
            buyPhone,
            deliveryDate,
            remarks: blessing,
            cartList: orderInfo.cartVoList,
            userAddressId: orderAddress.id
        }

        // Call vertify request params function
        const {
            valid
        } = await this.validatePerson(params)

        // If failed vertification, do not execute the following logic
        if (!valid) return

        // Call api function to create orders
        const res = await reqSubmitOrder(params)
        // console.log(res)

        // After created, mount order id on the page instance
        if (res.code === 200) {
            this.orderNo = res.data

            // Get prepay info and payment params
            this.advancePay()
        }
    },

    // Get prepay info and payment params
    async advancePay() {
        try {
            const payParams = await reqPreBuyInfo(this.orderNo)

            if (payParams.code === 200) {
                // Weixin payment
                const payInfo = await wx.requestPayment(payParams.data)

                // Get payment result
                if (payInfo.errMsg === 'requestPayment:ok') {
                    // Check order payment status
                    const payStatus = await reqPayStatus(this.orderNo)

                    if (payStatus.code === 200) {
                        wx.redirectTo({
                            url: '/modules/orderPayModule/pages/order/list/list',
                            success: () => {
                                wx.showToast({
                                    title: '支付成功',
                                    icon: "success"
                                })
                            },
                        })
                    }
                }
            }
        } catch (error) {
            console.log(error)
            wx.showToast({
                title: '支付失败',
                icon: "error",
            })
        }
    },

    // Vertify request params
    validatePerson(params) {
        // 验证订购人，是否只包含大小写字母、数字和中文字符
        const nameRegExp = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$'

        // 验证订购人手机号
        const phoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$'

        // set rules (object)
        // 每一项是一个验证规则，验证规则属性需要和验证的数据进行同名
        const rules = {
            userAddressId: {
                required: true,
                message: '请选择收货地址'
            },
            buyName: [{
                    required: true,
                    message: '请输入订购人姓名'
                },
                {
                    pattern: nameRegExp,
                    message: '姓名含特殊符号，请重新输入'
                },
            ],
            buyPhone: [{
                    required: true,
                    message: '请输入订购人手机号'
                },
                {
                    pattern: phoneReg,
                    message: '手机号不合法'
                },
            ],
            deliveryDate: {
                required: true,
                message: '请选择送达时间'
            }
        }

        // create the instance and pass in the rules
        const validator = new Schema(rules)

        // call instance and certify the data
        return new Promise((resolve) => {
            validator.validate(params, (errors) => {
                if (errors) {
                    wx.showToast({
                        title: errors[0].message,
                        icon: "none"
                    })
                    resolve({
                        valid: false
                    })
                } else {
                    resolve({
                        valid: true
                    })
                }
            })
        })
    },

    onLoad(options) {
        // Get buy now request api params
        this.setData({
            ...options
        })
    },

    onShow() {
        // Get order address
        this.getAddress()

        // Get buying order info
        this.getOrderInfo()
    }
})