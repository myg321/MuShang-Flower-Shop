import {
    reqGoodsInfo
} from "../../../api/goods"
import {
    userBehavior
} from '../../../behaviors/userBehavior'
import {
    reqAddCart,
    reqCartList
} from '@/api/cart'

Page({
    behaviors: [userBehavior],

    // 页面的初始数据
    data: {
        goodsInfo: {}, // 商品详情
        show: false, // 控制加入购物车和立即购买弹框的显示
        count: 1, // 商品购买数量，默认是 1
        blessing: '', // 祝福语
        buyNow: 0, // 是否立即购买，立即购买 1，加入购物车 0
        allCount: '' // 购物车商品总数量
    },

    // Get good detail
    async getGoodsInfo() {
        // Call api function to get goods detail by passing in goods id
        const {
            data: goodsInfo
        } = await reqGoodsInfo(this.goodsId)
        this.setData({
            goodsInfo
        })
    },

    // Full screen preview image
    previewImg() {
        wx.previewImage({
            urls: this.data.goodsInfo.detailList
        })
    },

    // 加入购物车
    handleAddcart() {
        this.setData({
            show: true,
            buyNow: 0
        })
    },

    // 立即购买
    handeGotoBuy() {
        this.setData({
            show: true,
            buyNow: 1
        })
    },

    // 点击关闭弹框时触发的回调
    onClose() {
        this.setData({
            show: false
        })
    },

    // 弹窗的确定按钮
    async handleSubmit() {
        const {
            token,
            count,
            blessing,
            buyNow
        } = this.data
        const goodsId = this.goodsId

        // if no token, user should login first
        if (!token) {
            wx.navigateTo({
                url: '/pages/login/login',
            })
            return
        }

        // When adding to cart
        if (buyNow === 0) {
            const res = await reqAddCart({
                goodsId,
                count,
                blessing
            })

            if (res.code === 200) {
                wx.showToast({
                    title: '加入购物车成功',
                    icon: "none"
                })
                this.getCartCount()
                this.setData({
                    show: false
                })
            }
        } else {
            wx.navigateTo({
                url: `/modules/orderPayModule/pages/order/detail/detail?goodsId=${goodsId}&blessing=${blessing}`
            })
        }

    },

    // 监听是否更改了购买数量
    onChangeGoodsCount(event) {
        this.setData({
            count: Number(event.detail)
        })
    },

    // 计算购买数量
    async getCartCount() {
        // if no token, uesr should login first
        if (!this.data.token) return

        // Get items to buy
        const res = await reqCartList()

        if (res.data.length !== 0) {
            let allCount = 0

            res.data.forEach((item) => {
                allCount += item.count
            })

            this.setData({
                // type: Number -> string, by splicing with empty stirng
                allCount: (allCount > 99 ? '99+' : allCount) + ''
            })
        }
    },

    // 
    onTextAreaChange() {

    },

    // onLoad 钩子函数
    onLoad(options) {
        this.goodsId = options.goodsId ? options.goodsId : ''

        // 调用获取商品详情数据的方法
        this.getGoodsInfo()

        // 计算购买数量
        this.getCartCount()
    },

    // Send miniprogram to friends
    onShareAppMessage() {
        return {
            title: '所有的怦然心动，都是你',
            pages: '/pages/index/index',
            imageUrl: '../../assets/images/love.jpg'
        }
    },

    // Share miniprogram to moments
    onShareTimeline() {}
})