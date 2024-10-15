import {
    reqAddressList,
    reqDelAddress
} from '../../../api/address'
import {
    model
} from '../../../../../utils/extendApi'
import {
    swipeCellBehavior
} from '../../../../../behaviors/swipeCellBehavior'

// Get glbal data
const app = getApp()

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

    // Change address when clicking one address item
    changeAddress(event) {
        // Determine whetere entered from order page
        if (this.flag !== '1') return

        // Get clicked address id
        const addressId = event.currentTarget.dataset.id
        // console.log(addressId)

        // Find clicked address id from address list
        // Attention: find function, after '=>' should be a judgment statement, not '{}'
        const address = this.data.addressList.find((item) =>
            item.id === addressId
        )

        // If find this one, set its data into global data
        if (address) {
            app.globalData.address = address
            wx.navigateBack()
        }
    },


    // Each time this page on show, update list rendering
    onShow() {
        this.getAddressList()
    },

    onLoad(options) {
        this.flag = options.flag
    }
})