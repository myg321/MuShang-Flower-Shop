// import 'observable' to create observable object
// import 'action' to modify observable status
import {
    observable,
    action
} from 'mobx-miniprogram'
import {
    getStorage
} from '../utils/storage'

export const userStore = observable({
    // observable data
    token: getStorage('token') || '',
    userInfo: getStorage('userInfo') || {},

    // modify token
    setToken: action(function (token) {
        this.token = token
    }),

    // set user info
    setUserInfo: action(function (userInfo) {
        this.userInfo = userInfo
    })
})