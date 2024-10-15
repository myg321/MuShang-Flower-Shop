import {
    reqOrderList
} from '../../../api/orderpay'

Page({
    // 页面的初始数据
    data: {
        orderList: [1, 2, 3],
        page: 1,
        limit: 10,
        total: 0,
        isLoading: false
    },

    // Get order list
    async getOrderList() {
        const {
            page,
            limit
        } = this.data

        this.isLoading = true

        // Call api function to get order list
        const res = await reqOrderList(page, limit)
        // console.log(res)

        this.isLoading = false

        if (res.code === 200) {
            this.setData({
                orderList: [...this.data.orderList, ...res.data.records],
                total: res.data.total
            })
        }
    },

    // When reaching the bottom of current page
    onReachBottom() {
        const {
            page,
            total,
            orderList,
            isLoading
        } = this.data

        // if loading not compelte, do not load next page
        if (isLoading) return

        // Compare "Total number of data" and "Order list length"
        if (total === orderList.length) {
            return wx.showToast({
                title: '数据加载完毕'
            })
        }

        // Update page
        this.setData({
            page: page + 1
        })

        // Resend request
        this.getOrderList()
    },

    onLoad() {
        this.getOrderList()
    }

})