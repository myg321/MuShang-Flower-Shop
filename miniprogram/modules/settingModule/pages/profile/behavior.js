import { BehaviorWithStore } from 'mobx-miniprogram-bindings'

// impoert store object
import { userStore } from '../../../../stores/userstore'

/**
 * @description impoert userBehavior with Store
 */
export const userBehavior = BehaviorWithStore({
    storeBindings: {
        store: userStore,
        fields: ['userInfo']
    }
})