import {
    userBehavior
} from './behavior'
import {
    getStorage,
    setStroage
} from '../../../../utils/storage'
import {
    reqUpdateUserInfo
} from '../../../../api/user'

// /modules/settingModule/pages/profile/profile.js

Page({
    behaviors: [userBehavior],

    // 页面的初始数据
    data: {
        isShowPopup: false // 控制更新用户昵称的弹框显示与否
    },

    // Update user avatar
    chooseAvatar(event) {
        // console.log(event)
        const {
            avatarUrl
        } = event.detail

        wx.uploadFile({
            filePath: avatarUrl,
            name: 'file',
            url: 'https://gmall-prod.atguigu.cn/mall-api/fileUpload',
            header: {
                token: getStorage('token')
            },
            success: (res) => {
                // console.log(res)
                const uploadRes = JSON.parse(res.data)
                this.setData({
                    'userInfo.headimgurl': uploadRes.data
                })
            },
            fail: (err) => {
                console.log(err)
                wx.showToast({
                    title: '头像更新失败，请稍后再试',
                    icon: 'none'
                })
            },
        })
    },

    // update user info, bind tap funciton
    async updateUserInfo() {
        await reqUpdateUserInfo(this.data.userInfo)

        // Store userinfo in local storage
        setStroage('userInfo', this.data.userInfo)

        // Coincide store userinfo in Store
        this.setUserInfo(this.data.userInfo)

        wx.showToast({
            title: '用户信息更新成功',
            icon: 'none'
        })
    },


    // 显示修改昵称弹框
    onUpdateNickName() {
        this.setData({
            isShowPopup: true
        })
    },

    // Get new nickname
    getNewName(event) {
        // console.log(event)
        const {
            nickname
        } = event.detail.value
        this.setData({
            'userInfo.nickname': nickname,
            isShowPopup: false
        })
    },

    // 弹框取消按钮
    cancelForm() {
        this.setData({
            isShowPopup: false,
            'userInfo.nickname': this.data.userInfo.nickname
        })
    }
})