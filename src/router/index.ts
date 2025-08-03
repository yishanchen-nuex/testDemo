import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/tableElementPlus',
    name: 'TableElementPlus',
    component: () => import('../views/TableElementPlus.vue'),
  },
  {
    path: '/todoListDefult',
    name: 'TodoListDefult',
    component: () => import('../views/TodoListDefult.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
