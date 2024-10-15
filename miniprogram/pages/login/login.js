// pages/login/login.js

import {
    reqLogin,
    reqUserInfo
} from '../../api/user'
import {
    setStroage
} from '../../utils/storage'

import {
    userStore
} from '../../stores/userstore'
import {
    ComponentWithStore
} from 'mobx-miniprogram-bindings'
import {
    debounce
} from 'miniprogram-licia'

ComponentWithStore({

    storeBindings: {
        store: userStore,
        fields: ['token', 'userInfo'],
        actions: ['setToken', 'setUserInfo']
    },

    methods: {

        // click buttin to login 
        login: debounce(function () {
            wx.login({
                success: async ({
                    code
                }) => {
                    if (code) {
                        const loginRes = await reqLogin(code)
                        // console.log(loginRes)

                        // set user token to local storage
                        setStroage('token', loginRes.data.token)

                        // bind to Store object 'userStore'
                        this.setToken(loginRes.data.token)

                        // get user Info
                        this.getUserInfo()

                        // back to my page
                        wx.navigateBack()
                    } else {
                        wx.showToast({
                            title: '授权失败，请稍后再试',
                            icon: 'error'
                        })
                    }
                },
            })
        }, 500),

        // get user Info
        async getUserInfo() {
            const {
                data
            } = await reqUserInfo()
            // store userInfo to local storage
            setStroage('userInfo', data)
            // store userInfo to Store
            this.setUserInfo(data)
        }
    }

})