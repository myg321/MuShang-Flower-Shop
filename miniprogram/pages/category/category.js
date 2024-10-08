// import encapsulated interface API
import {
    reqCategoryData
} from '../../api/category'

Page({

    /**
     * page initail data
     */
    data: {
        categoryList: [], // Category list data
        activeIndex: 0 // Click to highlight the navigation id
    },


    /**
     * @description get category page data
     */
    async getCategoryData() {
        const res = await reqCategoryData()
        // console.log(res)
        this.setData({
            categoryList: res.data
        })
    },

    updateActive(event) {
        // console.log(event)
        const {
            index
        } = event.currentTarget.dataset
        // console.log(index)
        this.setData({
            activeIndex: index
        })
    },

    // 生命周期函数--监听页面加载
    onLoad(options) {
        this.getCategoryData()
    },

})