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
// 商家端相关组件
import MerchantLayout from '../views/merchant/MerchantLayout.vue'
import MerchantDashboard from '../views/merchant/Dashboard.vue'
import Products from '../views/merchant/Products.vue'
import Orders from '../views/merchant/Orders.vue'
import Settings from '../views/merchant/Settings.vue'
import MerchantAuth from '../views/merchant/MerchantAuth.vue'
import MerchantRegister from '../views/merchant/MerchantRegister.vue'
// 管理端相关组件
import AdminLayout from '../views/admin/AdminLayout.vue'
import AdminLogin from '../views/admin/AdminLogin.vue'
import AdminDashboard from '../views/admin/Dashboard.vue'
import UserManagement from '../views/admin/UserManagement.vue'
import MerchantManagement from '../views/admin/MerchantManagement.vue'
import AuditManagement from '../views/admin/AuditManagement.vue'

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
    path: '/profile/security/password',
    redirect: '/profile/security'
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
        component: MerchantDashboard,
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
        path: 'settings',
        name: 'MerchantSettings',
        component: Settings,
        meta: { title: '店铺设置' }
      }
    ]
  },
  // 管理端路由
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin,
    meta: { title: '管理后台登录' }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminLayout,
    redirect: '/admin/dashboard',
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: { title: '数据概览' }
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: UserManagement,
        meta: { title: '用户管理' }
      },
      {
        path: 'merchants',
        name: 'MerchantManagement',
        component: MerchantManagement,
        meta: { title: '商家管理' }
      },
      {
        path: 'audit',
        name: 'AuditManagement',
        component: AuditManagement,
        meta: { title: '审核管理' }
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        component: () => import('@/views/admin/Settings.vue'),
        meta: { title: '系统设置' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 添加路由守卫
router.beforeEach((to: any, _from: any, next: any) => {
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
// 路由守卫 - 权限验证（已禁用）
// router.beforeEach((to, from, next) => {
//   // 设置页面标题
//   if (to.meta.title) {
//     document.title = `${to.meta.title} - 淘宝管理后台`
//   }
//   
//   // 检查是否需要管理员权限
//   if (to.meta.requiresAuth && to.meta.role === 'admin') {
//     const token = localStorage.getItem('admin_token')
//     const adminInfo = localStorage.getItem('admin_info')
//     
//     if (!token || !adminInfo) {
//       // 未登录，跳转到管理端登录页
//       next('/admin/login')
//       return
//     }
//     
//     try {
//       const admin = JSON.parse(adminInfo)
//       // 可以在这里添加更详细的权限检查
//       if (admin.role !== 'super_admin' && admin.role !== 'admin') {
//         // 权限不足
//         next('/admin/login')
//         return
//     }
//     } catch (error) {
//       // 解析失败，清除无效数据
//       localStorage.removeItem('admin_token')
//       localStorage.removeItem('admin_info')
//       next('/admin/login')
//       return
//     }
//   }
//   
//   // 如果已经登录管理端，访问登录页则跳转到首页
//   if (to.path === '/admin/login') {
//     const token = localStorage.getItem('admin_token')
//     if (token) {
//       next('/admin/dashboard')
//       return
//     }
//   }
//   
//   next()
// })

export default router
