# 慕尚花坊微信小程序项目



![](https://picbed-toootu.oss-cn-wuhan-lr.aliyuncs.com/pics/202410151817592.jpg)



![](https://picbed-toootu.oss-cn-wuhan-lr.aliyuncs.com/pics/202410151818572.jpg)





## **一、项目概述**

[慕尚花坊] 是一款 同城鲜花订购 的小程序，专业提供各地鲜花速递、鲜花预定、网上订花、包月鲜花等服务。最快3小时送花上门，保证花材新鲜和鲜花质量，可先送花后付款，专业花艺师傅精美包扎，品质保证，至诚服务。



本项目为个人学习项目，参考 [B站教学视频](https://www.bilibili.com/video/BV1LF4m1E7kB/?share_source=copy_web&vd_source=1614bf0e98cc2efdce6446164709b2e7) 开发的花坊商城微信小程序，旨在学习和实践微信小程序的开发技术（前端），不用于商业用途。



## **二、项目功能**

[慕尚花坊] 项目涵盖电商项目常见功能模块，包含：

- 项目首页
- 商品分类
- 商品列表
- 商品详情
- 用户管理
- 收货地址
- 购物车
- 结算支付
- 订单管理 等……



## 三、项目结构技术栈

**[慕尚花坊] 项目使用原生小程序进行搭建开发，项目涵盖小程序开发所有常用的知识点**



- 小程序内置组件：采用小程序内置组件 结合 `Vant` 组件库实现页面结构的搭建
- 项目中使用了 css 拓展语言 Scss 绘制页面的结构
- 小程序内置`API`：交互、支付、文件上传、地图定位、网络请求、预览图片、本地存储等
- 小程序分包加载：降低小程序的启动时间、包的体积，提升用户体验度
- 小程序组件开发：将页面内的功能模块抽象成自定义组件，实现代码的复用
- 网络请求封装：request 方法封装、快捷方式封装、响应拦截器、请求拦截器
- `骨架屏`组件：利用开发者工具提供了自动生成骨架屏代码的能力，提高了整体使用体验和用户满意度。
- `UI` 组件库：使用 `Vant` 组件库实现小程序 结构的绘制
- `LBS`：使用腾讯地图服务进行 `LBS`逆地址解析，实现选择收货地址功能
- `miniprogram-licia`：使用 [licia](https://licia.liriliri.io/) 进行函数的防抖节流
- `async-validator`：使用 [async-validator](https://github.com/yiminghe/async-validator) 实现表单验证
- `miniprogram-computed`: 使用 [miniprogram-computed](https://github.com/wechat-miniprogram/computed)  进行计算属性功能
- `mobx-miniprogram`：使用 `mobx-miniprogram` 进行项目状态的管理



## **四、接口文档**

[慕尚花坊系统-API文档](https://apifox.com/apidoc/shared-6ed6c5c4-56c4-4619-8e2a-4817aa140e30)



## **五、许可证**

本项目使用 [MIT 许可证](https://opensource.org/licenses/MIT)，你可以自由地使用、修改和分发本项目的代码，只要在分发时保留原始版权声明和许可证文件。



## **六、如何运行**

1. 克隆本项目到本地：

```plaintext
   git clone <项目的 GitHub 地址>
```

2. 打开微信开发者工具，选择 “导入项目”，并选择克隆到本地的项目文件夹。
3. 配置好相关的开发环境，如微信开发者工具的设置、模拟器选择等。
4. 编译并运行项目，即可在模拟器中查看和使用慕尚花坊小程序。



## **七、学习与交流**

如果你对本项目有任何建议、发现了问题或者想要进行改进，欢迎通过 GitHub 的 Issues 功能提出，或者直接提交 Pull Request。希望这个项目能够帮助到其他学习微信小程序开发的同学，让我们一起进步😀。