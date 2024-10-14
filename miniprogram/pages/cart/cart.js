import {
    ComponentWithStore
} from 'mobx-miniprogram-bindings'
import {
    userStore
} from '@/stores/userstore'
import {
    reqAddCart,
    reqCartList,
    reqCheckAllCart,
    reqDelCart,
    reqUpdateChecked
} from '@/api/cart'
// 使用 licia 防抖函数
import {
    debounce
} from 'miniprogram-licia'
// 统一 swipeCell 滑块左滑删除逻辑
import {
    swipeCellBehavior
} from '@/behaviors/swipeCellBehavior'
import {
    model
} from '@/utils/extendApi'

// Add computed behavior
const computedBehavior = require('miniprogram-computed').behavior


ComponentWithStore({
    behaviors: [computedBehavior, swipeCellBehavior],

    // 组件和 Store 对象关联
    storeBindings: {
        store: userStore,
        fields: ['token']
    },

    computed: {
        // computed 函数中不能访问 this ，只有 data 对象可供访问
        // 这个函数的返回值会被设置到 this.data.selectAllStatus 字段中

        // Determine if select all
        selectAllStatus(data) {
            return (data.cartList.length !== 0 && data.cartList.every(item => item.isChecked === 1))
        },

        // compute total price
        totalPrice(data) {

            let totalPrice = 0
            data.cartList.forEach(item => {
                if (item.isChecked === 1) {
                    totalPrice += item.count * item.price
                }
            })

            return totalPrice
        }
    },

    // 组件的初始数据
    data: {
        cartList: [],
        emptyDes: '还没有添加商品，快去添加吧～'
    },

    // 组件的方法列表
    methods: {
        // Get cart list and handle page display
        async showTipGetList() {
            // if no token, user should log in first
            if (!this.data.token) {
                this.setData({
                    emptyDes: '您尚未登录，点击登录获取更多权益',
                    cartList: []
                })
                return
            }

            // Get goods list data
            const {
                data: cartList,
                code
            } = await reqCartList()

            if (code === 200) {
                this.setData({
                    cartList,
                    emptyDes: cartList === 0 && '还没有添加商品，快去添加吧～'
                })
            }

        },

        // update checked
        async updateChecked(event) {
            const {
                detail
            } = event
            const {
                id,
                index
            } = event.target.dataset

            // update newest data
            const isChecked = detail ? 1 : 0
            console.log(isChecked)

            // Call api function to update goods status
            const res = await reqUpdateChecked(id, isChecked)

            // if success, change local data together
            if (res.code === 200) {
                this.setData({
                    [`cartList[${index}].isChecked`]: isChecked
                })
            }

        },

        // change all select status
        async changeAllStatus(event) {
            // get all selected result
            const isChecked = event.detail ? 1 : 0
            // console.log(isChecked)

            // Call api fucntion to send server all select status
            const res = await reqCheckAllCart(isChecked)

            // change local correspondent data
            if (res.code === 200) {
                // deep copy
                const newCart = JSON.parse(JSON.stringify(this.data.cartList))
                newCart.forEach(item => {
                    item.isChecked = isChecked
                })

                this.setData({
                    cartList: newCart
                })
            }

        },

        // update cart list item quantity
        // debounce time: 500 ms
        changeBuyNum: debounce(async function (event) {
            // if input value > 200, reset value into 200
            let newBuyNum = event.detail > 200 ? 200 : event.detail

            // console.log(event)
            const {
                id,
                index,
                oldbuynum
            } = event.target.dataset

            // verify if user input 1 ~ 200 INTEGER
            const reg = /^([1-9]|[1-9]\d|1\d{2}|200)$/
            const regRes = reg.test(newBuyNum)

            // If failed, reset to oldBuyNum
            if (!regRes) {
                // console.log("-----")
                this.setData({
                    [`cartList[${index}].count`]: oldbuynum
                })
                return
            }

            // If passed, computed difference value and send to server
            const dif = newBuyNum - oldbuynum

            // If uncahnged, do not send
            if (dif === 0) return

            const res = await reqAddCart({
                goodsId: id,
                count: dif
            })

            // update local correspondent data
            if (res.code === 200) {
                this.setData({
                    [`cartList[${index}].count`]: newBuyNum
                })
            }

        }, 500),

        // delete goods in cart
        async delCartGoods(event) {
            // console.log(event)
            const {
                id
            } = event.currentTarget.dataset

            // second time confirm if really sure to delete
            const modelRes = await model({
                content: '您确认要删除该商品吗？'
            })

            if (modelRes) {
                await reqDelCart(id)

                // refresh cart list page
                this.showTipGetList()
            }
        },

        // go to order page
        toOrder() {
            // if no goods selected, show toast
            if (this.data.totalPrice === 0) {
                wx.showToast({
                    title: '请选择需要购买的商品',
                    icon: 'none'
                })
                return
            }

            wx.navigateTo({
                url: '/modules/orderPayModule/pages/order/detail/detail'
            })
        },


        onShow() {
            this.showTipGetList()
        },

        // Close siwper when user swipes left and turn to other pages 
        onHide() {
            this.onSwipeCellCommonClick()
        }
    }
})