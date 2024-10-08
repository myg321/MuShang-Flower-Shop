// import interface API
import {
    reqIndexData
} from '../../api/index'

Page({
    // Initialize data
    data: {
        bannerList: [], // 轮播图数据
        categoryList: [], // 分类数据
        activeList: [], // 活动广告
        guessList: [], // 猜你喜欢
        hotList: [], // 人气推荐
        loading: true // loading时是否展示骨架屏，默认为 true
    },

    // get index page data
    async getIndexData() {
        // 数组每一项是 Promise 产生的结果，并且是按照顺序返回
        const res = await reqIndexData()
        // console.log(res)

        // after obtaining data, assign values to them
        this.setData({
            bannerList: res[0].data,
            categoryList: res[1].data,
            activeList: res[2].data,
            guessList: res[3].data,
            hotList: res[4].data,
            loading: false
        })
    },

    // Monitor page loading
    onLoad() {
        // Call the callback to get index page data
        this.getIndexData()
    }


})