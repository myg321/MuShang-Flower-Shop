// import { QQMapWX } from '../../../../../libs/qqmap-wx-jssdk'
// 使用上面的import方式，总是报错：QQMapWX is not a constructor，目前视为未解决错误
// 使用旧版本导入方式（下面一行）成功导入
var QQMapWX = require('../../../../../libs/qqmap-wx-jssdk.js');

// 引入 async-validator，async-validator 提供了一个构造函数
import Schema from 'async-validator'

import {
    reqAddAddress,
    reqAddressInfo,
    reqUpdateAddress
} from '../../../../../api/address'

Page({
    // 页面的初始数据
    data: {
        // 将请求参数直接放到 data 下，方便进行数据绑定
        "name": "", // 收货人
        "phone": "", // 手机号码
        "provinceName": "湖北省", // 省
        "provinceCode": "", // 省编码
        "cityName": "武汉市", // 市
        "cityCode": "", // 市编码
        "districtName": "洪山区", // 区
        "districtCode": "", // 区编码
        "address": "", // 详细地址
        "fullAddress": "", // 完整地址
        "isDefault": 0 // 设置默认地址，是否默认地址 -- 0：否  1：是
    },

    // 保存收货地址
    async saveAddrssForm(event) {
        // Deconstructing province, city, district and isDefault address
        const {
            provinceName,
            cityName,
            districtName,
            address,
            isDefault
        } = this.data

        // merge request parameters
        const params = {
            ...this.data,
            fullAddress: provinceName + cityName + districtName + address,
            isDefault: isDefault ? 1 : 0
        }
        // console.log(params)

        // Call validate function to certify data
        const {
            valid
        } = await this.validateAddress(params)

        // if not pass then no further logic is executed
        if (!valid) return

        const res = this.addressId ? await reqUpdateAddress(params) : await reqAddAddress(params)
        if (res.code === 200) {
            wx.showToast({
                title: this.addressId ? '更新收货地址成功' : '新增收货地址成功',
                icon: "success",
                duration: 1000
            })
            // 延时后执行页面跳转
            setTimeout(() => {
                wx.navigateBack();
            }, 1000); // 延时时间应与 Toast 显示时长一致或更长
        }
    },

    // show address info
    async showAddressInfo(id) {
        // Determine whether id exists, if not, following logic is not excuted
        if (!id) return

        // if exists, put id onto this page instance
        this.addressId = id

        // dynamically set current page title
        wx.setNavigationBarTitle({
            title: '更新收货地址',
        })

        // call api function to get address info by passing in 'id'
        const {
            data
        } = await reqAddressInfo(this.addressId)
        this.setData(data)
    },

    // 验证新增收货地址请求参数
    // params 需要验证的数据
    // returns Promise
    validateAddress(params) {
        // 验证收货人，是否只包含大小写字母、数字和中文字符
        const nameRegExp = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$'

        // 验证手机号
        const phoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$'

        // set rules (object)
        // 每一项是一个验证规则，验证规则属性需要和验证的数据进行同名
        const rules = {
            name: [{
                    required: true,
                    message: '请输入收货人姓名'
                },
                {
                    pattern: nameRegExp,
                    message: '请输入正确的收货人姓名'
                },
            ],
            phone: [{
                    required: true,
                    message: '请输入收货人手机号'
                },
                {
                    pattern: phoneReg,
                    message: '手机号不合法'
                },
            ],
            provinceName: {
                required: true,
                message: '请选择收货人所在地区'
            },
            address: {
                required: true,
                message: '请输入详细地址'
            }
        }

        // create the instance and pass in the rules
        const validator = new Schema(rules)

        // call instance and certify the data
        return new Promise((resolve) => {
            validator.validate(params, (errors) => {
                if (errors) {
                    wx.showToast({
                        title: errors[0].message,
                        icon: "none"
                    })
                    resolve({
                        valid: false
                    })
                } else {
                    resolve({
                        valid: true
                    })
                }
            })
        })
    },

    // 省市区选择
    onAddressChange(event) {
        // Deconstructing Province, City, district name 
        const [provinceName, cityName, districtName] = event.detail.value
        const [provinceCode, cityCode, districtCode] = event.detail.code

        this.setData({
            provinceName,
            cityName,
            districtName,
            provinceCode,
            cityCode,
            districtCode
        })
    },

    // Get user location
    async onLocation() {
        // 打开地图选择位置，获取 纬度 、精度
        const {
            latitude,
            longitude,
            name
        } = await wx.chooseLocation()
        // console.log(latitude)

        // 使用 reverseGeocoder 方法进行逆地址解析
        this.qqmapsdk.reverseGeocoder({
            location: {
                latitude,
                longitude
            },

            // 逆地址解析成功后执行
            success: (res) => {
                // console.log(res)

                // 获取街道、门牌 （可能为空）
                const {
                    street,
                    street_number
                } = res.result.address_component

                const {
                    province, // 省
                    city, // 市
                    district, // 区
                    adcode, // 行政区划代码
                    city_code, // 城市代码，由国家码+行政区划代码（提出城市级别）组合而来，总共为9位
                    nation_code // 国家代码 
                } = res.result.ad_info

                // 获取标准地址
                const {
                    standard_address
                } = res.result.formatted_addresses

                this.setData({
                    // 省级: 前两位有值，后4位置0，如，河北省: 130000
                    provinceCode: adcode.replace(adcode.substring(2, 6), '0000'),
                    provinceName: province,

                    // 市前面多个国家代码，需要进行截取
                    cityCode: city_code.slice(nation_code.length),
                    cityName: city,

                    // 东莞市、中山市、修州市、嘉关市 因其下无区县级
                    districtCode: district && adcode,
                    districtName: district,

                    // 详细地址
                    address: street + street_number + name,
                    // 完整地址
                    fullAddress: standard_address + name
                })
            }

        })

    },

    // onLoad 钩子函数
    onLoad(options) {
        this.qqmapsdk = new QQMapWX({
            // @myg321 为‘图图的慕尚花坊’申请的 key
            key: '6BHBZ-2LWK7-NRVX3-PGFH4-5P6RS-6NFN7'
        })

        // console.log(options.id)
        // Show address info logic
        this.showAddressInfo(options.id)
    }
})