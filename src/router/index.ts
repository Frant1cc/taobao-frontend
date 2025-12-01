// @ts-ignore
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home/Home.vue'
import ProductDetail from '../views/product/ProductDetail.vue'
import Cart from '../views/cart/Cart.vue'
import Checkout from '../views/checkout/Checkout.vue'
import Profile from '../views/profile/Profile.vue'
import ProfileEdit from '../views/profile/ProfileEdit.vue'
// @ts-ignore
import AddressManagement from '../views/profile/AddressManagement.vue'
import SecuritySettings from '../views/profile/SecuritySettings.vue'
// @ts-ignore
import OrderList from '../views/profile/OrderList.vue'
// @ts-ignore
import Login from '../views/auth/Login.vue'
// @ts-ignore
import Register from '../views/auth/Register.vue'
// 商家端相关组件
import MerchantLayout from '../views/merchant/MerchantLayout.vue'
import Dashboard from '../views/merchant/Dashboard.vue'
import Products from '../views/merchant/Products.vue'
import Orders from '../views/merchant/Orders.vue'
import Analytics from '../views/merchant/Analytics.vue'
import Settings from '../views/merchant/Settings.vue'
import MerchantAuth from '../views/merchant/MerchantAuth.vue'
import MerchantRegister from '../views/merchant/MerchantRegister.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/profile/edit',
    name: 'ProfileEdit',
    component: ProfileEdit
  },
  {
    path: '/profile/addresses',
    name: 'AddressManagement',
    component: AddressManagement
  },
  {
    path: '/profile/security',
    name: 'SecuritySettings',
    component: SecuritySettings
  },
  {
    path: '/profile/orders',
    name: 'OrderList',
    component: OrderList
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/merchant/auth',
    name: 'MerchantAuth',
    component: MerchantAuth,
    meta: { title: '商家登录' }
  },
  {
    path: '/merchant/register',
    name: 'MerchantRegister',
    component: MerchantRegister,
    meta: { title: '商家注册' }
  },
  {
    path: '/merchant',
    name: 'Merchant',
    component: MerchantLayout,
    redirect: '/merchant/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'MerchantDashboard',
        component: Dashboard,
        meta: { title: '商家工作台' }
      },
      {
        path: 'products',
        name: 'MerchantProducts',
        component: Products,
        meta: { title: '商品管理' }
      },
      {
        path: 'orders',
        name: 'MerchantOrders',
        component: Orders,
        meta: { title: '订单管理' }
      },
      {
        path: 'analytics',
        name: 'MerchantAnalytics',
        component: Analytics,
        meta: { title: '数据分析' }
      },
      {
        path: 'settings',
        name: 'MerchantSettings',
        component: Settings,
        meta: { title: '店铺设置' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
