import {
    reqAddressList,
    reqDelAddress
} from '../../../../../api/address'
import {
    model
} from '../../../../../utils/extendApi'
import {
    swipeCellBehavior
} from '../../../../../behaviors/swipeCellBehavior'

Page({
    behaviors: [swipeCellBehavior],

    // 页面的初始数据
    data: {
        addressList: []
    },

    // 去编辑页面
    toEdit(event) {

        const {
            id
        } = event.target.dataset

        wx.navigateTo({
            url: `/modules/settingModule/pages/address/add/index?id=${id}`
        })
    },

    // Get the delivery address
    async getAddressList() {
        const {
            data: addressList
        } = await reqAddressList()

        this.setData({
            addressList
        })
    },

    // Delete selected list items
    async delAddress(event) {
        const {
            id
        } = event.target.dataset

        // Second time confirmation
        var modelRes = await model({
            content: "您确定删除该地址么？"
        })
        if (modelRes) {
            await reqDelAddress(id)
        }
        wx.showToast({
            title: '删除地址成功',
            icon: "success"
        })

        // After delected, redering the list 
        this.getAddressList()
    },


    // Each time this page on show, update list rendering
    onShow() {
        this.getAddressList()
    }
})