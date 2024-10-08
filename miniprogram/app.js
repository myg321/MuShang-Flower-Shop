import {
    toast
} from './utils/extendApi'
import './utils/extendApi'
import {
    asyncClearStorage,
    asyncGetStorage,
    asyncRemoveStorage,
    asyncSetStorage
} from './utils/storage'
import instance from './utils/http'
import {
    reqSwiperData
} from './api/index'


App({
    async onLaunch() {
        // const res = await a.request({
        //     url: 'index/findBanner',
        //     method: 'GET'
        // })

        // const res = await instance.get('/index/findBanner', null, {
        //     isLoading: true
        // }).catch((err) => {
        //     console.log(err)
        // })
        // console.log(res)

        // const res = instance.all(instance.get('/index/findBanner'), instance.get('/index/findCategory1'),)

        // console.log(wx.getAccountInfoSync())


    }
})