// API 接口统一出口文件

// 导入各个模块的API
import * as userAPI from './modules/user'
import * as productAPI from './modules/product'
import * as cartAPI from './modules/cart'

// 统一导出
export {
  userAPI,
  productAPI,
  cartAPI
}