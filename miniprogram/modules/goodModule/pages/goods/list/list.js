// pages/goods/list/index.js

import {
    reqGoodsList
} from "../../../../../api/goods"

Page({
    /**
     * 页面的初始数据
     */
    data: {
        goodsList: [], // 商品列表数据
        isFinish: false, // 判断数据是否加载完毕
        total: 0, // total items of data
        isLoading: false, // determine if data requeste done

        requestData: {
            page: 1,
            limit: 10,
            category1Id: '',
            category2Id: '',
        }
    },

    // Get goods list data
    async getGoodsList() {
        // data requesting
        this.data.isLoading = true

        const {
            data
        } = await reqGoodsList(this.data.requestData)
        // console.log(res)

        // data requested
        this.data.isLoading = false

        this.setData({
            goodsList: [...this.data.goodsList, ...data.records],
            total: data.total
        })
    },

    // Triggered when reaching the bottom of current page 
    onReachBottom() {
        const {
            goodsList,
            total,
            isLoading,
            requestData
        } = this.data
        var {
            page
        } = requestData

        // if isLoading, then terminate further request
        if (isLoading) return

        // Determine whether the data has been loaded
        if (total === goodsList.length) {
            this.setData({
                isFinish: true
            })
            return
        }

        // page number + 1
        this.setData({
            requestData: {
                ...this.data.requestData,
                page: page + 1
            }
        })

        this.getGoodsList()
    },

    // Triggered when pull down to refresh current page
    onPullDownRefresh() {
        // reset the data
        this.setData({
            goodsList: [],
            total: 0,
            isFinish: false,
            requestData: {
                ...this.data.requestData,
                page: 1
            }
        })

        // re-request the list data
        this.getGoodsList()

        // Close pull down refresh
        wx.stopPullDownRefresh()
    },

    // onLoad 钩子函数
    onLoad(options) {
        Object.assign(this.data.requestData, options)

        // Get goods list data
        this.getGoodsList()
    }

})