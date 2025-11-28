// @ts-ignore
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home/Home.vue'
import ProductDetail from '../views/product/ProductDetail.vue'
import Cart from '../views/cart/Cart.vue'
import Checkout from '../views/checkout/Checkout.vue'
import Profile from '../views/profile/Profile.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router