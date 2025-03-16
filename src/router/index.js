import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/orders'
  },
  {
    path: '/orders',
    name: 'OrderList',
    component: () => import('../views/orders/OrderList.vue')
  },
  {
    path: '/orders/:id',
    name: 'OrderDetail',
    component: () => import('../views/orders/OrderDetail.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router