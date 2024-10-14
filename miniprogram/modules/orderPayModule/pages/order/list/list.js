import {
    reqOrderList
} from '@/api/orderpay'

Page({
    // 页面的初始数据
    data: {
        orderList: [1, 2, 3],
        page: 1,
        limit: 10,
        total: 0
    },

    // Get order list
    async getOrderList() {
        const {
            page,
            limit
        } = this.data

        // Call api function to get order list
        const res = await reqOrderList(page, limit)
        console.log(res)

        if(res.code === 200) {
            this.setData({
                orderList: res.data.records,
                total: res.data.total
            })
        }
    },

    onLoad () {
        this.getOrderList()
    }

})