
/**
 * 存储数据
 * @param {*} key 本地缓存中指定的 key 
 * @param {*} value value 需要缓存的数据
 */
export const setStroage = (key, value) => {
    try {
        wx.setStorageSync(key, value)
    } catch (error) {
        console.log('Set Strorage ${key} Failed, the error: ', e)
    }
}

/**
 * 从本地读取对应的 key 的数据
 * @param {*} key 
 */
export const getStorage = (key) => {
    try {
        const value = wx.getStorageSync(key)
        if(value) {
            return value;
        }
    } catch (error) {
        console.log('Get key: ${key} Failed, the error: ', error)
    }
} 

/**
 * 从本地清空指定 key 数据
 * @param {*} key 
 */
export const removeStorage = (key) => {
    try {
        wx.removeStorageSync(key)
    } catch (error) {
        console.log('Remove the key: ${key} Failed, the error: ', error)
    }
}

/**
 * 从本地清空全部数据
 */
export const clearStorage = () => {
    try {
        wx.clearStorageSync()
    } catch (error) {
        console.log('Clear Storage Failed, the error: ', error)
    }
}

/**
 * Async 将数据存储到本地
 * @param {*} key 
 * @param {*} value 
 */
export const asyncSetStorage = (key, value) => {
    return new Promise ((resolve) => {
        wx.setStorage({
            key,
            data: value,
            complete(res){
                resolve(res)
            }
        })
    })
}

/**
 * Async 获取指定 key 的值
 * @param {*} key 
 */
export const asyncGetStorage = (key) => {
    return new Promise((resolve) =>{
        wx.getStorage({
            key,
            complete(res){
                resolve(res)
            }
        })
    } )
}

/**
 * Async 从本地移除指定 key 的数据
 * @param {*} key 
 */
export const asyncRemoveStorage = (key) => {
    return new Promise((resolve) => {
        wx.removeStorage({
            key,
            complete(res){
                resolve(res)
            }
        })
    })
}

/**
 * Async 从本地清空所有缓存
 */
export const asyncClearStorage = () => {
    return new Promise((resolve) => {
        wx.clearStorage({
            complete(res) {
                resolve(res)
            }
        })
    })
}