// API 接口统一出口文件

// 导入各个模块的API
import * as userAPI from './modules/user'
import * as productAPI from './modules/product'

// 统一导出
export {
  userAPI,
  productAPI
}