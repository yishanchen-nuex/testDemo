import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/table',
    name: 'Table',
    component: () => import('../views/Table.vue')
  },
  {
    path: '/table-container-test',
    name: 'TableContainerTest',
    component: () => import('../views/TableContainerTest.vue')
  },
  {
    path: '/table-grid-test',
    name: 'TableGridTest',
    component: () => import('../views/TableGridTest.vue')
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('../views/test.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 