// @ts-ignore
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home/Home.vue'
import ProductDetail from '../views/product/ProductDetail.vue'

// 创建临时的购物车和我的页面组件
const Cart = {
  template: '<div class="page-container"><h1>购物车页面</h1><p>这里是购物车内容</p></div>'
}

const Profile = {
  template: '<div class="page-container"><h1>我的页面</h1><p>这里是个人中心内容</p></div>'
}

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