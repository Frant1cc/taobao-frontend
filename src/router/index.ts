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
import { useUserStore } from '@/stores/user'

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
    component: Cart,
    meta: { requiresAuth: true }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/edit',
    name: 'ProfileEdit',
    component: ProfileEdit,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/addresses',
    name: 'AddressManagement',
    component: AddressManagement,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/security',
    name: 'SecuritySettings',
    component: SecuritySettings,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/orders',
    name: 'OrderList',
    component: OrderList,
    meta: { requiresAuth: true }
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 添加路由守卫
router.beforeEach((to: any, from: any, next: any) => {
  const userStore = useUserStore()
  
  // 检查路由是否需要认证
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    // 如果需要认证但用户未登录，重定向到登录页面，并携带提示信息
    next({
      path: '/login',
      query: { 
        redirect: 'auth-required',
        from: to.fullPath 
      }
    })
  } else {
    // 否则正常导航
    next()
  }
})

export default router
