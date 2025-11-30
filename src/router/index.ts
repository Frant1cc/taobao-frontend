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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
